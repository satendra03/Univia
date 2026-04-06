/**
 * UserList — Shows nearby users with clickable profiles.
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
        className="fixed z-20 glass-panel-sm px-3 py-1.5 flex items-center gap-1.5 cursor-pointer animate-fade-in"
        style={{ top: 48, right: 8, border: 'none', background: 'var(--glass-bg)' }}>
        <span className="status-dot nearby" />
        <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
          {nearbyUsers.length} nearby
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
    );
  }

  return (
    <>
      <div className="fixed z-20 glass-panel p-3 sm:p-4 animate-slide-in-right"
           style={{
             top: isMobile ? 48 : 80,
             right: 8,
             width: isMobile ? 'min(200px, calc(100vw - 16px))' : 220,
           }}>
        <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            <span className="status-dot nearby" />
            <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>
              Nearby ({nearbyUsers.length})
            </h3>
          </div>
          {isMobile && (
            <button
              onClick={() => { setShowOnMobile(false); setProfileOpen(null); }}
              className="w-5 h-5 rounded flex items-center justify-center text-[10px] cursor-pointer"
              style={{ color: 'var(--text-muted)', background: 'rgba(129,140,248,0.05)' }}>
              ✕
            </button>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          {entries.map(([userId, { username, color }]) => {
            const isInRange = nearbyUsers.some((u) => u.id === userId);
            const player = players[userId];
            return (
              <div key={userId}
                   onClick={() => setProfileOpen(profileOpen === userId ? null : userId)}
                   className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer"
                   style={{
                     background: profileOpen === userId ? 'rgba(129,140,248,0.12)' : 'rgba(129,140,248,0.05)',
                     opacity: isInRange ? 1 : 0.4,
                   }}
                   onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(129,140,248,0.1)'}
                   onMouseLeave={(e) => e.currentTarget.style.background = profileOpen === userId ? 'rgba(129,140,248,0.12)' : 'rgba(129,140,248,0.05)'}>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0"
                     style={{ background: color, color: '#0a0a1a' }}>
                  {username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {username}
                  </p>
                  <p className="text-[10px] sm:text-xs truncate" style={{ color: isInRange ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                    {player?.status || (isInRange ? 'In range' : 'Moved away')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Profile Popup ── */}
      {profileOpen && selectedDetail && (
        <div className="fixed z-25 glass-panel p-4 sm:p-5 animate-fade-in"
             style={{
               top: isMobile ? 48 : 80,
               right: isMobile ? 8 : 240,
               width: isMobile ? 'min(200px, calc(100vw - 16px))' : 220,
             }}>
          <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold"
                 style={{ background: selectedDetail.color, color: '#0a0a1a' }}>
              {selectedDetail.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {selectedDetail.username}
              </p>
              {selectedPlayer?.status && (
                <p className="text-[10px] sm:text-xs mt-1 px-2 py-0.5 rounded-full inline-block"
                   style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent-cyan)' }}>
                  {selectedPlayer.status}
                </p>
              )}
            </div>
            {selectedPlayer?.bio && (
              <p className="text-[10px] sm:text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {selectedPlayer.bio}
              </p>
            )}
            <button
              onClick={() => setProfileOpen(null)}
              className="text-[10px] sm:text-xs cursor-pointer mt-1"
              style={{ color: 'var(--text-muted)' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
