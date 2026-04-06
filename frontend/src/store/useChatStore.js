/**
 * Chat Store — Unified proximity chat with typing indicators.
 */
import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
  /** All proximity chat messages in chronological order. */
  messages: [],

  addMessage: (message) =>
    set((state) => {
      const updated = [...state.messages, message].slice(-300);
      return { messages: updated };
    }),

  addSystemMessage: (text) =>
    set((state) => {
      const sysMsg = {
        sender: '__system__',
        content: text,
        timestamp: Date.now(),
        isSystem: true,
      };
      return { messages: [...state.messages, sysMsg].slice(-300) };
    }),

  setHistory: (messages) => set({ messages }),

  /** Unread message count. */
  unreadCount: 0,
  incrementUnread: () =>
    set((state) => ({ unreadCount: state.unreadCount + 1 })),
  clearUnread: () => set({ unreadCount: 0 }),

  /** Typing users — Map<userId, { username, timestamp }> */
  typingUsers: {},
  setTyping: (userId, username, isTyping) =>
    set((state) => {
      if (isTyping) {
        return {
          typingUsers: {
            ...state.typingUsers,
            [userId]: { username, timestamp: Date.now() },
          },
        };
      } else {
        const { [userId]: _, ...rest } = state.typingUsers;
        return { typingUsers: rest };
      }
    }),
  clearTyping: () => set({ typingUsers: {} }),

  /** Clear all messages and state. */
  clearAll: () => set({ messages: [], unreadCount: 0, typingUsers: {} }),
}));