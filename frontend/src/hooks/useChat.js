/**
 * useChat — Hook for chat message sending, typing indicators, and reactions.
 */
import { useCallback, useRef } from 'react';
import socketService from '../services/socketService';
import { EVENTS } from '../utils/constants';

export default function useChat() {
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const sendMessage = useCallback((content) => {
    if (!content.trim()) return;
    socketService.emit(EVENTS.CHAT_SEND, { content: content.trim() });
    // Stop typing indicator when message is sent
    if (isTypingRef.current) {
      socketService.emit(EVENTS.CHAT_TYPING, { isTyping: false });
      isTypingRef.current = false;
    }
  }, []);

  const sendTyping = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketService.emit(EVENTS.CHAT_TYPING, { isTyping: true });
    }

    // Reset the "stop typing" timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      socketService.emit(EVENTS.CHAT_TYPING, { isTyping: false });
    }, 2000);
  }, []);

  const sendReaction = useCallback((emoji) => {
    socketService.emit(EVENTS.REACTION_SEND, { emoji });
  }, []);

  const updateProfile = useCallback((status, bio) => {
    socketService.emit(EVENTS.PROFILE_UPDATE, { status, bio });
  }, []);

  const requestHistory = useCallback(() => {
    socketService.emit(EVENTS.CHAT_HISTORY, {});
  }, []);

  return { sendMessage, sendTyping, sendReaction, updateProfile, requestHistory };
}
