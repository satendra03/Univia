/**
 * FeaturesPage — Premium features showcase for Univia with Lucide icons.
 */
import PageLayout from './PageLayout';
import { Zap, Radio, MessageCircle, Smile, Map, Palette, Link2, Sparkles } from 'lucide-react';

const CYAN = '#00e5ff';
const CARD = '#111116';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

const HERO_FEATURES = [
  {
    Icon: Zap,
    title: 'Real-Time Sync Engine',
    desc: 'Powered by Socket.IO, every movement, message, and reaction is delivered with sub-50ms latency. Players see each other move smoothly in real time — no lag, no polling.',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08), transparent 60%)',
    accentColor: '#fbbf24',
    details: ['WebSocket bidirectional comm', 'Server-authoritative state', 'Auto-reconnect', 'Optimistic UI updates'],
  },
  {
    Icon: Radio,
    title: 'Proximity Detection',
    desc: 'Walk near another avatar and connections form automatically — no friend requests, no friction. The system continuously calculates distances and instantly notifies you when someone is nearby.',
    gradient: 'linear-gradient(135deg, rgba(0,229,255,0.08), transparent 60%)',
    accentColor: CYAN,
    details: ['Configurable radius', 'Real-time distance calc', 'Auto connect/disconnect', 'Visual proximity ring'],
  },
  {
    Icon: MessageCircle,
    title: 'Spatial Chat System',
    desc: 'Messages are scoped to your nearby group. When you walk away, the conversation stays behind. Every meeting is ephemeral and authentic — just like real life.',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.08), transparent 60%)',
    accentColor: '#a78bfa',
    details: ['Group proximity rooms', 'Persistent session history', 'Typing indicators', 'Auto-open on proximity'],
  },
];

const BENTO_FEATURES = [
  {
    Icon: Smile,
    title: 'Emoji Reactions',
    desc: 'React with a single tap. Floating emoji animations appear above avatars for everyone nearby.',
    span: 'col',
    gradient: 'linear-gradient(135deg, rgba(251,113,133,0.06), transparent 60%)',
    accentColor: '#fb7185',
  },
  {
    Icon: Map,
    title: 'Live Mini-Map',
    desc: 'Real-time bird\'s-eye view of the 3000×2000 universe. See every player and plan encounters.',
    span: 'col',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.06), transparent 60%)',
    accentColor: '#34d399',
  },
  {
    Icon: Palette,
    title: 'Dynamic Avatars',
    desc: 'Unique HSL-generated colors, pulsing glow rings, smooth position interpolation, and username labels.',
    span: 'full',
    gradient: 'linear-gradient(135deg, rgba(96,165,250,0.06), transparent 60%)',
    accentColor: '#60a5fa',
  },
  {
    Icon: Link2,
    title: 'Connection Lines',
    desc: 'Elegant cyan lines connect nearby avatars with animated midpoints, visually mapping your social graph.',
    span: 'col',
    gradient: 'linear-gradient(135deg, rgba(0,229,255,0.06), transparent 60%)',
    accentColor: CYAN,
  },
  {
    Icon: Sparkles,
    title: 'Cosmic Canvas Engine',
    desc: 'PixiJS WebGL rendering with 300+ procedural stars, smooth camera interpolation, and responsive viewports.',
    span: 'col',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.06), transparent 60%)',
    accentColor: '#8b5cf6',
  },
];

const STATS = [
  { value: '<50ms', label: 'Latency' },
  { value: '300+', label: 'Procedural Stars' },
  { value: '3000×2000', label: 'World Size' },
  { value: '∞', label: 'Connections' },
];

export default function FeaturesPage() {
  return (
    <PageLayout>
      {/* ── Hero Section ── */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)',
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>
            Platform Capabilities
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          Everything Inside<br />
          <span style={{ background: `linear-gradient(90deg, ${CYAN}, #a78bfa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Univia
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          An in-depth look at every feature powering the real-time proximity social experience.
        </p>
      </div>

      {/* ── Stats Bar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 64 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '20px 12px', background: CARD,
            border: `1px solid ${CARD_BORDER}`, borderRadius: 14,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: CYAN, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Hero Feature Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
        {HERO_FEATURES.map((f, i) => (
          <div key={i} style={{
            background: f.gradient + `, ${CARD}`, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 24, padding: '40px 44px', position: 'relative', overflow: 'hidden',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.accentColor}22`; e.currentTarget.style.boxShadow = `0 0 40px ${f.accentColor}08`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              position: 'absolute', top: -20, right: 24, fontSize: 140, fontWeight: 900,
              color: f.accentColor, opacity: 0.03, lineHeight: 1, pointerEvents: 'none', fontFamily: 'var(--font-mono)',
            }}>0{i + 1}</div>
            <div style={{
              position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%',
              background: f.accentColor, opacity: 0.03, filter: 'blur(40px)', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                background: `${f.accentColor}10`, border: `1px solid ${f.accentColor}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.Icon size={26} color={f.accentColor} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.75, marginBottom: 20, maxWidth: 580 }}>{f.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {f.details.map((d, j) => (
                    <span key={j} style={{
                      fontSize: 11, padding: '5px 14px', borderRadius: 20,
                      background: `${f.accentColor}08`, border: `1px solid ${f.accentColor}12`,
                      color: f.accentColor, fontWeight: 500,
                    }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 10 }}>More Capabilities</h2>
        <div style={{ width: 40, height: 2, background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, margin: '0 auto' }} />
      </div>

      {/* ── Bento Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 64 }}>
        {BENTO_FEATURES.map((f, i) => (
          <div key={i} style={{
            background: f.gradient + `, ${CARD}`, border: `1px solid ${CARD_BORDER}`,
            borderRadius: 20, padding: f.span === 'full' ? '32px 36px' : '28px 28px',
            gridColumn: f.span === 'full' ? '1 / -1' : 'auto',
            position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, transform 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.accentColor}18`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = CARD_BORDER; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{
              position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%',
              background: f.accentColor, opacity: 0.025, filter: 'blur(30px)', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: `${f.accentColor}0a`, border: `1px solid ${f.accentColor}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.Icon size={20} color={f.accentColor} strokeWidth={1.8} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div style={{
        textAlign: 'center', padding: '48px 32px',
        background: `linear-gradient(135deg, rgba(0,229,255,0.03), transparent)`,
        border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to explore?</h2>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Jump into the universe and experience every feature firsthand.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '14px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${CYAN}, #0ea5e9)`, color: '#000',
            fontWeight: 700, fontSize: 15, boxShadow: `0 0 30px ${CYAN}33`,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 0 40px ${CYAN}55`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 0 30px ${CYAN}33`; }}
        >
          Enter Univia →
        </button>
      </div>
    </PageLayout>
  );
}
