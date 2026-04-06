/**
 * ProximityService — Handles proximity detection with hysteresis.
 *
 * Hysteresis prevents rapid enter/exit flickering at the boundary:
 * - ENTER proximity when distance ≤ PROXIMITY_RADIUS (150px)
 * - EXIT proximity when distance > PROXIMITY_RADIUS + HYSTERESIS_BUFFER (180px)
 *
 * FIXED: Proximity map is now kept symmetric. When user A exits B's proximity,
 * BOTH A's and B's proximity maps are updated. This ensures getNearbyUsers()
 * returns correct results for both sides.
 */
import SpatialGrid from '../utils/SpatialGrid.js';
import { euclideanDistance } from '../utils/helpers.js';
import { PROXIMITY_RADIUS, GRID_CELL_SIZE } from '../config/constants.js';

const HYSTERESIS_BUFFER = 30; // px — exit threshold = PROXIMITY_RADIUS + this
const EXIT_RADIUS = PROXIMITY_RADIUS + HYSTERESIS_BUFFER;

class ProximityService {
  constructor() {
    this.grid = new SpatialGrid(GRID_CELL_SIZE);
    /** @type {Map<string, Set<string>>} socketId → Set of nearby socketIds */
    this.proximityMap = new Map();
  }

  updatePosition(userId, x, y) {
    this.grid.updateUser(userId, x, y);
  }

  removeUser(userId) {
    this.grid.removeUser(userId);

    // Clean up symmetric references: remove this user from everyone else's nearby set
    const nearby = this.proximityMap.get(userId);
    if (nearby) {
      for (const otherId of nearby) {
        const otherNearby = this.proximityMap.get(otherId);
        if (otherNearby) {
          otherNearby.delete(userId);
        }
      }
    }
    this.proximityMap.delete(userId);
  }

  /**
   * Compute proximity changes with hysteresis.
   * Also keeps the proximity map SYMMETRIC — both sides updated.
   */
  computeProximityChanges(userId, x, y, allUsers) {
    const candidateIds = this.grid.getNearbyUserIds(x, y);
    const prevNearby = this.proximityMap.get(userId) || new Set();
    const nowNearby = new Set();

    for (const candidateId of candidateIds) {
      if (candidateId === userId) continue;
      const candidate = allUsers.get(candidateId);
      if (!candidate) continue;

      const dist = euclideanDistance(x, y, candidate.x, candidate.y);
      const wasPreviouslyNearby = prevNearby.has(candidateId);

      if (wasPreviouslyNearby) {
        // Already nearby → only exit if beyond the EXIT_RADIUS (hysteresis)
        if (dist <= EXIT_RADIUS) {
          nowNearby.add(candidateId);
        }
        // else: distance > EXIT_RADIUS → they leave (not added to nowNearby)
      } else {
        // Not previously nearby → only enter at the strict PROXIMITY_RADIUS
        if (dist <= PROXIMITY_RADIUS) {
          nowNearby.add(candidateId);
        }
      }
    }

    // Also keep users who are in prevNearby but not in candidateIds
    // (they might have moved to a non-adjacent grid cell but still within exit radius)
    for (const prevId of prevNearby) {
      if (nowNearby.has(prevId)) continue; // Already handled
      const candidate = allUsers.get(prevId);
      if (!candidate) continue;
      const dist = euclideanDistance(x, y, candidate.x, candidate.y);
      if (dist <= EXIT_RADIUS) {
        nowNearby.add(prevId);
      }
    }

    const entered = [];
    const exited = [];

    for (const id of nowNearby) {
      if (!prevNearby.has(id)) entered.push(id);
    }
    for (const id of prevNearby) {
      if (!nowNearby.has(id)) exited.push(id);
    }

    // Update the moving user's proximity map
    this.proximityMap.set(userId, nowNearby);

    // ── Keep the map SYMMETRIC ──
    // When A enters B's proximity, add A to B's map and B to A's map
    for (const enteredId of entered) {
      const otherNearby = this.proximityMap.get(enteredId) || new Set();
      otherNearby.add(userId);
      this.proximityMap.set(enteredId, otherNearby);
    }

    // When A exits B's proximity, remove A from B's map
    for (const exitedId of exited) {
      const otherNearby = this.proximityMap.get(exitedId);
      if (otherNearby) {
        otherNearby.delete(userId);
      }
    }

    return { entered, exited, nearby: Array.from(nowNearby) };
  }

  getNearbyUsers(userId) {
    const nearby = this.proximityMap.get(userId);
    return nearby ? Array.from(nearby) : [];
  }

  static getRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('::');
  }

  getStats() {
    return this.grid.getStats();
  }
}

export default new ProximityService();