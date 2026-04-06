/**
 * ChatService — Manages proximity-based chat rooms and message persistence.
 */
import Message from '../models/Message.js';

class ChatService {
  constructor() {
    /** @type {Map<string, Set<string>>} socketId → Set of roomIds */
    this.userRooms = new Map();
  }

  joinRoom(userId, roomId) {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, new Set());
    }
    this.userRooms.get(userId).add(roomId);
  }

  leaveRoom(userId, roomId) {
    const rooms = this.userRooms.get(userId);
    if (rooms) {
      rooms.delete(roomId);
      if (rooms.size === 0) this.userRooms.delete(userId);
    }
  }

  leaveAllRooms(userId) {
    const rooms = this.userRooms.get(userId);
    const roomList = rooms ? Array.from(rooms) : [];
    this.userRooms.delete(userId);
    return roomList;
  }

  getUserRooms(userId) {
    const rooms = this.userRooms.get(userId);
    return rooms ? Array.from(rooms) : [];
  }

  async saveMessage(messageData) {
    try {
      return await Message.create(messageData);
    } catch (err) {
      console.warn('[ChatService] Failed to save message:', err.message);
      return null;
    }
  }

  async getRoomHistory(roomId, limit = 50) {
    try {
      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return messages.reverse();
    } catch (err) {
      console.warn('[ChatService] Failed to fetch history:', err.message);
      return [];
    }
  }
}

export default new ChatService();