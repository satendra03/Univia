/**
 * Socket.IO server configuration.
 */
import { Server } from 'socket.io';

export const createSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
    pingInterval: 25000,
    pingTimeout: 60000,
    transports: ['polling', 'websocket'],
  });

  return io;
};