/**
 * Shared constants between frontend and backend.
 * Must stay in sync with backend/src/config/constants.js
 */
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

export const MOVEMENT_SPEED = 4;
export const AVATAR_RADIUS = 20;
export const PROXIMITY_RADIUS = 150;

// Quick emoji reactions
export const REACTION_EMOJIS = ['👋', '👍', '❤️', '🔥', '😂', '🚀'];