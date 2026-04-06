/**
 * LoginScreen — Entry screen where users choose a username.
 * Full-screen cosmic themed login with animated background.
 * Mobile-responsive: adapts layout, hides keyboard hints on touch devices.
 */
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export default function LoginScreen({ onJoin }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1040 40%, #0d1117 100%)' }}>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
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
      <div className="glass-panel w-full max-w-md animate-fade-in relative"
           style={{
             padding: 'clamp(24px, 5vw, 40px)',
             boxShadow: '0 0 80px rgba(129, 140, 248, 0.1), 0 8px 32px rgba(0,0,0,0.4)',
           }}>

        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-4"
               style={{
                 background: 'linear-gradient(135deg, rgba(129,140,248,0.2), rgba(167,139,250,0.2))',
                 border: '2px solid rgba(129,140,248,0.3)',
               }}>
            <span className="text-3xl sm:text-4xl">🌌</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2"
              style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Virtual Cosmos
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            Enter the universe. Meet nearby travelers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-input" className="block text-sm font-medium mb-2"
                   style={{ color: 'var(--text-secondary)' }}>
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
              maxLength={20}
              style={{ fontSize: '16px' }} /* 16px prevents iOS zoom on focus */
            />
            {error && (
              <p className="mt-2 text-xs" style={{ color: 'var(--accent-rose)' }}>{error}</p>
            )}
            {loginError && !error && (
              <p className="mt-2 text-xs" style={{ color: 'var(--accent-rose)' }}>{loginError}</p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full text-base">
            <span>🚀</span>
            Enter the Cosmos
          </button>
        </form>

        {/* Controls hint — different for touch vs desktop */}
        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
          <p className="text-xs text-center mb-3" style={{ color: 'var(--text-muted)' }}>Controls</p>
          {isTouchDevice ? (
            <div className="flex justify-center items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <span className="text-lg">🕹️</span>
                <span>Virtual joystick to move</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {['W', 'A', 'S', 'D'].map((key) => (
                    <kbd key={key} className="inline-flex items-center justify-center w-7 h-7 rounded text-xs font-mono font-bold"
                         style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: 'var(--accent-indigo)' }}>
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
              <span className="text-xs self-center" style={{ color: 'var(--text-muted)' }}>or</span>
              <div className="flex items-center gap-1">
                {['↑', '↓', '←', '→'].map((key) => (
                  <kbd key={key} className="inline-flex items-center justify-center w-7 h-7 rounded text-xs"
                       style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: 'var(--accent-indigo)' }}>
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
