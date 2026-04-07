/**
 * AboutPage — Premium about page for Univia with Lucide icons.
 */
import PageLayout from './PageLayout';
import { useNavigate } from 'react-router-dom';
import { Users, Timer, Unlock, Gamepad2, Cpu, Database, Globe, Layers, Paintbrush, Wifi } from 'lucide-react';

const CYAN = '#00e5ff';
const CARD = '#111116';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

const TECH_STACK = [
  { name: 'React 19', desc: 'Hooks-based UI framework', color: '#61dafb', Icon: Layers },
  { name: 'PixiJS', desc: 'Hardware-accelerated 2D rendering', color: '#e72264', Icon: Paintbrush },
  { name: 'Socket.IO', desc: 'Real-time bidirectional events', color: '#25c2a0', Icon: Wifi },
  { name: 'Zustand', desc: 'Zero-boilerplate state management', color: '#f59e0b', Icon: Database },
  { name: 'Vite', desc: 'Next-gen frontend build tool', color: '#646cff', Icon: Cpu },
  { name: 'Node.js', desc: 'Server-side JavaScript runtime', color: '#68a063', Icon: Globe },
];

const VALUES = [
  { Icon: Users, title: 'Proximity Over Profiles', desc: 'Connections happen through proximity, not profiles. Walk near someone and a conversation begins. No algorithms deciding who you meet.', accentColor: CYAN },
  { Icon: Timer, title: 'Ephemeral Interactions', desc: 'Every conversation is temporary. When you walk away, the chat stays behind. Authentic, in-the-moment interactions without the pressure of permanence.', accentColor: '#a78bfa' },
  { Icon: Unlock, title: 'Zero Friction', desc: 'No sign-ups, no emails, no passwords. Just pick a name and you\'re in the universe. Every barrier between you and connection is removed.', accentColor: '#34d399' },
  { Icon: Gamepad2, title: 'Playful Design', desc: 'From floating emoji reactions to glowing proximity rings, every interaction is designed to feel playful and alive. Social connection should be fun.', accentColor: '#fb7185' },
];

const TIMELINE = [
  { phase: '01', title: 'Concept', desc: 'Rethinking online social — what if connections were spatial, not algorithmic?' },
  { phase: '02', title: 'Prototype', desc: 'First PixiJS canvas with real-time movement via Socket.IO — proof the idea works.' },
  { phase: '03', title: 'Proximity Engine', desc: 'Built the core proximity detection system that auto-connects nearby players.' },
  { phase: '04', title: 'Chat & Reactions', desc: 'Added spatial chat, typing indicators, and floating emoji reactions.' },
  { phase: '05', title: 'Polish', desc: 'Cosmic theme, HUD overlays, mini-map, and the premium landing experience.' },
];

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)',
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>About Univia</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          Building the Future of<br />
          <span style={{ background: `linear-gradient(90deg, ${CYAN}, #a78bfa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Proximity Social
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
          A real-time 2D multiplayer universe where people connect through proximity — not profiles.
        </p>
      </div>

      {/* ── Mission ── */}
      <section style={{ marginBottom: 64 }}>
        <div style={{
          background: `linear-gradient(135deg, rgba(0,229,255,0.04) 0%, transparent 100%), ${CARD}`,
          border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
          padding: '44px 40px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%',
            background: CYAN, opacity: 0.03, filter: 'blur(50px)', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative' }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN,
              textTransform: 'uppercase', marginBottom: 16,
            }}>Our Mission</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.3 }}>
              Reimagining how people connect online
            </h2>
            <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8, marginBottom: 16, maxWidth: 640 }}>
              Traditional social platforms rely on profiles, followers, and algorithms.
              Univia strips all that away and returns to the most natural form of human connection — <strong style={{ color: '#e5e7eb' }}>being near someone.</strong>
            </p>
            <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.8, maxWidth: 640 }}>
              You inhabit a shared digital space. You move around, and when you get close to someone, a conversation channel opens automatically.
              Walk away, and the connection fades — just like in the real world.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 10 }}>Our Values</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {VALUES.map((v, i) => (
            <div key={i} style={{
              background: `linear-gradient(135deg, ${v.accentColor}06, transparent 60%), ${CARD}`,
              border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
              padding: '28px 28px', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.3s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${v.accentColor}18`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                position: 'absolute', bottom: -20, right: -20, width: 100, height: 100, borderRadius: '50%',
                background: v.accentColor, opacity: 0.025, filter: 'blur(25px)', pointerEvents: 'none',
              }} />
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 16,
                background: `${v.accentColor}0a`, border: `1px solid ${v.accentColor}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <v.Icon size={22} color={v.accentColor} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{v.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, position: 'relative' }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Journey Timeline ── */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 10 }}>The Journey</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, margin: '0 auto' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 30, top: 24, bottom: 24, width: 1,
            background: `linear-gradient(180deg, ${CYAN}20, ${CYAN}08)`,
          }} />
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '16px 0' }}>
              <div style={{
                width: 60, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: i === TIMELINE.length - 1 ? `${CYAN}15` : CARD,
                  border: `1px solid ${i === TIMELINE.length - 1 ? `${CYAN}30` : CARD_BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: i === TIMELINE.length - 1 ? CYAN : '#6b7280',
                  fontFamily: 'var(--font-mono)', position: 'relative', zIndex: 1,
                }}>
                  {t.phase}
                </div>
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.title}</h4>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 10 }}>Tech Stack</div>
          <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {TECH_STACK.map((t, i) => (
            <div key={i} style={{
              background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 16,
              padding: '22px 20px', transition: 'border-color 0.25s, transform 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${t.color}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, marginBottom: 14,
                background: `${t.color}10`, border: `1px solid ${t.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <t.Icon size={18} color={t.color} strokeWidth={1.8} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{t.name}</p>
              <p style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div style={{
        textAlign: 'center', padding: '48px 32px',
        background: `linear-gradient(135deg, rgba(0,229,255,0.03), transparent)`,
        border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
          Want to see it in action?
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, maxWidth: 420, margin: '0 auto 28px' }}>
          Explore every feature firsthand — no setup, no sign-up needed.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 36px', borderRadius: 12, border: 'none', cursor: 'pointer',
              background: `linear-gradient(135deg, ${CYAN}, #0ea5e9)`, color: '#000',
              fontWeight: 700, fontSize: 14, boxShadow: `0 0 30px ${CYAN}33`,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Enter Univia →
          </button>
          <button
            onClick={() => navigate('/features')}
            style={{
              padding: '14px 36px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: `1px solid rgba(255,255,255,0.1)`,
              color: '#e5e7eb', fontWeight: 600, fontSize: 14,
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'transparent'; }}
          >
            View Features
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
