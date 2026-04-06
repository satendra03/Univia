/**
 * MiniMap — Shows a bird's-eye view of the world with all player positions.
 * Mobile-responsive: smaller size, hides when chat is open on mobile.
 * Positioned at bottom-left on mobile (above joystick), bottom-right on desktop.
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

      ctx.fillStyle = 'rgba(10, 10, 26, 0.8)';
      ctx.fillRect(0, 0, mapWidth, mapHeight);

      ctx.strokeStyle = 'rgba(129, 140, 248, 0.08)';
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

      const playerState = useGameStore.getState().players;
      Object.values(playerState).forEach((p) => {
        const px = p.x * scaleX;
        const py = p.y * scaleY;
        ctx.beginPath();
        ctx.arc(px, py, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.fill();
      });

      const selfState = useGameStore.getState().self;
      if (selfState) {
        const sx = selfState.x * scaleX;
        const sy = selfState.y * scaleY;

        const proxRadius = 150 * scaleX;
        ctx.beginPath();
        ctx.arc(sx, sy, proxRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(129, 140, 248, 0.06)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, isMobile ? 2 : 3, 0, Math.PI * 2);
        ctx.fillStyle = '#818cf8';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, isMobile ? 3 : 5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
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
    <div className="fixed z-20 glass-panel-sm overflow-hidden animate-fade-in"
         style={{
           width: mapWidth + 2,
           height: mapHeight + 2,
           // Mobile: top-left below HUD. Desktop: bottom-right
           ...(isMobile
             ? { top: 44, left: 8 }
             : { bottom: isChatOpen ? '460px' : '16px', right: '16px' }
           ),
           transition: isMobile ? 'none' : 'bottom 0.3s ease',
         }}>
      <canvas
        ref={canvasRef}
        width={mapWidth}
        height={mapHeight}
        style={{ display: 'block' }}
      />
      <div className="absolute top-0.5 left-1.5 text-[8px] font-mono"
           style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
        MAP
      </div>
    </div>
  );
}
