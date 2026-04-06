/**
 * Socket handler registry — Composes all socket handlers (OCP).
 */
import connectionHandler from './connectionHandler.js';
import movementHandler from './movementHandler.js';
import chatHandler from './chatHandler.js';
import reactionHandler from './reactionHandler.js';

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    connectionHandler(io, socket);
    movementHandler(io, socket);
    chatHandler(io, socket);
    reactionHandler(io, socket);
  });
}
