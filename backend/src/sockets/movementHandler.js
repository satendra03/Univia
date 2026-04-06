/**
 * Movement Handler — Processes position updates and proximity detection.
 *
 * OPTIMIZED:
 * 1. Interest-area broadcasting — only send moves to users within VIEW_RADIUS
 *    (not to ALL connected users). Cuts O(n²) → O(n × k).
 * 2. Skip redundant proximity list — only emit 'list' when nearby set changes.
 * 3. Min-distance proximity gate — only recompute proximity if moved >5px
 *    since last proximity check.
 */
import userService from '../services/UserService.js';
import proximityService from '../services/ProximityService.js';
import { EVENTS, MOVEMENT_THROTTLE_MS } from '../config/constants.js';

/**
 * VIEW_RADIUS — How far away a user must be before we stop sending
 * them our position updates. Larger than PROXIMITY_RADIUS so users
 * can see each other approaching before entering chat range.
 * Set to ~4x proximity radius (600px) for smooth visibility.
 */
const VIEW_RADIUS = 600;

/**
 * MIN_PROXIMITY_DIST — Minimum distance the user must have moved
 * since the last proximity computation before we recompute.
 * Avoid wasting CPU on tiny 2-4px moves that won't change proximity.
 */
const MIN_PROXIMITY_DIST = 5;

export default function movementHandler(io, socket) {
  let lastMoveTime = 0;
  let lastProxX = 0;
  let lastProxY = 0;
  let lastNearbySetKey = ''; // stringified nearby set for change detection

  socket.on(EVENTS.PLAYER_MOVE, (data) => {
    // Server-side throttle
    const now = Date.now();
    if (now - lastMoveTime < MOVEMENT_THROTTLE_MS) return;
    lastMoveTime = now;

    const { x, y } = data;
    if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) return;

    const user = userService.updatePosition(socket.id, x, y);
    if (!user) return;

    proximityService.updatePosition(socket.id, user.x, user.y);

    // ── OPTIMIZATION 1: Interest-area broadcasting ──
    // Only send position to users within VIEW_RADIUS (not broadcast to ALL)
    const movePayload = {
      playerId: socket.id,
      x: user.x,
      y: user.y,
    };

    for (const [otherId, otherUser] of userService.users) {
      if (otherId === socket.id) continue;

      const dx = user.x - otherUser.x;
      const dy = user.y - otherUser.y;
      const distSq = dx * dx + dy * dy;

      // Only send if within view radius (use squared distance to avoid sqrt)
      if (distSq <= VIEW_RADIUS * VIEW_RADIUS) {
        const otherSocket = io.sockets.sockets.get(otherId);
        if (otherSocket) {
          otherSocket.emit(EVENTS.PLAYER_MOVED, movePayload);
        }
      }
    }

    // ── OPTIMIZATION 3: Min-distance proximity gate ──
    const dxProx = user.x - lastProxX;
    const dyProx = user.y - lastProxY;
    const movedDistSq = dxProx * dxProx + dyProx * dyProx;

    if (movedDistSq < MIN_PROXIMITY_DIST * MIN_PROXIMITY_DIST) {
      return; // Haven't moved enough to bother recomputing proximity
    }

    lastProxX = user.x;
    lastProxY = user.y;

    // ── Proximity Detection ──
    const changes = proximityService.computeProximityChanges(
      socket.id, user.x, user.y, userService.users
    );

    // Notify about specific users entering proximity
    for (const enteredId of changes.entered) {
      const enteredUser = userService.getUser(enteredId);
      if (!enteredUser) continue;

      // Notify the moving user about who entered
      socket.emit(EVENTS.PROXIMITY_UPDATE, {
        type: 'entered',
        userId: enteredId,
        username: enteredUser.username,
        color: enteredUser.color,
      });

      // Notify the other user about who approached them
      const enteredSocket = io.sockets.sockets.get(enteredId);
      if (enteredSocket) {
        enteredSocket.emit(EVENTS.PROXIMITY_UPDATE, {
          type: 'entered',
          userId: socket.id,
          username: user.username,
          color: user.color,
        });

        // Send the OTHER user their updated nearby list (it changed)
        sendNearbyList(enteredSocket, enteredId);
      }
    }

    // Notify about specific users leaving proximity
    for (const exitedId of changes.exited) {
      const exitedUser = userService.getUser(exitedId);

      socket.emit(EVENTS.PROXIMITY_UPDATE, {
        type: 'exited',
        userId: exitedId,
        username: exitedUser?.username || 'Unknown',
      });

      const exitedSocket = io.sockets.sockets.get(exitedId);
      if (exitedSocket) {
        exitedSocket.emit(EVENTS.PROXIMITY_UPDATE, {
          type: 'exited',
          userId: socket.id,
          username: user.username,
        });

        // Send the OTHER user their updated nearby list (it changed)
        sendNearbyList(exitedSocket, exitedId);
      }
    }

    // ── OPTIMIZATION 2: Only send 'list' if the nearby set changed ──
    const newSetKey = changes.nearby.sort().join(',');
    if (newSetKey !== lastNearbySetKey) {
      lastNearbySetKey = newSetKey;
      sendNearbyList(socket, socket.id);
    }
  });

  /**
   * Helper: Send the current nearby user list to a specific socket.
   */
  function sendNearbyList(targetSocket, userId) {
    const nearbyIds = proximityService.getNearbyUsers(userId);
    const nearbyUsers = nearbyIds
      .map((id) => {
        const u = userService.getUser(id);
        return u ? { id: u.id, username: u.username, color: u.color } : null;
      })
      .filter(Boolean);

    targetSocket.emit(EVENTS.PROXIMITY_UPDATE, { type: 'list', nearby: nearbyUsers });
  }
}