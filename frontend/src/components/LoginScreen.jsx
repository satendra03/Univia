/**
 * LoginScreen — Entry screen where users choose a username.
 * Full-screen cosmic themed login with animated background.
 * Mobile-responsive: adapts layout, hides keyboard hints on touch devices.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/useGameStore';
import { Rocket, Gamepad2 } from 'lucide-react';

export default function LoginScreen({ onJoin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const loginError = useGameStore((s) => s.loginError);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters');
      return;
    }
    if (trimmed.length > 20) {
      setError('Username must be 20 characters or less');
      return;
    }
    if (!/^[a-zA-Z0-9_\-\s]+$/.test(trimmed)) {
      setError('Only letters, numbers, spaces, hyphens, and underscores');
      return;
    }

    useGameStore.getState().setLoginError('');
    setError('');
    onJoin(trimmed);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: '#0a0a0e',
        color: '#f3f4f6',
      }}
    >
      {/* Animated background particles */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: 'white',
              opacity: Math.random() * 0.5 + 0.1,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Login Card */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '440px',
          padding: 'clamp(28px, 5vw, 48px)',
          background: 'rgba(17, 17, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow:
            '0 0 80px rgba(0, 229, 255, 0.06), 0 8px 40px rgba(0, 0, 0, 0.5)',
          borderRadius: '20px',
        }}
      >
        {/* Back button */}
        {(
          <button
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              transition: 'color 0.2s',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.background = 'none';
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}

        {/* Logo / Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              marginBottom: 16,
              background: 'rgba(0, 229, 255, 0.06)',
              border: '2px solid rgba(0, 229, 255, 0.25)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.12)',
            }}
          >
            <Rocket size={34} color="#00e5ff" />
          </div>
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 32px)',
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            Uni<span style={{ color: '#00e5ff' }}>via</span>
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Enter the universe. Meet nearby travelers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="username-input"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 10,
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              Choose your name
            </label>
            <input
              id="username-input"
              type="text"
              className="input-cosmos"
              placeholder="CosmicTraveler"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              autoFocus
              maxLength={20}
              style={{
                fontSize: '16px',
                padding: '14px 18px',
                borderRadius: '12px',
              }}
            />
            {error && (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: 'var(--accent-rose)',
                }}
              >
                {error}
              </p>
            )}
            {loginError && !error && (
              <p
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  color: 'var(--accent-rose)',
                }}
              >
                {loginError}
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'var(--font-sans)',
              color: '#0a0a1a',
              background: 'linear-gradient(135deg, #00e5ff 0%, #00b8d4 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 24px rgba(0, 229, 255, 0.3)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 8px 32px rgba(0, 229, 255, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 24px rgba(0, 229, 255, 0.3)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
          >
            Enter Univia
          </button>
        </form>

        {/* Controls hint — different for touch vs desktop */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid rgba(129, 140, 248, 0.08)',
          }}
        >
          <p
            style={{
              fontSize: 11,
              textAlign: 'center',
              marginBottom: 12,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            Controls
          </p>
          {isTouchDevice ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                color: 'var(--text-muted)',
              }}
            >
              <Gamepad2 size={16} />
              <span>Virtual joystick to move</span>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['W', 'A', 'S', 'D'].map((key) => (
                    <kbd
                      key={key}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        fontSize: 11,
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        background: 'rgba(0, 229, 255, 0.06)',
                        border: '1px solid rgba(0, 229, 255, 0.15)',
                        color: '#00e5ff',
                      }}
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}
              >
                or
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {['↑', '↓', '←', '→'].map((key) => (
                  <kbd
                    key={key}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      fontSize: 12,
                      background: 'rgba(0, 229, 255, 0.06)',
                      border: '1px solid rgba(0, 229, 255, 0.15)',
                      color: '#00e5ff',
                    }}
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
