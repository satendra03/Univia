/**
 * HUD — Heads-Up Display overlay showing player info, stats,
 * and a CHAT TOGGLE BUTTON for reopening chat after closing.
 *
 * Mobile-responsive: Compact layout on small screens.
 */
import { useGameStore } from '../store/useGameStore';
import { useChatStore } from '../store/useChatStore';

export default function HUD() {
  const self = useGameStore((s) => s.self);
  const players = useGameStore((s) => s.players);
  const isConnected = useGameStore((s) => s.isConnected);
  const nearbyUsers = useGameStore((s) => s.nearbyUsers);
  const isChatOpen = useGameStore((s) => s.isChatOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const messages = useChatStore((s) => s.messages);

  const playerCount = Object.keys(players).length + 1;
  const hasNearby = nearbyUsers.length > 0;
  const hasMessages = messages.length > 0;
  const showChatButton = hasNearby || unreadCount > 0 || hasMessages;

  if (!self) return null;

  const handleToggleChat = () => {
    const store = useGameStore.getState();
    store.toggleChat();
    if (!store.isChatOpen) {
      useChatStore.getState().clearUnread();
    }
  };

  return (
    <>
      {/* ── Top Left: Player Info (compact on mobile) ── */}
      <div className="fixed top-2 left-2 sm:top-4 sm:left-4 z-20 glass-panel-sm p-2 sm:p-4 animate-slide-in-right"
           style={{ maxWidth: 'calc(50vw - 8px)' }}>
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
               style={{ background: self.color, color: '#0a0a1a' }}>
            {self.username[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {self.username}
            </p>
            <p className="text-[10px] sm:text-xs font-mono hidden sm:block" style={{ color: 'var(--text-muted)' }}>
              ({Math.round(self.x)}, {Math.round(self.y)})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs" style={{ color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1">
            <span className={`status-dot ${isConnected ? 'online' : ''}`}
                  style={!isConnected ? { background: 'var(--accent-rose)' } : {}} />
            <span className="hidden sm:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* ── Top Right: Stats (compact on mobile) ── */}
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-20 glass-panel-sm p-2 sm:p-4 animate-slide-in-right"
           style={{ maxWidth: 'calc(50vw - 8px)' }}>
        <div className="space-y-1 sm:space-y-2.5">
          <div className="flex items-center justify-between gap-3 text-[10px] sm:text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Online</span>
            <span className="font-mono font-semibold" style={{ color: 'var(--accent-emerald)' }}>
              {playerCount}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-[10px] sm:text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Nearby</span>
            <span className="font-mono font-semibold" style={{ color: 'var(--accent-cyan)' }}>
              {nearbyUsers.length}
            </span>
          </div>
          <div className="hidden sm:flex items-center justify-between gap-3 text-xs">
            <span style={{ color: 'var(--text-muted)' }}>World</span>
            <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
              3000 × 2000
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Left: Controls Reminder (hidden on mobile via CSS) ── */}
      <div className="fixed bottom-4 left-4 z-20 glass-panel-sm controls-reminder px-3 py-2 flex items-center gap-2 text-xs"
           style={{ color: 'var(--text-muted)' }}>
        <div className="flex gap-0.5">
          {['W', 'A', 'S', 'D'].map((k) => (
            <kbd key={k} className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-mono"
                 style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.15)', color: 'var(--accent-indigo)' }}>
              {k}
            </kbd>
          ))}
        </div>
        <span>to move</span>
      </div>

      {/* ── Chat Toggle Button ── */}
      {showChatButton && !isChatOpen && (
        <button
          onClick={handleToggleChat}
          className="fixed bottom-4 right-4 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.9), rgba(167,139,250,0.9))',
            boxShadow: '0 4px 20px rgba(129,140,248,0.4)',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(129,140,248,0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(129,140,248,0.4)';
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold px-1"
                  style={{
                    background: 'var(--accent-rose)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(251,113,133,0.5)',
                  }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {hasNearby && (
            <span className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px solid rgba(129,140,248,0.4)',
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }} />
          )}
        </button>
      )}
    </>
  );
}
