/**
 * PrivacyPage — Privacy Policy for Univia.
 */
import PageLayout from './PageLayout';

const CYAN = '#00e5ff';
const CARD = '#111116';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: `When you use Univia, we collect minimal information to provide the service:

• **Display Name** — The username you choose when joining. This is not linked to any real identity and is stored only for the duration of your session.
• **Position Data** — Your avatar's coordinates within the virtual world, used to calculate proximity and render your position to other users.
• **Chat Messages** — Messages sent within proximity chat are relayed in real-time but are not stored permanently. Chat history exists only in your browser session.
• **Connection Metadata** — Basic socket connection data (session ID, connection timestamps) used for managing real-time communication.

We do **not** collect emails, passwords, IP addresses for tracking, or any personally identifiable information.`,
  },
  {
    title: 'How We Use Your Information',
    content: `The information we collect is used solely to provide the Univia experience:

• Real-time position rendering and proximity detection
• Facilitating proximity-based chat between nearby users
• Delivering emoji reactions and typing indicators
• Managing the active player list and connection states

We do not sell, share, or monetize any user data. Period.`,
  },
  {
    title: 'Data Storage & Retention',
    content: `Univia is designed with ephemeral interaction in mind:

• **Session-based** — All data (username, position, chat messages) exists only during your active session.
• **No persistent storage** — When you close the browser or disconnect, your data is immediately removed from the server.
• **No databases** — Player state is held in server memory only. There is no database storing user information.
• **No cookies or tracking** — We do not use analytics trackers, advertising cookies, or any third-party data collection tools.`,
  },
  {
    title: 'Third-Party Services',
    content: `Univia uses the following third-party services:

• **Google Fonts** — For loading the Inter and JetBrains Mono typefaces. Google's font API may log standard request data per their privacy policy.
• **CDN for Socket.IO** — The Socket.IO library is bundled with the application; no external CDN is used at runtime.

No other third-party analytics, advertising, or data processing services are integrated.`,
  },
  {
    title: 'Security',
    content: `We take reasonable measures to protect the Univia service:

• WebSocket connections are used for all real-time communication
• No sensitive personal data is collected or stored
• The ephemeral nature of the platform inherently limits data exposure
• Server-side validation prevents malicious input

Since no accounts exist and no personal data is stored, the risk surface is inherently minimal.`,
  },
  {
    title: 'Children\'s Privacy',
    content: `Univia does not knowingly collect information from children under 13 years of age. The platform does not require any personal information to use. If you believe a child has provided personal information through the platform, please contact us.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated "Last Modified" date. Continued use of Univia after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: 'Contact',
    content: `If you have questions about this Privacy Policy or Univia's data practices, please reach out via the project's GitHub repository.`,
  },
];

export default function PrivacyPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>
          Legal
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: '#fff' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          Last updated: April 2026
        </p>
        <p style={{ fontSize: 15, color: '#9ca3af', marginTop: 16, lineHeight: 1.7, maxWidth: 600 }}>
          Univia is built with privacy as a core principle. We collect the absolute minimum data necessary to deliver a real-time multiplayer experience — and nothing more.
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
        {SECTIONS.map((s, i) => (
          <section key={i}>
            <h2 style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: `1px solid ${CARD_BORDER}`,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'rgba(0,229,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: CYAN, flexShrink: 0,
              }}>{i + 1}</span>
              {s.title}
            </h2>
            <div style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
              {s.content}
            </div>
          </section>
        ))}
      </div>
    </PageLayout>
  );
}
