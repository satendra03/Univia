/**
 * TermsPage — Terms of Service for Univia.
 */
import PageLayout from './PageLayout';

const CYAN = '#00e5ff';
const CARD_BORDER = 'rgba(255,255,255,0.06)';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing or using Univia ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the Service.

The Service is provided as-is for personal, non-commercial use. We reserve the right to modify these terms at any time. Your continued use of the Service after any modifications indicates your acceptance of the updated terms.`,
  },
  {
    title: 'Description of Service',
    content: `Univia is a real-time, browser-based 2D multiplayer environment where users connect through proximity. The Service allows users to:

• Create a temporary display name (no account registration required)
• Move an avatar within a shared virtual world
• Chat with nearby players via proximity-based messaging
• Send and receive emoji reactions
• View a mini-map of all connected players

The Service is ephemeral by design — all session data is temporary and not retained after disconnection.`,
  },
  {
    title: 'User Conduct',
    content: `By using Univia, you agree to:

• Treat other users with respect and decency
• Not use the chat system to send harassing, offensive, abusive, or threatening messages
• Not impersonate other users or representatives of Univia
• Not attempt to disrupt the Service through automated scripts, bots, or exploits
• Not transmit spam, malware, or any harmful content
• Not use the Service for any illegal or unauthorized purpose

We reserve the right to disconnect any user who violates these guidelines without prior notice.`,
  },
  {
    title: 'Usernames',
    content: `When joining Univia, you select a temporary display name. This name:

• Must be between 2 and 16 characters
• May contain letters, numbers, and underscores only
• Is visible to all other connected users
• Does not represent a permanent account or identity
• Should not contain offensive, discriminatory, or inappropriate content

We do not verify the uniqueness or ownership of display names. Multiple users may choose similar names across different sessions.`,
  },
  {
    title: 'Intellectual Property',
    content: `The Univia name, logo, visual design, UI components, and underlying source code are the property of the Univia project contributors.

You may not:
• Copy, reproduce, or distribute the Service's source code without permission
• Use the Univia brand name or logo for unauthorized purposes
• Create derivative works based on the Service without attribution

User-generated content (chat messages, chosen usernames) remains the responsibility of the individual user.`,
  },
  {
    title: 'Disclaimers',
    content: `THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.

We do not guarantee:
• Uninterrupted or error-free operation of the Service
• The accuracy or reliability of any information displayed
• The behavior or conduct of other users
• Data security during real-time communication

Use the Service at your own discretion and risk.`,
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by applicable law, Univia and its contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:

• Loss of data or content
• Interruption of service
• Unauthorized access to communications
• Any conduct of third-party users

Our total liability for any claims arising from your use of the Service shall not exceed $0, as the Service is provided free of charge.`,
  },
  {
    title: 'Termination',
    content: `We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including:

• Violation of these Terms
• Harmful or disruptive behavior
• Technical or security concerns

Upon termination, all session data associated with your connection is immediately deleted from server memory.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved through good-faith discussion before any formal proceedings.`,
  },
  {
    title: 'Contact',
    content: `If you have questions about these Terms of Service, please reach out via the project's GitHub repository or other published contact channels.`,
  },
];

export default function TermsPage() {
  return (
    <PageLayout>
      {/* Hero */}
      <div style={{ marginBottom: 48 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: CYAN, textTransform: 'uppercase' }}>
          Legal
        </span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', marginTop: 12, color: '#fff' }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
          Last updated: April 2026
        </p>
        <p style={{ fontSize: 15, color: '#9ca3af', marginTop: 16, lineHeight: 1.7, maxWidth: 600 }}>
          Please read these Terms of Service carefully before using Univia. By accessing the Service, you agree to these terms.
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
