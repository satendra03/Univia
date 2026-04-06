/**
 * Chat Handler — Manages proximity-based messaging + typing indicators.
 */
import userService from '../services/UserService.js';
import proximityService from '../services/ProximityService.js';
import { EVENTS } from '../config/constants.js';

export default function chatHandler(io, socket) {
  socket.on(EVENTS.CHAT_SEND, (data) => {
    try {
      const { content } = data;
      if (!content || typeof content !== 'string' || content.trim().length === 0) return;

      const user = userService.getUser(socket.id);
      if (!user) return;

      const nearbyIds = proximityService.getNearbyUsers(socket.id);
      if (nearbyIds.length === 0) {
        socket.emit(EVENTS.ERROR, { message: 'No one is nearby to chat with.' });
        return;
      }

      const sanitizedContent = content.trim().substring(0, 500);
      const messageData = {
        sender: user.username,
        senderColor: user.color,
        content: sanitizedContent,
        timestamp: Date.now(),
      };

      // Send to self
      socket.emit(EVENTS.CHAT_MESSAGE, messageData);

      // Send to each nearby user
      for (const nearbyId of nearbyIds) {
        const nearbySocket = io.sockets.sockets.get(nearbyId);
        if (nearbySocket) {
          nearbySocket.emit(EVENTS.CHAT_MESSAGE, messageData);
        }
      }
    } catch (err) {
      console.error('[Socket] Error in chat:send:', err);
    }
  });

  // ── Typing indicator ──
  socket.on(EVENTS.CHAT_TYPING, (data) => {
    const user = userService.getUser(socket.id);
    if (!user) return;

    const nearbyIds = proximityService.getNearbyUsers(socket.id);
    const payload = {
      userId: socket.id,
      username: user.username,
      isTyping: !!data.isTyping,
    };

    for (const nearbyId of nearbyIds) {
      const nearbySocket = io.sockets.sockets.get(nearbyId);
      if (nearbySocket) {
        nearbySocket.emit(EVENTS.CHAT_TYPING_UPDATE, payload);
      }
    }
  });

  // Chat history — ephemeral, no DB
  socket.on(EVENTS.CHAT_HISTORY, () => {
    socket.emit(EVENTS.CHAT_HISTORY, { messages: [] });
  });
}