/**
 * UserList — Shows nearby users with clickable profiles.
 * Premium cosmic theme with cyan accents.
 * On mobile: hidden by default, shown via toggle in the HUD stats area.
 * On desktop: always visible in sidebar.
 */
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function UserList() {
  const nearbyDetails = useGameStore((s) => s.nearbyDetails);
  const nearbyUsers = useGameStore((s) => s.nearbyUsers);
  const players = useGameStore((s) => s.players);
  const [profileOpen, setProfileOpen] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showOnMobile, setShowOnMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const entries = Object.entries(nearbyDetails);

  if (entries.length === 0) return null;

  const selectedPlayer = profileOpen ? players[profileOpen] : null;
  const selectedDetail = profileOpen ? nearbyDetails[profileOpen] : null;

  // On mobile: show a small toggle pill, then expand the list
  if (isMobile && !showOnMobile) {
    return (
      <button
        onClick={() => setShowOnMobile(true)}
        className="animate-fade-in"
        style={{
          position: 'fixed',
          top: 48,
          right: 8,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          cursor: 'pointer',
          background: 'rgba(10, 10, 20, 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 229, 255, 0.08)',
          borderRadius: 20,
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            display: 'inline-block',
            background: '#00e5ff',
            boxShadow: '0 0 8px rgba(0, 229, 255, 0.5)',
          }}
        />
        <span style={{ fontSize: 10, fontWeight: 600, color: '#9ca3af' }}>
          {nearbyUsers.length} nearby
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <div
        className="animate-slide-in-right"
        style={{
          position: 'fixed',
          top: isMobile ? 48 : 104,
          right: 8,
          zIndex: 20,
          width: isMobile ? 'min(200px, calc(100vw - 16px))' : 220,
          background: 'rgba(10, 10, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.08)',
          borderRadius: 16,
          padding: '12px 14px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                display: 'inline-block',
                background: '#00e5ff',
                boxShadow: '0 0 8px rgba(0, 229, 255, 0.5)',
              }}
            />
            <h3
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#6b7280',
                margin: 0,
              }}
            >
              Nearby ({nearbyUsers.length})
            </h3>
          </div>
          {isMobile && (
            <button
              onClick={() => { setShowOnMobile(false); setProfileOpen(null); }}
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                cursor: 'pointer',
                color: '#6b7280',
                background: 'rgba(255, 255, 255, 0.04)',
                border: 'none',
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {entries.map(([userId, { username, color }]) => {
            const isInRange = nearbyUsers.some((u) => u.id === userId);
            const player = players[userId];
            return (
              <div
                key={userId}
                onClick={() => setProfileOpen(profileOpen === userId ? null : userId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 12,
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                  background: profileOpen === userId ? 'rgba(0, 229, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  border: profileOpen === userId ? '1px solid rgba(0, 229, 255, 0.1)' : '1px solid transparent',
                  opacity: isInRange ? 1 : 0.4,
                }}
                onMouseEnter={(e) => {
                  if (profileOpen !== userId) e.currentTarget.style.background = 'rgba(0, 229, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (profileOpen !== userId) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    background: color,
                    color: '#0a0a1a',
                    boxShadow: `0 0 8px ${color}44`,
                  }}
                >
                  {username?.[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: '#e8e8f0',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}
                  >
                    {username}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: isInRange ? '#00e5ff' : '#6b7280',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                    }}
                  >
                    {player?.status || (isInRange ? 'In range' : 'Moved away')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
