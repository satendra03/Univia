/**
 * PageLayout — Reusable layout wrapper for static pages.
 * Navbar and footer match the landing page exactly for visual consistency.
 */
import { useNavigate, useLocation } from 'react-router-dom';

const CYAN = '#00e5ff';
const BG = '#0a0a0e';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

export default function PageLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'About', path: '/about' },
  ];

  const footerLinks = [
    { label: 'Docs', path: '/docs' },
    { label: 'Features', path: '/features' },
    { label: 'Privacy', path: '/privacy' },
    { label: 'Terms', path: '/terms' },
  ];

  return (
    <div style={{
      background: BG,
      color: '#e5e7eb',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      {/* ════════════ NAVBAR (matches landing page) ════════════ */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14px 32px',
        background: 'rgba(10,10,14,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Features link */}
          <span
            onClick={() => navigate('/features')}
            style={{
              fontSize: 13,
              color: pathname === '/features' ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => { if (pathname !== '/features') e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            Features
          </span>

          {/* Univia — center brand (links back to home) */}
          <span
            onClick={() => navigate('/')}
            style={{
              fontSize: 13,
              color: CYAN,
              borderBottom: `2px solid ${CYAN}`,
              paddingBottom: 2,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Univia
          </span>

          {/* About link */}
          <span
            onClick={() => navigate('/about')}
            style={{
              fontSize: 13,
              color: pathname === '/about' ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => { if (pathname !== '/about') e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            About
          </span>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 80px' }}>
        {children}
      </main>

      {/* ════════════ FOOTER (matches landing page) ════════════ */}
      <footer style={{
        borderTop: `1px solid ${CARD_BORDER}`,
        padding: '32px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Left: brand + copyright */}
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: CYAN, marginBottom: 4 }}>Univia</div>
          <p style={{ fontSize: 10, color: '#374151' }}>© 2026 Virtual Labs. All systems operational.</p>
        </div>

        {/* Center: nav links */}
        <div style={{ display: 'flex', gap: 28, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563' }}>
          {footerLinks.map(l => (
            <button
              key={l.path + l.label}
              onClick={() => navigate(l.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit',
                letterSpacing: 'inherit', textTransform: 'inherit',
                padding: 0, transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right: social icons (same as landing page) */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{
            width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280',
            transition: 'color 0.2s, background 0.2s', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          {/* X (Twitter) */}
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" style={{
            width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280',
            transition: 'color 0.2s, background 0.2s', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
