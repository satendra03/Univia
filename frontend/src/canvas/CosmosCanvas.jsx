/**
 * CosmosCanvas — Main PixiJS canvas rendering component.
 *
 * Renders:
 * - Star field background
 * - Grid pattern
 * - Proximity radius indicator
 * - Player avatars with labels
 * - Connection lines between nearby users
 * - Floating emoji reactions above avatars
 */
import { useEffect, useRef, useCallback } from 'react';
import { Application, Graphics, Text, TextStyle, Container } from 'pixi.js';
import { useGameStore } from '../store/useGameStore';
import { hslToHex } from '../utils/colors';
import { AVATAR_RADIUS, PROXIMITY_RADIUS } from '../utils/constants';

export default function CosmosCanvas() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const avatarsRef = useRef({});       // id → { container, gfx, label, glow }
  const selfAvatarRef = useRef(null);
  const starsRef = useRef([]);
  const proximityCircleRef = useRef(null);
  const connectionLinesRef = useRef(null);
  const worldContainerRef = useRef(null);
  const cameraRef = useRef({ x: 0, y: 0 });
  const floatingEmojisRef = useRef([]); // { text, container, startTime, userId }
  const seenReactionsRef = useRef(new Set()); // Tracks all spawned reaction IDs to prevent duplicates

  // ─── Initialize PixiJS ──────────────────────────────────────
  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      if (!canvasRef.current || destroyed) return;

      const app = new Application();
      await app.init({
        background: 0x0a0a1a,
        resizeTo: window,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      canvasRef.current.appendChild(app.canvas);
      appRef.current = app;

      // World container
      const worldContainer = new Container();
      app.stage.addChild(worldContainer);
      worldContainerRef.current = worldContainer;

      // Layers
      createStarField(worldContainer);
      createGrid(worldContainer);

      // Connection lines layer
      const linesGfx = new Graphics();
      worldContainer.addChild(linesGfx);
      connectionLinesRef.current = linesGfx;

      // Proximity circle
      const proximityGfx = new Graphics();
      worldContainer.addChild(proximityGfx);
      proximityCircleRef.current = proximityGfx;

      // Start render loop
      app.ticker.add(() => {
        updateRender();
      });
    };

    init();

    const handleResize = () => {
      if (appRef.current) {
        appRef.current.renderer.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      destroyed = true;
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, []);

  // ─── Create Star Field ──────────────────────────────────────
  const createStarField = useCallback((container) => {
    const { width: worldW, height: worldH } = useGameStore.getState().world;
    const starGfx = new Graphics();

    const starCount = 300;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * worldW;
      const y = Math.random() * worldH;
      const size = Math.random() * 2 + 0.5;
      const alpha = Math.random() * 0.6 + 0.2;

      starGfx.circle(x, y, size);
      starGfx.fill({ color: 0xffffff, alpha });
    }

    container.addChild(starGfx);
    starsRef.current.push(starGfx);
  }, []);

  // ─── Create Grid ────────────────────────────────────────────
  const createGrid = useCallback((container) => {
    const { width: worldW, height: worldH } = useGameStore.getState().world;
    const gridGfx = new Graphics();
    const gridSize = 100;

    for (let x = 0; x <= worldW; x += gridSize) {
      gridGfx.moveTo(x, 0);
      gridGfx.lineTo(x, worldH);
    }
    for (let y = 0; y <= worldH; y += gridSize) {
      gridGfx.moveTo(0, y);
      gridGfx.lineTo(worldW, y);
    }
    gridGfx.stroke({ color: 0x1a1a3e, width: 1, alpha: 0.4 });

    gridGfx.rect(0, 0, worldW, worldH);
    gridGfx.stroke({ color: 0x818cf8, width: 2, alpha: 0.3 });

    container.addChild(gridGfx);
  }, []);

  // ─── Create / Get Avatar ───────────────────────────────────
  const getOrCreateAvatar = useCallback((id, username, colorStr, isSelf = false) => {
    if (avatarsRef.current[id]) return avatarsRef.current[id];

    const container = new Container();
    const color = hslToHex(colorStr);

    // Glow ring
    const glow = new Graphics();
    glow.circle(0, 0, AVATAR_RADIUS + 8);
    glow.fill({ color, alpha: 0.12 });
    container.addChild(glow);

    // Main avatar circle
    const gfx = new Graphics();
    gfx.circle(0, 0, AVATAR_RADIUS);
    gfx.fill({ color });

    // Inner highlight
    gfx.circle(-5, -5, AVATAR_RADIUS * 0.35);
    gfx.fill({ color: 0xffffff, alpha: 0.2 });

    container.addChild(gfx);

    // Username label
    const labelStyle = new TextStyle({
      fontFamily: 'Inter, sans-serif',
      fontSize: 12,
      fontWeight: isSelf ? '700' : '500',
      fill: isSelf ? 0xffffff : 0xe8e8f0,
      align: 'center',
      dropShadow: {
        color: 0x000000,
        blur: 4,
        distance: 1,
        alpha: 0.8,
      },
    });

    const label = new Text({ text: isSelf ? `${username} (you)` : username, style: labelStyle });
    label.anchor.set(0.5);
    label.y = AVATAR_RADIUS + 16;
    container.addChild(label);

    // Self indicator ring
    if (isSelf) {
      const ring = new Graphics();
      ring.circle(0, 0, AVATAR_RADIUS + 3);
      ring.stroke({ color: 0xffffff, width: 2, alpha: 0.6 });
      container.addChild(ring);
    }

    if (worldContainerRef.current) {
      worldContainerRef.current.addChild(container);
    }

    const avatarData = { container, gfx, label, glow, color };
    avatarsRef.current[id] = avatarData;

    if (isSelf) selfAvatarRef.current = avatarData;

    return avatarData;
  }, []);

  // ─── Remove Avatar ─────────────────────────────────────────
  const removeAvatar = useCallback((id) => {
    const avatar = avatarsRef.current[id];
    if (avatar) {
      avatar.container.destroy({ children: true });
      delete avatarsRef.current[id];
    }
  }, []);

  // ─── Spawn Floating Emoji ──────────────────────────────────
  const spawnFloatingEmoji = useCallback((userId, emoji) => {
    if (!worldContainerRef.current) return;

    const avatar = avatarsRef.current[userId];
    if (!avatar) return;

    const style = new TextStyle({
      fontSize: 28,
      align: 'center',
    });

    const text = new Text({ text: emoji, style });
    text.anchor.set(0.5);
    text.x = avatar.container.x + (Math.random() - 0.5) * 20;
    text.y = avatar.container.y - AVATAR_RADIUS - 20;

    worldContainerRef.current.addChild(text);

    floatingEmojisRef.current.push({
      text,
      startTime: Date.now(),
      startX: text.x,
      startY: text.y,
    });
  }, []);

  // ─── Main Render Loop ──────────────────────────────────────
  const updateRender = useCallback(() => {
    const state = useGameStore.getState();
    const { self, players, nearbyUsers, world, floatingReactions } = state;

    if (!self || !worldContainerRef.current) return;

    // ── Update Self Avatar ──
    const selfAvatar = getOrCreateAvatar(self.id, self.username, self.color, true);
    selfAvatar.container.x = self.x;
    selfAvatar.container.y = self.y;

    // Pulsing glow
    const pulse = 0.12 + Math.sin(Date.now() / 500) * 0.06;
    selfAvatar.glow.alpha = pulse;

    // ── Update Proximity Circle ──
    if (proximityCircleRef.current) {
      const pg = proximityCircleRef.current;
      pg.clear();
      pg.circle(self.x, self.y, PROXIMITY_RADIUS);
      pg.stroke({ color: 0x818cf8, width: 1.5, alpha: 0.2 });
      pg.fill({ color: 0x818cf8, alpha: 0.03 });
    }

    // ── Update Other Avatars ──
    const activePlayerIds = new Set();
    for (const [id, player] of Object.entries(players)) {
      activePlayerIds.add(id);
      const avatar = getOrCreateAvatar(id, player.username, player.color);

      const lerpFactor = 0.15;
      avatar.container.x += (player.x - avatar.container.x) * lerpFactor;
      avatar.container.y += (player.y - avatar.container.y) * lerpFactor;
    }

    // Remove disconnected avatars
    for (const id of Object.keys(avatarsRef.current)) {
      if (id !== self.id && !activePlayerIds.has(id)) {
        removeAvatar(id);
      }
    }

    // ── Draw connection lines ──
    if (connectionLinesRef.current) {
      const linesGfx = connectionLinesRef.current;
      linesGfx.clear();

      for (const nearby of nearbyUsers) {
        const otherAvatar = avatarsRef.current[nearby.id];
        if (otherAvatar) {
          linesGfx.moveTo(self.x, self.y);
          linesGfx.lineTo(otherAvatar.container.x, otherAvatar.container.y);
          linesGfx.stroke({ color: 0x818cf8, width: 1.5, alpha: 0.35 });

          const mx = (self.x + otherAvatar.container.x) / 2;
          const my = (self.y + otherAvatar.container.y) / 2;
          linesGfx.circle(mx, my, 3);
          linesGfx.fill({ color: 0x818cf8, alpha: 0.5 });
        }
      }
    }

    // ── Spawn new floating reactions ──
    for (const reaction of floatingReactions) {
      const key = `${reaction.userId}-${reaction.id}`;
      if (!seenReactionsRef.current.has(key)) {
        seenReactionsRef.current.add(key);
        const avatar = avatarsRef.current[reaction.userId];
        if (avatar && worldContainerRef.current) {
          const style = new TextStyle({ fontSize: 28, align: 'center' });
          const text = new Text({ text: reaction.emoji, style });
          text.anchor.set(0.5);
          text.x = avatar.container.x + (Math.random() - 0.5) * 20;
          text.y = avatar.container.y - AVATAR_RADIUS - 20;
          worldContainerRef.current.addChild(text);

          floatingEmojisRef.current.push({
            text,
            userId: reaction.userId,
            reactionId: reaction.id,
            startTime: Date.now(),
            startY: text.y,
          });
        }
      }
    }

    // ── Animate floating emojis ──
    const now = Date.now();
    const FLOAT_DURATION = 2000; // 2 seconds

    for (let i = floatingEmojisRef.current.length - 1; i >= 0; i--) {
      const emoji = floatingEmojisRef.current[i];
      const elapsed = now - emoji.startTime;
      const progress = elapsed / FLOAT_DURATION;

      if (progress >= 1) {
        // Remove finished emoji
        emoji.text.destroy();
        floatingEmojisRef.current.splice(i, 1);
        continue;
      }

      // Float upward and fade out
      emoji.text.y = emoji.startY - progress * 60;
      emoji.text.alpha = 1 - progress;
      emoji.text.scale.set(1 + progress * 0.3); // Grow slightly
    }

    // ── Camera Follow ──
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    const targetCamX = self.x - screenW / 2;
    const targetCamY = self.y - screenH / 2;

    const clampedX = Math.max(0, Math.min(world.width - screenW, targetCamX));
    const clampedY = Math.max(0, Math.min(world.height - screenH, targetCamY));

    cameraRef.current.x += (clampedX - cameraRef.current.x) * 0.1;
    cameraRef.current.y += (clampedY - cameraRef.current.y) * 0.1;

    worldContainerRef.current.x = -cameraRef.current.x;
    worldContainerRef.current.y = -cameraRef.current.y;
  }, [getOrCreateAvatar, removeAvatar]);

  return (
    <div
      ref={canvasRef}
      id="cosmos-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        touchAction: 'none',
        overflow: 'hidden',
      }}
    />
  );
}
