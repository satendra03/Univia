/**
 * LandingPage — Premium dark sci-fi landing page for Univia.
 * Uses pure inline styles for maximum reliability (no Tailwind dependency).
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Radio, MessageCircle, Smile, PenLine, Map } from 'lucide-react';

/* ── Reusable tiny components ──────────────────────────────────── */
const CYAN = '#00e5ff';
const BG = '#0a0a0e';
const CARD = '#111116';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

function GlowDot({ color = '#4ade80', size = 6 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size, borderRadius: '50%',
      background: color, boxShadow: `0 0 ${size * 2}px ${color}`,
    }} />
  );
}

/* ── Animated star canvas ──────────────────────────────────────── */
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.2 + 0.3,
      speed: Math.random() * 0.0001 + 0.00003,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < 0) { s.y = 1; s.x = Math.random(); }
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ── "How it works" step data ─────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Choose Your Name', desc: 'Pick a unique identity and spawn into the infinite 2D universe.' },
  { num: '02', title: 'Explore & Move', desc: 'Use WASD or arrow keys to roam a vast shared universe with other players.' },
  { num: '03', title: 'Get Close to Connect', desc: 'Walk near another player and a proximity link activates automatically.' },
  { num: '04', title: 'Chat in Real-Time', desc: 'Send messages, react with emojis, and see who\'s typing — all live.' },
];

/* ── Feature card data ────────────────────────────────────────── */
const FEATURES = [
  { Icon: Zap, title: 'Real-time Engine', desc: 'Socket.IO-powered sync engine delivers sub-50ms latency for smooth, instant interaction across all connected clients.', color: '#fbbf24' },
  { Icon: Radio, title: 'Proximity Detection', desc: 'Walk near other avatars and connections form automatically — no friend requests, no friction. Just genuine encounters.', color: CYAN },
  { Icon: MessageCircle, title: 'Spatial Chat', desc: 'Messages are scoped to your nearby group. When you walk away, the conversation stays behind. Every meeting is ephemeral.', color: '#a78bfa' },
  { Icon: Smile, title: 'Emoji Reactions', desc: 'React to messages with a single tap. Floating emoji animations appear above avatars for everyone nearby to see.', color: '#fb7185' },
  { Icon: PenLine, title: 'Typing Indicators', desc: 'See animated dots when a nearby player is typing, so conversations feel as natural as face-to-face.', color: '#34d399' },
  { Icon: Map, title: 'Live Mini-Map', desc: 'A real-time overview of the entire universe — see where everyone is and plan your next encounter.', color: '#60a5fa' },
];

/* ── Stats ─────────────────────────────────────────────────────── */
const STATS = [
  { value: '<50ms', label: 'Avg. Latency' },
  { value: '3000×2000', label: 'World Size' },
  { value: '∞', label: 'Conversations' },
  { value: '100%', label: 'Ephemeral' },
];

/* ================================================================
 * ─── Main Component ─────────────────────────────────────────────
 * ================================================================ */
export default function LandingPage({ onEnter }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: BG, color: '#e5e7eb', fontFamily: "'Inter', system-ui, -apple-system, sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <StarField />

      {/* ════════════ NAVBAR ════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: scrolled ? '14px 32px' : '22px 32px',
        background: scrolled ? 'rgba(10,10,14,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        {/* <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-0.03em', color: CYAN }}>
          Univia
        </div> */}

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <span onClick={() => navigate('/features')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >Features</span>
          <span style={{ fontSize: 13, color: CYAN, borderBottom: `2px solid ${CYAN}`, paddingBottom: 2, cursor: 'default' }}>Univia</span>
          <span onClick={() => navigate('/about')} style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >About</span>
        </div>

        {/* <button
          onClick={onEnter}
          style={{
            padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: CYAN, color: '#000', fontWeight: 600, fontSize: 13,
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Launch App
        </button> */}
      </nav>

      {/* ════════════ HERO ════════════ */}
      <section style={{
        position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', paddingTop: 180, paddingBottom: 80, paddingLeft: 20, paddingRight: 20,
      }}>
        {/* Radial glow behind text */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 900, height: 500, borderRadius: '50%',
          background: `radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
          borderRadius: 50, border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)',
          marginBottom: 32, position: 'relative', zIndex: 1,
        }}>
          <GlowDot />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', color: '#d1d5db' }}>UNIVIA IS LIVE</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)', fontWeight: 900, letterSpacing: '-0.03em',
          lineHeight: 1.05, margin: '0 0 24px', position: 'relative', zIndex: 1,
          textShadow: '0 0 60px rgba(0,229,255,0.08)',
        }}>
          Uni<span style={{ color: CYAN }}>via</span>
        </h1>

        <p style={{
          maxWidth: 560, fontSize: 'clamp(15px, 1.2vw, 18px)', color: '#9ca3af',
          lineHeight: 1.7, fontWeight: 300, marginBottom: 40, position: 'relative', zIndex: 1,
        }}>
          Move, Connect, Chat in Real Time. Experience the next evolution of human interaction in an infinite, shared digital frontier.
        </p>

        <div style={{ display: 'flex', gap: 14, position: 'relative', zIndex: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onEnter}
            style={{
              padding: '14px 36px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: CYAN, color: '#000', fontWeight: 700, fontSize: 15,
              boxShadow: '0 0 30px rgba(0,229,255,0.25), 0 4px 15px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,0.4), 0 4px 15px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0,229,255,0.25), 0 4px 15px rgba(0,0,0,0.3)'; }}
          >
            Enter Univia
          </button>
          <button style={{
            padding: '14px 36px', borderRadius: 10, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', color: '#fff', fontWeight: 600, fontSize: 15,
            border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)',
            transition: 'background 0.2s ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            Learn More ↓
          </button>
        </div>

        {/* Scroll hint */}
        <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll to explore</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* ════════════ STATS BAR ════════════ */}
      <section style={{ maxWidth: 900, margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
          borderRadius: 16, border: `1px solid ${CARD_BORDER}`, background: CARD, overflow: 'hidden',
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '28px 20px', textAlign: 'center',
              borderRight: i < 3 ? `1px solid ${CARD_BORDER}` : 'none',
            }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: CYAN, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, fontWeight: 500, letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ BENTO GRID — FEATURES ════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>Features</span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12, color: '#fff' }}>
            Built for Real Connection
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', marginTop: 12, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Everything you need for meaningful proximity-based social interaction — nothing you don't.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
              padding: 32, cursor: 'pointer', transition: 'border-color 0.25s ease, transform 0.25s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,229,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                background: `${f.color}10`, border: `1px solid ${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.Icon size={22} color={f.color} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ HOW IT WORKS ════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>How It Works</span>
          <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12, color: '#fff' }}>
            Four Steps to Connection
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative', padding: '32px 24px' }}>
              <div style={{
                fontSize: 56, fontWeight: 900, color: 'rgba(0,229,255,0.06)',
                position: 'absolute', top: 0, left: 20, lineHeight: 1, letterSpacing: '-0.06em',
              }}>{s.num}</div>
              <div style={{ position: 'relative', zIndex: 1, paddingTop: 36 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════ LARGE CTA ════════════ */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 120px' }}>
        <div style={{
          borderRadius: 24, border: `1px solid ${CARD_BORDER}`,
          background: `linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 100%)`,
          padding: '64px 40px', textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow blob */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 200, borderRadius: '50%',
            background: 'rgba(0,229,255,0.06)', filter: 'blur(60px)', pointerEvents: 'none',
          }} />

          <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, color: '#fff', marginBottom: 14, position: 'relative' }}>
            Ready to ascend?
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 32, maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6 }}>
            The gates to Univia are open. Jump in, explore the universe, and make real connections.
          </p>
          <button
            onClick={onEnter}
            style={{
              padding: '14px 40px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: '#fff', color: '#000', fontWeight: 700, fontSize: 15,
              transition: 'transform 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.background = '#e5e7eb'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#fff'; }}
          >
            Claim Your Key
          </button>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{
        borderTop: `1px solid ${CARD_BORDER}`, padding: '32px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1,
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: CYAN, marginBottom: 4 }}>Univia</div>
          <p style={{ fontSize: 10, color: '#374151' }}>© 2026 Virtual Labs. All systems operational.</p>
        </div>

        <div style={{ display: 'flex', gap: 28, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563' }}>
          {[
            { label: 'Docs', page: '/docs' },
            { label: 'Features', page: '/features' },
            { label: 'Privacy', page: '/privacy' },
            { label: 'Terms', page: '/terms' },
          ].map(l => (
            <button key={l.page} onClick={() => navigate(l.page)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', padding: 0, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
            >{l.label}</button>
          ))}
        </div>

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
