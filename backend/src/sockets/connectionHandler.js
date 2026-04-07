/**
 * Connection Handler — Manages player join and disconnect events.
 *
 * Fixed: When a player disconnects, all their nearby users get
 * proximity exit notifications AND updated nearby lists. This ensures
 * connection lines and chat state update on all screens.
 */
import userService from '../services/UserService.js';
import proximityService from '../services/ProximityService.js';
import { EVENTS, WORLD_WIDTH, WORLD_HEIGHT } from '../config/constants.js';

export default function connectionHandler(io, socket) {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on(EVENTS.PLAYER_JOIN, async (data) => {
    try {
      const { username } = data;

      if (!username || typeof username !== 'string' || username.trim().length < 2) {
        socket.emit(EVENTS.ERROR, { message: 'Username must be at least 2 characters.' });
        return;
      }

      const sanitizedName = username.trim().substring(0, 20);

      // Check if username is already taken by another active connection
      if (userService.usernameToSocket.has(sanitizedName)) {
        socket.emit(EVENTS.ERROR, { message: 'Username is already taken by an active player.' });
        return;
      }

      const user = userService.addUser(socket.id, sanitizedName);

      proximityService.updatePosition(socket.id, user.x, user.y);

      socket.emit(EVENTS.PLAYERS_STATE, {
        self: user,
        players: userService.getAllUsers().filter((u) => u.id !== socket.id),
        world: { width: WORLD_WIDTH, height: WORLD_HEIGHT },
      });

      socket.broadcast.emit(EVENTS.PLAYER_JOINED, { player: user });

      console.log(`[Socket] ${sanitizedName} joined (${userService.getUserCount()} online)`);
    } catch (err) {
      console.error('[Socket] Error in player:join:', err);
      socket.emit(EVENTS.ERROR, { message: 'Failed to join. Please try again.' });
    }
  });

  socket.on('disconnect', async (reason) => {
    try {
      const user = userService.getUser(socket.id);
      if (!user) return;

      // Before removing, notify all nearby users that this user has left proximity
      const nearbyIds = proximityService.getNearbyUsers(socket.id);
      for (const nearbyId of nearbyIds) {
        const nearbySocket = io.sockets.sockets.get(nearbyId);
        if (nearbySocket) {
          // Notify them this user exited proximity
          nearbySocket.emit(EVENTS.PROXIMITY_UPDATE, {
            type: 'exited',
            userId: socket.id,
            username: user.username,
          });
        }
      }

      // Now remove the user (this also cleans up proximity map symmetrically)
      proximityService.removeUser(socket.id);

      // After removal, send updated nearby lists to all affected users
      for (const nearbyId of nearbyIds) {
        const nearbySocket = io.sockets.sockets.get(nearbyId);
        if (nearbySocket) {
          const updatedNearby = proximityService.getNearbyUsers(nearbyId);
          const nearbyUsers = updatedNearby
            .map((id) => {
              const u = userService.getUser(id);
              return u ? { id: u.id, username: u.username, color: u.color } : null;
            })
            .filter(Boolean);

          nearbySocket.emit(EVENTS.PROXIMITY_UPDATE, { type: 'list', nearby: nearbyUsers });
        }
      }

      userService.removeUser(socket.id);

      io.emit(EVENTS.PLAYER_LEFT, { playerId: socket.id, username: user.username });

      console.log(`[Socket] ${user.username} disconnected (${reason}). ${userService.getUserCount()} online`);
    } catch (err) {
      console.error('[Socket] Error in disconnect:', err);
    }
  });
}