/**
 * useSocket — Hook for managing socket connection lifecycle.
 * Handles: game state, proximity, chat, typing, reactions, profiles.
 */
import { useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { useGameStore } from '../store/useGameStore';
import { useChatStore } from '../store/useChatStore';
import { EVENTS } from '../utils/constants';
import { playSound } from '../utils/sounds';

export default function useSocket() {
  const joinGame = useCallback((username) => {
    const socket = socketService.connect();

    // ─── Connection Events ────────────────────────────────────
    socket.on('connect', () => {
      useGameStore.getState().setConnected(true);
      socketService.emit(EVENTS.PLAYER_JOIN, { username });
    });

    socket.on('disconnect', () => {
      useGameStore.getState().setConnected(false);
    });

    socket.on('reconnect', () => {
      useGameStore.getState().setConnected(true);
      socketService.emit(EVENTS.PLAYER_JOIN, { username });
    });

    // ─── Game State Events ────────────────────────────────────
    socket.on(EVENTS.PLAYERS_STATE, (data) => {
      useGameStore.getState().setSelf(data.self);
      useGameStore.getState().setPlayers(data.players);
      useGameStore.getState().setWorld(data.world);
    });

    socket.on(EVENTS.PLAYER_JOINED, (data) => {
      useGameStore.getState().addPlayer(data.player);
    });

    socket.on(EVENTS.PLAYER_MOVED, (data) => {
      useGameStore.getState().updatePlayerPosition(data.playerId, data.x, data.y);
    });

    socket.on(EVENTS.PLAYER_LEFT, (data) => {
      useGameStore.getState().removePlayer(data.playerId);
      useGameStore.getState().removeNearbyDetail(data.playerId);
    });

    // ─── Proximity Events ─────────────────────────────────────
    socket.on(EVENTS.PROXIMITY_UPDATE, (data) => {
      const store = useGameStore.getState();
      const chatStore = useChatStore.getState();

      if (data.type === 'entered') {
        store.addNearbyDetail(data.userId, data.username, data.color);
        store.setChatOpen(true);
        playSound('proximityEnter');

      } else if (data.type === 'exited') {
        store.removeNearbyDetail(data.userId);
        playSound('proximityExit');

      } else if (data.type === 'list') {
        const prevNearby = store.nearbyUsers;
        store.setNearbyUsers(data.nearby || []);

        const nowNearby = data.nearby || [];
        if (prevNearby.length > 0 && nowNearby.length === 0) {
          chatStore.clearAll();
          store.setChatOpen(false);
          store.clearNearbyDetails();
          store.clearFloatingReactions();
        }
      }
    });

    // ─── Chat Events ──────────────────────────────────────────
    socket.on(EVENTS.CHAT_MESSAGE, (data) => {
      const chatStore = useChatStore.getState();
      chatStore.addMessage(data);
      playSound('message');

      const isChatOpen = useGameStore.getState().isChatOpen;
      if (!isChatOpen) {
        chatStore.incrementUnread();
      }
    });

    socket.on(EVENTS.CHAT_HISTORY, (data) => {
      if (data.messages && data.messages.length > 0) {
        useChatStore.getState().setHistory(data.messages);
      }
    });

    // ─── Typing Events ───────────────────────────────────────
    socket.on(EVENTS.CHAT_TYPING_UPDATE, (data) => {
      useChatStore.getState().setTyping(data.userId, data.username, data.isTyping);
    });

    // ─── Reaction Events ─────────────────────────────────────
    socket.on(EVENTS.REACTION_BROADCAST, (data) => {
      useGameStore.getState().addFloatingReaction(data);

      // Auto-remove after animation (2s)
      setTimeout(() => {
        const id = `${data.userId}-${data.timestamp}-${Math.random()}`;
        // Reactions auto-clean via slice(-30) in store
      }, 2500);
    });

    // ─── Profile Events ──────────────────────────────────────
    socket.on(EVENTS.PROFILE_DATA, (data) => {
      useGameStore.getState().updatePlayerProfile(data.userId, {
        status: data.status,
        bio: data.bio,
      });
    });

    socket.on(EVENTS.ERROR, (data) => {
      console.error('[Game Error]:', data.message);
      // Force logout and show error if it's a login/username error
      if (data.message.toLowerCase().includes('username') || data.message.toLowerCase().includes('failed to join')) {
        useGameStore.getState().setLoggedIn(false);
        useGameStore.getState().setLoginError(data.message);
        socketService.disconnect();
      }
    });

    if (socket.connected) {
      socketService.emit(EVENTS.PLAYER_JOIN, { username });
    }
  }, []);

  const leaveGame = useCallback(() => {
    socketService.disconnect();
    useGameStore.getState().setConnected(false);
    useGameStore.getState().setSelf(null);
    useGameStore.getState().setPlayers({});
    useGameStore.getState().clearNearbyDetails();
    useGameStore.getState().setLoggedIn(false);
    useGameStore.getState().clearFloatingReactions();
    useChatStore.getState().clearAll();
  }, []);

  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  return { joinGame, leaveGame };
}
