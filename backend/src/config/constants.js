/**
 * Application constants — centralized configuration values.
 * Keeps magic numbers out of business logic (SRP).
 */
export const WORLD_WIDTH = parseInt(process.env.WORLD_WIDTH, 10) || 3000;
export const WORLD_HEIGHT = parseInt(process.env.WORLD_HEIGHT, 10) || 2000;
export const PROXIMITY_RADIUS = parseInt(process.env.PROXIMITY_RADIUS, 10) || 150;
export const GRID_CELL_SIZE = parseInt(process.env.GRID_CELL_SIZE, 10) || 150;
export const AVATAR_RADIUS = 20;
export const MOVEMENT_THROTTLE_MS = 50;

// Socket events — single source of truth prevents typos
export const EVENTS = {
  // Client → Server
  PLAYER_JOIN: 'player:join',
  PLAYER_MOVE: 'player:move',
  CHAT_SEND: 'chat:send',
  CHAT_TYPING: 'chat:typing',
  REACTION_SEND: 'reaction:send',
  PROFILE_UPDATE: 'profile:update',

  // Server → Client
  PLAYERS_STATE: 'players:state',
  PLAYER_JOINED: 'player:joined',
  PLAYER_MOVED: 'player:moved',
  PLAYER_LEFT: 'player:left',
  PROXIMITY_UPDATE: 'proximity:update',
  CHAT_MESSAGE: 'chat:message',
  CHAT_HISTORY: 'chat:history',
  CHAT_TYPING_UPDATE: 'chat:typing:update',
  REACTION_BROADCAST: 'reaction:broadcast',
  PROFILE_DATA: 'profile:data',
  ERROR: 'error',
};