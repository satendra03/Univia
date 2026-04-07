/**
 * ChatPanel — Unified proximity chat UI.
 * Premium cosmic theme with cyan accents and glassmorphism.
 * Features: typing indicators, emoji quick-reactions, fully mobile-responsive.
 */
import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useChatStore } from '../store/useChatStore';
import useChat from '../hooks/useChat';
import { REACTION_EMOJIS } from '../utils/constants';

export default function ChatPanel() {
  const isChatOpen = useGameStore((s) => s.isChatOpen);
  const nearbyDetails = useGameStore((s) => s.nearbyDetails);
  const nearbyUsers = useGameStore((s) => s.nearbyUsers);
  const self = useGameStore((s) => s.self);
  const messages = useChatStore((s) => s.messages);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const { sendMessage, sendTyping, sendReaction } = useChat();

  const [inputValue, setInputValue] = useState('');
  const [showReactions, setShowReactions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const nearbyEntries = Object.entries(nearbyDetails);
  const hasNearby = nearbyUsers.length > 0;
  const typingList = Object.values(typingUsers);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Clear unread when chat opens
  useEffect(() => {
    if (isChatOpen) {
      useChatStore.getState().clearUnread();
    }
  }, [isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim()) {
      sendTyping();
    }
  };

  const handleReaction = (emoji) => {
    sendReaction(emoji);
    setShowReactions(false);
  };

  return (
    <div
      className="chat-panel animate-slide-in-up"
      style={{
        position: 'fixed',
        zIndex: 30,
        bottom: 8,
        right: 8,
        left: 'auto',
        width: 'min(400px, calc(100vw - 16px))',
        height: 'min(460px, calc(100vh - 80px))',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 10, 20, 0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0, 229, 255, 0.08)',
        borderRadius: 18,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 229, 255, 0.03)',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid rgba(0, 229, 255, 0.06)',
          background: 'rgba(0, 229, 255, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#e8e8f0', margin: 0 }}>
            Proximity Chat
          </h3>
          {hasNearby && (
            <span
              style={{
                fontSize: 10,
                padding: '2px 8px',
                borderRadius: 10,
                background: 'rgba(0, 229, 255, 0.1)',
                color: '#00e5ff',
                fontWeight: 600,
              }}
            >
              {nearbyUsers.length}
            </span>
          )}
        </div>
        <button
          onClick={() => useGameStore.getState().setChatOpen(false)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            color: '#6b7280',
            background: 'rgba(255, 255, 255, 0.04)',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          ✕
        </button>
      </div>

      {/* ── Nearby Users Bar ── */}
      {nearbyEntries.length > 0 && (
        <div
          style={{
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexShrink: 0,
            overflowX: 'auto',
            borderBottom: '1px solid rgba(0, 229, 255, 0.04)',
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              flexShrink: 0,
              color: '#4b5563',
              fontWeight: 600,
            }}
          >
            With:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {nearbyEntries.map(([userId, { username, color }]) => (
              <div
                key={userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 20,
                  flexShrink: 0,
                  background: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.06)',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: color,
                    boxShadow: `0 0 6px ${color}44`,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 500, color: '#e8e8f0' }}>
                  {username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {messages.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>💬</p>
              <p style={{ fontSize: 12, color: '#6b7280' }}>
                {hasNearby ? "You're connected! Say hello 👋" : 'Move near other players to chat'}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.isSystem) {
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                <span
                  style={{
                    fontSize: 10,
                    padding: '4px 14px',
                    borderRadius: 20,
                    background: 'rgba(0, 229, 255, 0.04)',
                    color: '#6b7280',
                    border: '1px solid rgba(0, 229, 255, 0.04)',
                  }}
                >
                  {msg.content}
                </span>
              </div>
            );
          }

          const isSelf = msg.sender === self?.username;
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
              <div
                style={{
                  maxWidth: '80%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isSelf ? 'flex-end' : 'flex-start',
                }}
              >
                {!isSelf && (
                  <p style={{ fontSize: 10, marginBottom: 3, fontWeight: 600, paddingLeft: 4, color: msg.senderColor || '#6b7280' }}>
                    {msg.sender}
                  </p>
                )}
                <div
                  style={{
                    padding: '8px 14px',
                    borderRadius: 14,
                    fontSize: 13,
                    lineHeight: 1.5,
                    background: isSelf
                      ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.18), rgba(0, 184, 212, 0.12))'
                      : 'rgba(255, 255, 255, 0.04)',
                    color: '#e8e8f0',
                    borderBottomRightRadius: isSelf ? 4 : 14,
                    borderBottomLeftRadius: isSelf ? 14 : 4,
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'pre-wrap',
                    border: isSelf ? '1px solid rgba(0, 229, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.03)',
                  }}
                >
                  {msg.content}
                </div>
                <p style={{ fontSize: 9, marginTop: 3, paddingLeft: 4, paddingRight: 4, color: '#4b5563' }}>
                  {msg.timestamp
                    ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Typing Indicator ── */}
      {typingList.length > 0 && (
        <div style={{ padding: '4px 14px 2px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="typing-dots">
              <span /><span /><span />
            </div>
            <span style={{ fontSize: 11, color: '#6b7280' }}>
              {typingList.length === 1
                ? `${typingList[0].username} is typing...`
                : `${typingList.length} people typing...`}
            </span>
          </div>
        </div>
      )}

      {/* ── Reaction Picker ── */}
      {showReactions && (
        <div
          className="animate-fade-in"
          style={{
            padding: '8px 14px',
            display: 'flex',
            gap: 6,
            flexShrink: 0,
            borderTop: '1px solid rgba(0, 229, 255, 0.06)',
          }}
        >
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: 'rgba(0, 229, 255, 0.04)',
                border: '1px solid rgba(0, 229, 255, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 229, 255, 0.12)';
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 229, 255, 0.04)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '10px 12px',
          display: 'flex',
          gap: 8,
          flexShrink: 0,
          borderTop: '1px solid rgba(0, 229, 255, 0.06)',
          alignItems: 'center',
        }}
      >
        {/* Reaction toggle */}
        <button
          type="button"
          onClick={() => setShowReactions(!showReactions)}
          style={{
            flexShrink: 0,
            width: 38,
            height: 38,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            fontSize: 18,
            background: showReactions ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: showReactions ? '1px solid rgba(0, 229, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          😊
        </button>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={hasNearby ? 'Type a message...' : 'No one nearby...'}
          maxLength={100}
          disabled={!hasNearby}
          style={{
            flex: 1,
            minWidth: 0,
            padding: '9px 14px',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(0, 229, 255, 0.06)',
            borderRadius: 10,
            color: '#e8e8f0',
            outline: 'none',
            transition: 'all 0.15s ease',
            opacity: hasNearby ? 1 : 0.4,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 229, 255, 0.06)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 229, 255, 0.06)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || !hasNearby}
          style={{
            flexShrink: 0,
            width: 38,
            height: 38,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !inputValue.trim() || !hasNearby ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            background: inputValue.trim() && hasNearby
              ? 'linear-gradient(135deg, #00e5ff, #00b8d4)'
              : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            opacity: !inputValue.trim() || !hasNearby ? 0.4 : 1,
            boxShadow: inputValue.trim() && hasNearby ? '0 2px 12px rgba(0, 229, 255, 0.25)' : 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={inputValue.trim() && hasNearby ? '#0a0a1a' : '#6b7280'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
