/**
 * Game Store — Central state management for the game world.
 * Added: reactions, user profiles, mobile joystick state.
 */
import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // ─── Auth / Identity ────────────────────────────────────────
  username: '',
  isLoggedIn: false,
  loginError: '',
  setUsername: (username) => set({ username }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setLoginError: (loginError) => set({ loginError }),

  // ─── Server Status ──────────────────────────────────────────
  serverActive: false,
  checkingHealth: true,
  setServerActive: (serverActive) => set({ serverActive }),
  setCheckingHealth: (checkingHealth) => set({ checkingHealth }),

  // ─── Profile (status/bio) ──────────────────────────────────
  userStatus: '',
  userBio: '',
  setUserStatus: (userStatus) => set({ userStatus }),
  setUserBio: (userBio) => set({ userBio }),

  // ─── Self (local player) ───────────────────────────────────
  self: null,
  setSelf: (self) => set({ self }),
  updateSelfPosition: (x, y) =>
    set((state) => ({
      self: state.self ? { ...state.self, x, y } : null,
    })),

  // ─── Other Players ─────────────────────────────────────────
  players: {},
  setPlayers: (playersArray) => {
    const playersMap = {};
    playersArray.forEach((p) => {
      playersMap[p.id] = p;
    });
    set({ players: playersMap });
  },
  addPlayer: (player) =>
    set((state) => ({
      players: { ...state.players, [player.id]: player },
    })),
  updatePlayerPosition: (playerId, x, y) =>
    set((state) => {
      const player = state.players[playerId];
      if (!player) return state;
      return {
        players: {
          ...state.players,
          [playerId]: { ...player, x, y },
        },
      };
    }),
  removePlayer: (playerId) =>
    set((state) => {
      const { [playerId]: _, ...rest } = state.players;
      return { players: rest };
    }),
  updatePlayerProfile: (playerId, profileData) =>
    set((state) => {
      const player = state.players[playerId];
      if (!player) return state;
      return {
        players: {
          ...state.players,
          [playerId]: { ...player, ...profileData },
        },
      };
    }),

  // ─── World Config ──────────────────────────────────────────
  world: { width: 3000, height: 2000 },
  setWorld: (world) => set({ world }),

  // ─── Nearby Users (proximity) ──────────────────────────────
  nearbyUsers: [],
  setNearbyUsers: (nearbyUsers) => set({ nearbyUsers }),

  nearbyDetails: {},
  addNearbyDetail: (userId, username, color) =>
    set((state) => ({
      nearbyDetails: {
        ...state.nearbyDetails,
        [userId]: { username, color },
      },
    })),
  removeNearbyDetail: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.nearbyDetails;
      return { nearbyDetails: rest };
    }),
  clearNearbyDetails: () => set({ nearbyDetails: {} }),

  // ─── Floating Reactions ────────────────────────────────────
  /** Array of { id, userId, emoji, timestamp } for floating emoji animations */
  floatingReactions: [],
  addFloatingReaction: (reaction) =>
    set((state) => ({
      floatingReactions: [...state.floatingReactions, {
        ...reaction,
        id: `${reaction.userId}-${Date.now()}-${Math.random()}`,
      }].slice(-30), // Keep max 30 active
    })),
  removeFloatingReaction: (id) =>
    set((state) => ({
      floatingReactions: state.floatingReactions.filter((r) => r.id !== id),
    })),
  clearFloatingReactions: () => set({ floatingReactions: [] }),

  // ─── User Profiles (for profile popup) ─────────────────────
  /** Viewed profile — null or { userId, username, color, status, bio } */
  viewedProfile: null,
  setViewedProfile: (profile) => set({ viewedProfile: profile }),

  // ─── UI State ──────────────────────────────────────────────
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  setChatOpen: (isChatOpen) => set({ isChatOpen }),

  // ─── Mobile Joystick ──────────────────────────────────────
  joystickDirection: { dx: 0, dy: 0 },
  setJoystickDirection: (dx, dy) => set({ joystickDirection: { dx, dy } }),

  // ─── Connection Status ─────────────────────────────────────
  isConnected: false,
  setConnected: (isConnected) => set({ isConnected }),
}));