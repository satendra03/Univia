/**
 * HUD — Heads-Up Display overlay showing player info, stats,
 * and a CHAT TOGGLE BUTTON for reopening chat after closing.
 *
 * Premium cosmic theme with cyan accents and glassmorphism.
 * Mobile-responsive: Compact layout on small screens.
 */
import { useGameStore } from '../store/useGameStore';
import { useChatStore } from '../store/useChatStore';
import { Volume2, VolumeX } from 'lucide-react';
import { initAudio, playSound } from '../utils/sounds';

export default function HUD() {
  const self = useGameStore((s) => s.self);
  const players = useGameStore((s) => s.players);
  const isConnected = useGameStore((s) => s.isConnected);
  const nearbyUsers = useGameStore((s) => s.nearbyUsers);
  const isChatOpen = useGameStore((s) => s.isChatOpen);
  const unreadCount = useChatStore((s) => s.unreadCount);
  const messages = useChatStore((s) => s.messages);
  const isMuted = useGameStore((s) => s.isMuted);
  const setMuted = useGameStore((s) => s.setMuted);

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

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setMuted(newMuted);
    
    // Always attempt to wake up the audio context on user gesture
    try {
      initAudio();
      if (!newMuted) {
        // Very briefly wait for state to propagate, then play confirmation pip
        setTimeout(() => playSound('message'), 50);
      }
    } catch (err) {
      console.warn('Audio context init failed:', err);
    }
  };

  return (
    <>
      {/* ── Top Left: Player Info ── */}
      <div
        className="animate-slide-in-right"
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 20,
          maxWidth: 'calc(50vw - 16px)',
          background: 'rgba(10, 10, 20, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.08)',
          borderRadius: 14,
          padding: '10px 14px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                background: self.color,
                color: '#0a0a1a',
                flexShrink: 0,
                boxShadow: `0 0 12px ${self.color}44`,
              }}
            >
              {self.username[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#e8e8f0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {self.username}
              </p>
              <p
                style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: '#6b7280',
                }}
              >
                ({Math.round(self.x)}, {Math.round(self.y)})
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleMute}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: isMuted ? '#ef4444' : '#00e5ff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            }}
            title={isMuted ? "Unmute sounds" : "Mute sounds"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              display: 'inline-block',
              background: isConnected ? '#34d399' : '#fb7185',
              boxShadow: isConnected ? '0 0 8px rgba(52,211,153,0.5)' : '0 0 8px rgba(251,113,133,0.5)',
            }}
          />
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      {/* ── Top Right: Stats ── */}
      <div
        className="animate-slide-in-right"
        style={{
          position: 'fixed',
          top: 12,
          right: 12,
          zIndex: 20,
          maxWidth: 'calc(50vw - 16px)',
          background: 'rgba(10, 10, 20, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 229, 255, 0.08)',
          borderRadius: 14,
          padding: '10px 14px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 12 }}>
            <span style={{ color: '#6b7280' }}>Online</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#34d399' }}>
              {playerCount}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 12 }}>
            <span style={{ color: '#6b7280' }}>Nearby</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#00e5ff' }}>
              {nearbyUsers.length}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, fontSize: 12 }}>
            <span style={{ color: '#6b7280' }}>World</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#9ca3af' }}>
              3000 × 2000
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Left: Controls Reminder ── */}
      <div
        className="controls-reminder glass-panel-sm"
        style={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          fontSize: 12,
          color: '#6b7280',
          background: 'rgba(10, 10, 20, 0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(0, 229, 255, 0.06)',
          borderRadius: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 3 }}>
          {['W', 'A', 'S', 'D'].map((k) => (
            <kbd
              key={k}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 5,
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                background: 'rgba(0, 229, 255, 0.06)',
                border: '1px solid rgba(0, 229, 255, 0.12)',
                color: '#00e5ff',
              }}
            >
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
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 30,
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            background: 'linear-gradient(135deg, #00e5ff, #00b8d4)',
            boxShadow: '0 4px 24px rgba(0, 229, 255, 0.35)',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 32px rgba(0, 229, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 229, 255, 0.35)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
                padding: '0 5px',
                background: '#fb7185',
                color: 'white',
                boxShadow: '0 2px 8px rgba(251,113,133,0.5)',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {hasNearby && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(0, 229, 255, 0.35)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}
            />
          )}
        </button>
      )}
    </>
  );
}
