/**
 * useMovement — Hook for handling keyboard + joystick input and emitting movement.
 *
 * Features:
 * - WASD + Arrow key support
 * - Mobile joystick support (reads from game store)
 * - Client-side throttling (50ms)
 * - Position clamping to world bounds
 * - Diagonal movement normalization
 * - Collision avoidance (pushes apart overlapping avatars)
 */
import { useEffect, useRef, useCallback } from 'react';
import socketService from '../services/socketService';
import { useGameStore } from '../store/useGameStore';
import { EVENTS, MOVEMENT_SPEED, AVATAR_RADIUS } from '../utils/constants';

const COLLISION_RADIUS = AVATAR_RADIUS * 2; // Minimum distance between avatars

export default function useMovement() {
  const keysRef = useRef(new Set());
  const animFrameRef = useRef(null);
  const lastEmitRef = useRef(0);

  const THROTTLE_MS = 50;

  const gameLoop = useCallback(() => {
    const { self, world, players, joystickDirection, updateSelfPosition } = useGameStore.getState();
    if (!self) {
      animFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const keys = keysRef.current;
    let dx = 0;
    let dy = 0;

    // Keyboard input
    if (keys.has('w') || keys.has('arrowup')) dy -= 1;
    if (keys.has('s') || keys.has('arrowdown')) dy += 1;
    if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
    if (keys.has('d') || keys.has('arrowright')) dx += 1;

    // Mobile joystick input (additive — joystick overrides if active)
    if (joystickDirection.dx !== 0 || joystickDirection.dy !== 0) {
      dx = joystickDirection.dx;
      dy = joystickDirection.dy;
    }

    if (dx !== 0 || dy !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / length) * MOVEMENT_SPEED;
      dy = (dy / length) * MOVEMENT_SPEED;

      // Calculate new position
      let newX = self.x + dx;
      let newY = self.y + dy;

      // ── Collision Avoidance ──
      for (const [id, player] of Object.entries(players)) {
        const pdx = newX - player.x;
        const pdy = newY - player.y;
        const dist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (dist < COLLISION_RADIUS && dist > 0) {
          // Push away from the other player
          const overlap = COLLISION_RADIUS - dist;
          const pushX = (pdx / dist) * overlap * 0.5;
          const pushY = (pdy / dist) * overlap * 0.5;
          newX += pushX;
          newY += pushY;
        }
      }

      // Clamp to world bounds
      newX = Math.max(AVATAR_RADIUS, Math.min(world.width - AVATAR_RADIUS, newX));
      newY = Math.max(AVATAR_RADIUS, Math.min(world.height - AVATAR_RADIUS, newY));

      // Update local state immediately (no lag)
      updateSelfPosition(newX, newY);

      // Throttled emit to server
      const now = Date.now();
      if (now - lastEmitRef.current >= THROTTLE_MS) {
        socketService.emit(EVENTS.PLAYER_MOVE, { x: newX, y: newY });
        lastEmitRef.current = now;
      }
    }

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      keysRef.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e) => {
      keysRef.current.delete(e.key.toLowerCase());
    };

    const handlePreventDefault = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handlePreventDefault);

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handlePreventDefault);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameLoop]);
}