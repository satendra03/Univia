/**
 * ChatPanel — Unified proximity chat UI.
 * Features: typing indicators, emoji quick-reactions, fully mobile-responsive.
 * On mobile: full-width, reduced height, compact layout.
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
    <div className="fixed z-30 glass-panel animate-slide-in-up flex flex-col chat-panel"
         style={{
           /* Mobile: full width with margins. Desktop: fixed width */
           bottom: 8,
           right: 8,
           left: 'auto',
           width: 'min(380px, calc(100vw - 16px))',
           height: 'min(440px, calc(100vh - 80px))',
         }}>

      {/* ── Header ── */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between shrink-0"
           style={{ borderBottom: '1px solid var(--glass-border)' }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3 className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Proximity Chat
          </h3>
          {hasNearby && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(34,211,238,0.15)', color: 'var(--accent-cyan)' }}>
              {nearbyUsers.length}
            </span>
          )}
        </div>
        <button
          onClick={() => useGameStore.getState().setChatOpen(false)}
          className="w-7 h-7 rounded flex items-center justify-center text-xs transition-colors cursor-pointer"
          style={{ color: 'var(--text-muted)', background: 'rgba(129,140,248,0.05)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(129,140,248,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(129,140,248,0.05)'}>
          ✕
        </button>
      </div>

      {/* ── Nearby Users Bar (scrollable on mobile) ── */}
      {nearbyEntries.length > 0 && (
        <div className="px-3 py-1.5 flex items-center gap-2 shrink-0 overflow-x-auto"
             style={{ borderBottom: '1px solid rgba(129,140,248,0.05)' }}>
          <span className="text-[10px] uppercase tracking-wider shrink-0"
                style={{ color: 'var(--text-muted)' }}>
            With:
          </span>
          <div className="flex items-center gap-1.5">
            {nearbyEntries.map(([userId, { username, color }]) => (
              <div key={userId} className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                   style={{ background: 'rgba(129,140,248,0.06)' }}>
                <div className="w-3 h-3 rounded-full shrink-0"
                     style={{ background: color }} />
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-primary)' }}>
                  {username}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 sm:py-3 space-y-2" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-xl sm:text-2xl mb-2">💬</p>
              <p className="text-[11px] sm:text-xs" style={{ color: 'var(--text-muted)' }}>
                {hasNearby ? "You're connected! Say hello 👋" : "Move near other players to chat"}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.isSystem) {
            return (
              <div key={i} className="flex justify-center py-1">
                <span className="text-[10px] sm:text-[11px] px-3 py-1 rounded-full"
                      style={{ background: 'rgba(129,140,248,0.06)', color: 'var(--text-muted)' }}>
                  {msg.content}
                </span>
              </div>
            );
          }

          const isSelf = msg.sender === self?.username;
          return (
            <div key={i} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                {!isSelf && (
                  <p className="text-[10px] sm:text-xs mb-0.5 font-medium px-1"
                     style={{ color: msg.senderColor || 'var(--text-muted)' }}>
                    {msg.sender}
                  </p>
                )}
                <div className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm"
                     style={{
                       background: isSelf
                         ? 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(167,139,250,0.2))'
                         : 'rgba(255,255,255,0.05)',
                       color: 'var(--text-primary)',
                       borderBottomRightRadius: isSelf ? '4px' : '12px',
                       borderBottomLeftRadius: isSelf ? '12px' : '4px',
                       wordBreak: 'break-word',
                       overflowWrap: 'anywhere',
                       whiteSpace: 'pre-wrap',
                     }}>
                  {msg.content}
                </div>
                <p className="text-[9px] sm:text-[10px] mt-0.5 px-1" style={{ color: 'var(--text-muted)' }}>
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
        <div className="px-3 py-1 shrink-0">
          <div className="flex items-center gap-2">
            <div className="typing-dots">
              <span /><span /><span />
            </div>
            <span className="text-[10px] sm:text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {typingList.length === 1
                ? `${typingList[0].username} is typing...`
                : `${typingList.length} people typing...`}
            </span>
          </div>
        </div>
      )}

      {/* ── Reaction Picker ── */}
      {showReactions && (
        <div className="px-3 py-2 flex gap-1 sm:gap-1.5 shrink-0 animate-fade-in"
             style={{ borderTop: '1px solid rgba(129,140,248,0.08)' }}>
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-base sm:text-lg cursor-pointer transition-all"
              style={{ background: 'rgba(129,140,248,0.06)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(129,140,248,0.2)';
                e.currentTarget.style.transform = 'scale(1.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(129,140,248,0.06)';
                e.currentTarget.style.transform = 'scale(1)';
              }}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <form onSubmit={handleSend} className="px-2 sm:px-3 py-2 sm:py-3 flex gap-1.5 sm:gap-2 shrink-0"
            style={{ borderTop: '1px solid var(--glass-border)' }}>
        {/* Reaction toggle */}
        <button
          type="button"
          onClick={() => setShowReactions(!showReactions)}
          className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all"
          style={{
            background: showReactions ? 'rgba(129,140,248,0.2)' : 'rgba(129,140,248,0.06)',
            fontSize: '16px',
          }}>
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
          className="input-cosmos flex-1"
          style={{ padding: '8px 12px', fontSize: '16px', opacity: hasNearby ? 1 : 0.5, minWidth: 0 }}
        />
        <button type="submit" className="btn-primary shrink-0"
                style={{ padding: '8px 14px', fontSize: '13px' }}
                disabled={!inputValue.trim() || !hasNearby}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
