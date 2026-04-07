/**
 * DocsPage — Premium documentation for Univia with Lucide icons.
 */
import PageLayout from './PageLayout';
import { useNavigate } from 'react-router-dom';
import {
  Rocket, Gamepad2, MessageCircle, Monitor, Box,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Send, X, Smile, CornerDownLeft
} from 'lucide-react';

const CYAN = '#00e5ff';
const CARD = '#111116';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

/* ── Section data ─────────────────────────────────────────────── */
const GETTING_STARTED = [
  { step: '01', title: 'Open Univia', desc: 'Navigate to the app in your browser. Desktop browsers recommended.', accentColor: CYAN },
  { step: '02', title: 'Enter a Username', desc: 'Pick any name, 2–16 characters. Alphanumeric and underscores allowed.', accentColor: '#a78bfa' },
  { step: '03', title: 'Explore the Universe', desc: 'Use WASD or arrow keys to move your avatar in the 3000×2000 world.', accentColor: '#34d399' },
  { step: '04', title: 'Connect with Nearby', desc: 'Walk within 150px of another player — proximity link activates automatically.', accentColor: '#fb7185' },
];

const CONTROLS = [
  { keys: ['W', '↑'], desc: 'Move up', Icon: ArrowUp },
  { keys: ['A', '←'], desc: 'Move left', Icon: ArrowLeft },
  { keys: ['S', '↓'], desc: 'Move down', Icon: ArrowDown },
  { keys: ['D', '→'], desc: 'Move right', Icon: ArrowRight },
  { keys: ['💬'], desc: 'Open proximity chat', Icon: MessageCircle },
  { keys: ['✕'], desc: 'Close chat panel', Icon: X },
  { keys: ['😊'], desc: 'Toggle emoji picker', Icon: Smile },
  { keys: ['↵'], desc: 'Send message', Icon: Send },
];

const CHAT_FEATURES = [
  'Messages are broadcast to all players in your proximity group.',
  'System messages appear when players enter or leave your range.',
  'Typing indicators show animated dots when nearby players are composing.',
  'Emoji reactions float above avatars and are visible to all nearby players.',
  'Chat history persists during your session (clears on page reload).',
];

const HUD_ITEMS = [
  { position: 'Top-Left', desc: 'Your avatar, username, coordinates, and connection status.', color: CYAN },
  { position: 'Top-Right', desc: 'Global stats: online count, nearby count, world dimensions.', color: '#a78bfa' },
  { position: 'Bottom-Left', desc: 'Mini-map showing all player positions in the 3000×2000 world.', color: '#34d399' },
  { position: 'Bottom-Right', desc: 'Chat toggle button — appears with unread indicator.', color: '#fb7185' },
  { position: 'Right Sidebar', desc: 'Nearby players list with click-to-view profiles.', color: '#fbbf24' },
];

const ARCHITECTURE = `┌─────────────┐         WebSocket          ┌──────────────┐
│   Browser    │ ◄─────────────────────────► │  Node.js     │
│   (React +   │    Socket.IO events         │  Server      │
│    PixiJS)   │                             │  (Express)   │
└─────────────┘                             └──────────────┘
      │                                            │
      ├─ Zustand Store                             ├─ Player Registry
      ├─ PixiJS Canvas                             ├─ Proximity Engine
      ├─ Chat Store                                └─ Chat Relay
      └─ Movement Input`;

export default function DocsPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.08)',
          marginBottom: 20,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>Documentation</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1, marginBottom: 16 }}>
          How to Use{' '}
          <span style={{ background: `linear-gradient(90deg, ${CYAN}, #a78bfa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Univia
          </span>
        </h1>
        <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Everything you need to navigate the universe and connect with players.
        </p>
      </div>

      {/* ── Quick Nav ── */}
      <nav style={{
        background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 16,
        padding: '16px 24px', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4b5563', marginRight: 8 }}>
          Jump to
        </span>
        {[
          { label: 'Getting Started', id: 'start', Icon: Rocket },
          { label: 'Controls', id: 'controls', Icon: Gamepad2 },
          { label: 'Chat', id: 'chat', Icon: MessageCircle },
          { label: 'HUD', id: 'hud', Icon: Monitor },
          { label: 'Architecture', id: 'arch', Icon: Box },
        ].map(s => (
          <a key={s.id} href={`#${s.id}`} style={{
            fontSize: 12, color: CYAN, textDecoration: 'none', padding: '5px 14px', borderRadius: 20,
            background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.06)',
            transition: 'background 0.15s', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,229,255,0.04)'}
          >
            <s.Icon size={12} strokeWidth={2} />
            {s.label}
          </a>
        ))}
      </nav>

      {/* ═══ SECTION: Getting Started ═══ */}
      <section id="start" style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 8 }}>Getting Started</h2>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Up and running in seconds</h3>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24, lineHeight: 1.7 }}>
          No account creation needed. Choose a name and you're in the universe.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {GETTING_STARTED.map((s, i) => (
            <div key={i} style={{
              background: `linear-gradient(135deg, ${s.accentColor}06, transparent 60%), ${CARD}`,
              border: `1px solid ${CARD_BORDER}`, borderRadius: 18,
              padding: '24px 24px', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.accentColor}18`}
              onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
            >
              <div style={{
                position: 'absolute', top: 10, right: 16, fontSize: 48, fontWeight: 900,
                color: s.accentColor, opacity: 0.04, lineHeight: 1, pointerEvents: 'none', fontFamily: 'var(--font-mono)',
              }}>{s.step}</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: s.accentColor, fontFamily: 'var(--font-mono)',
                marginBottom: 10, letterSpacing: '0.08em',
              }}>STEP {s.step}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, position: 'relative' }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, position: 'relative' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION: Controls ═══ */}
      <section id="controls" style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 8 }}>Controls</h2>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Keyboard & Interface</h3>
        <div style={{
          background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 18, overflow: 'hidden',
        }}>
          {CONTROLS.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', padding: '14px 24px', gap: 16,
              borderBottom: i < CONTROLS.length - 1 ? `1px solid ${CARD_BORDER}` : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <c.Icon size={16} color="#6b7280" strokeWidth={1.8} style={{ flexShrink: 0 }} />
              <div style={{ display: 'flex', gap: 6, width: 120, flexShrink: 0 }}>
                {c.keys.map((k, j) => (
                  <code key={j} style={{
                    fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
                    color: CYAN, background: `${CYAN}08`, border: `1px solid ${CYAN}12`,
                    padding: '2px 8px', borderRadius: 6,
                  }}>{k}</code>
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{c.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION: Proximity Chat ═══ */}
      <section id="chat" style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 8 }}>Proximity Chat</h2>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Spatial Messaging</h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, marginBottom: 24 }}>
          Chat is proximity-based — you can only message players within your range (150px).
        </p>
        <div style={{
          background: `linear-gradient(135deg, rgba(167,139,250,0.04), transparent 60%), ${CARD}`,
          border: `1px solid ${CARD_BORDER}`, borderRadius: 18, padding: '28px 28px',
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CHAT_FEATURES.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: '#9ca3af', lineHeight: 1.7 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2,
                  background: `#a78bfa0a`, border: `1px solid #a78bfa15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: '#a78bfa', fontFamily: 'var(--font-mono)',
                }}>{i + 1}</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ SECTION: HUD ═══ */}
      <section id="hud" style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 8 }}>HUD & Interface</h2>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>Heads-Up Display</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HUD_ITEMS.map((h, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 14,
              padding: '16px 22px', transition: 'border-color 0.25s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${h.color}18`}
              onMouseLeave={e => e.currentTarget.style.borderColor = CARD_BORDER}
            >
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: h.color, boxShadow: `0 0 10px ${h.color}44`,
              }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: h.color, width: 120, flexShrink: 0, fontFamily: 'var(--font-mono)' }}>
                {h.position}
              </span>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{h.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION: Architecture ═══ */}
      <section id="arch" style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase', marginBottom: 8 }}>Architecture</h2>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 24 }}>System Overview</h3>
        <pre style={{
          background: CARD, border: `1px solid ${CARD_BORDER}`, borderRadius: 18,
          padding: '28px 32px', overflow: 'auto',
          fontSize: 12, fontFamily: 'var(--font-mono)', color: CYAN, lineHeight: 1.7,
          opacity: 0.7,
        }}>
          {ARCHITECTURE}
        </pre>
      </section>

      {/* ── CTA ── */}
      <div style={{
        textAlign: 'center', padding: '48px 32px',
        background: `linear-gradient(135deg, rgba(0,229,255,0.03), transparent)`,
        border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
      }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to dive in?</h2>
        <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 400, margin: '0 auto 28px' }}>
          No setup required. Just enter a name and start exploring.
        </p>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '14px 40px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${CYAN}, #0ea5e9)`, color: '#000',
            fontWeight: 700, fontSize: 15, boxShadow: `0 0 30px ${CYAN}33`,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          Enter Univia →
        </button>
      </div>
    </PageLayout>
  );
}
