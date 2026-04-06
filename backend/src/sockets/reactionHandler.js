/**
 * Reaction Handler — Emoji reactions broadcast to nearby users.
 * Also handles profile data requests.
 */
import userService from '../services/UserService.js';
import proximityService from '../services/ProximityService.js';
import { EVENTS } from '../config/constants.js';

export default function reactionHandler(io, socket) {
  // ── Emoji Reactions ──
  socket.on(EVENTS.REACTION_SEND, (data) => {
    try {
      const { emoji } = data;
      if (!emoji || typeof emoji !== 'string') return;

      const user = userService.getUser(socket.id);
      if (!user) return;

      const payload = {
        userId: socket.id,
        username: user.username,
        emoji: emoji.substring(0, 4), // Limit emoji length
        timestamp: Date.now(),
      };

      // Send to self (to see own reaction on canvas)
      socket.emit(EVENTS.REACTION_BROADCAST, payload);

      // Send to all nearby users
      const nearbyIds = proximityService.getNearbyUsers(socket.id);
      for (const nearbyId of nearbyIds) {
        const nearbySocket = io.sockets.sockets.get(nearbyId);
        if (nearbySocket) {
          nearbySocket.emit(EVENTS.REACTION_BROADCAST, payload);
        }
      }

      // Also send to anyone who can see this user (within view radius)
      for (const [otherId, otherUser] of userService.users) {
        if (otherId === socket.id) continue;
        if (nearbyIds.includes(otherId)) continue; // Already sent

        const dx = user.x - otherUser.x;
        const dy = user.y - otherUser.y;
        if (dx * dx + dy * dy <= 600 * 600) {
          const otherSocket = io.sockets.sockets.get(otherId);
          if (otherSocket) {
            otherSocket.emit(EVENTS.REACTION_BROADCAST, payload);
          }
        }
      }
    } catch (err) {
      console.error('[Socket] Error in reaction:send:', err);
    }
  });

  // ── Profile Update (status/bio) ──
  socket.on(EVENTS.PROFILE_UPDATE, (data) => {
    try {
      const { status, bio } = data;
      const user = userService.getUser(socket.id);
      if (!user) return;

      if (status !== undefined) user.status = String(status).substring(0, 50);
      if (bio !== undefined) user.bio = String(bio).substring(0, 150);

      // Broadcast profile update to everyone who can see them
      for (const [otherId] of userService.users) {
        if (otherId === socket.id) continue;
        const otherSocket = io.sockets.sockets.get(otherId);
        if (otherSocket) {
          otherSocket.emit(EVENTS.PROFILE_DATA, {
            userId: socket.id,
            username: user.username,
            color: user.color,
            status: user.status || '',
            bio: user.bio || '',
          });
        }
      }
    } catch (err) {
      console.error('[Socket] Error in profile:update:', err);
    }
  });
}
