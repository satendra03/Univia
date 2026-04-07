/**
 * Socket Service — Singleton abstraction over Socket.IO client.
 *
 * Separation of concerns: All socket communication goes through this layer.
 * Components never import socket.io-client directly.
 */
import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this._listeners = new Map();
  }

  /**
   * Initialize the socket connection.
   * @returns {import('socket.io-client').Socket}
   */
  connect() {
    if (this.socket?.connected) return this.socket;

    this.socket = io(SERVER_URL, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    return this.socket;
  }

  /**
   * Disconnect the socket.
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Emit an event to the server.
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Listen for an event from the server.
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove a listener for an event.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Get connection status.
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get the socket ID.
   * @returns {string|null}
   */
  getId() {
    return this.socket?.id || null;
  }
}

// Singleton export
const socketService = new SocketService();
export default socketService;