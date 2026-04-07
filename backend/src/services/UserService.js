/**
 * UserService — Manages in-memory user state.
 * SRP: Only handles user CRUD & state—not proximity or chat.
 */
import { randomColor, randomSpawnPosition } from '../utils/helpers.js';
import { WORLD_WIDTH, WORLD_HEIGHT } from '../config/constants.js';

class UserService {
  constructor() {
    /** @type {Map<string, Object>} socketId → user state */
    this.users = new Map();
    /** @type {Map<string, string>} username → socketId */
    this.usernameToSocket = new Map();
  }

  addUser(socketId, username) {
    // Handle duplicate tabs: transfer session
    const existingSocketId = this.usernameToSocket.get(username);
    if (existingSocketId && this.users.has(existingSocketId)) {
      const existingUser = this.users.get(existingSocketId);
      this.users.delete(existingSocketId);
      existingUser.id = socketId;
      this.users.set(socketId, existingUser);
      this.usernameToSocket.set(username, socketId);
      return existingUser;
    }

    const color = randomColor();
    const position = randomSpawnPosition(WORLD_WIDTH, WORLD_HEIGHT);

    const user = { id: socketId, username, x: position.x, y: position.y, color };
    this.users.set(socketId, user);
    this.usernameToSocket.set(username, socketId);
    return user;
  }

  updatePosition(socketId, x, y) {
    const user = this.users.get(socketId);
    if (!user) return null;
    user.x = Math.max(0, Math.min(WORLD_WIDTH, x));
    user.y = Math.max(0, Math.min(WORLD_HEIGHT, y));
    return user;
  }

  removeUser(socketId) {
    const user = this.users.get(socketId);
    if (!user) return null;

    this.users.delete(socketId);
    this.usernameToSocket.delete(user.username);
    return user;
  }

  getUser(socketId) {
    return this.users.get(socketId) || null;
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  getUserCount() {
    return this.users.size;
  }
}

export default new UserService();