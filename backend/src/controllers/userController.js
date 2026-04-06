/**
 * User Controller — REST API endpoints for user operations.
 */
import userService from '../services/UserService.js';
import proximityService from '../services/ProximityService.js';

export const getOnlineUsers = (req, res) => {
  const users = userService.getAllUsers();
  res.json({
    count: users.length,
    users: users.map(({ id, username, color, x, y }) => ({
      id, username, color, position: { x, y },
    })),
  });
};

export const getStats = (req, res) => {
  res.json({
    onlineUsers: userService.getUserCount(),
    gridStats: proximityService.getStats(),
  });
};