/**
 * MiniMap — Shows a bird's-eye view of the world with all player positions.
 * Premium cosmic theme with cyan accents.
 * Mobile-responsive: smaller size, hides when chat is open on mobile.
 */
import { useRef, useEffect, useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function MiniMap() {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const self = useGameStore((s) => s.self);
  const world = useGameStore((s) => s.world);
  const isChatOpen = useGameStore((s) => s.isChatOpen);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mapWidth = isMobile ? 100 : 180;
  const mapHeight = isMobile ? 66 : 120;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const draw = () => {
      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // Background
      ctx.fillStyle = 'rgba(10, 10, 20, 0.9)';
      ctx.fillRect(0, 0, mapWidth, mapHeight);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 0.5;
      const gridSize = 100;
      const scaleX = mapWidth / world.width;
      const scaleY = mapHeight / world.height;

      for (let x = 0; x <= world.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x * scaleX, 0);
        ctx.lineTo(x * scaleX, mapHeight);
        ctx.stroke();
      }
      for (let y = 0; y <= world.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y * scaleY);
        ctx.lineTo(mapWidth, y * scaleY);
        ctx.stroke();
      }

      // Border
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, mapWidth, mapHeight);

      // Other players
      const playerState = useGameStore.getState().players;
      Object.values(playerState).forEach((p) => {
        const px = p.x * scaleX;
        const py = p.y * scaleY;
        ctx.beginPath();
        ctx.arc(px, py, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.fill();
      });

      // Self player
      const selfState = useGameStore.getState().self;
      if (selfState) {
        const sx = selfState.x * scaleX;
        const sy = selfState.y * scaleY;

        // Proximity radius
        const proxRadius = 150 * scaleX;
        ctx.beginPath();
        ctx.arc(sx, sy, proxRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.04)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Player dot
        ctx.beginPath();
        ctx.arc(sx, sy, isMobile ? 2 : 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5ff';
        ctx.fill();

        // Glow ring
        ctx.beginPath();
        ctx.arc(sx, sy, isMobile ? 3 : 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [world, mapWidth, mapHeight, isMobile]);

  if (!self) return null;

  // Hide minimap when chat is open on mobile
  if (isMobile && isChatOpen) return null;

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        zIndex: 20,
        width: mapWidth + 2,
        height: mapHeight + 22,
        overflow: 'hidden',
        background: 'rgba(10, 10, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(0, 229, 255, 0.08)',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        ...(isMobile
          ? { top: 44, left: 8 }
          : { bottom: 54, left: 16 }
        ),
      }}
    >
      {/* Label */}
      <div
        style={{
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0, 229, 255, 0.06)',
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: '#00e5ff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Map
        </span>
        <span
          style={{
            fontSize: 8,
            fontFamily: 'var(--font-mono)',
            color: '#4b5563',
          }}
        >
          {world.width}×{world.height}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={mapWidth}
        height={mapHeight}
        style={{ display: 'block' }}
      />
    </div>
  );
}
