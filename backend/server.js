/**
 * Server entry point — boots up Express + Socket.IO + MongoDB.
 */
import 'dotenv/config';
import http from 'http';
import app from './src/app.js';
import { createSocketServer } from './src/config/socket.js';
import { connectDB } from './src/config/db.js';
import { registerSocketHandlers } from './src/sockets/index.js';

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = createSocketServer(server);

registerSocketHandlers(io);
connectDB();

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║        🌌 Virtual Cosmos Server              ║
║──────────────────────────────────────────────║
║  HTTP:   http://localhost:${PORT}              ║
║  Socket: ws://localhost:${PORT}                ║
║  Status: Ready                               ║
╚══════════════════════════════════════════════╝
  `);
});

process.on('SIGTERM', () => {
  console.log('[Server] Shutting down gracefully...');
  io.close();
  server.close(() => process.exit(0));
});
