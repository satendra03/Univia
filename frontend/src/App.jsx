/**
 * App — Root component that orchestrates the entire application.
 *
 * Conditionally renders:
 * - LoginScreen (when not logged in)
 * - Game world: Canvas + HUD + UserList + ChatPanel + MiniMap + MobileControls
 */
import { useCallback, useState, useEffect } from 'react';
import { useGameStore } from './store/useGameStore';
import useSocket from './hooks/useSocket';
import useMovement from './hooks/useMovement';
import LoginScreen from './components/LoginScreen';
import CosmosCanvas from './canvas/CosmosCanvas';
import HUD from './components/HUD';
import UserList from './components/UserList';
import ChatPanel from './components/ChatPanel';
import MiniMap from './components/MiniMap';

function GameWorld() {
  // Activate movement hook (keyboard + joystick input → position updates)
  useMovement();

  return (
    <>
      {/* PixiJS canvas — full screen, z-index 0 */}
      <CosmosCanvas />

      {/* UI overlay — positioned above canvas */}
      <HUD />
      <UserList />
      <ChatPanel />
      <MiniMap />
    </>
  );
}

export default function App() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const { joinGame } = useSocket();
  const { setUsername, setLoggedIn } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleJoin = useCallback((username) => {
    setUsername(username);
    setLoggedIn(true);
    joinGame(username);
  }, [joinGame]);

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-6 text-center z-50" style={{ background: '#0a0a1a' }}>
        <div className="glass-panel p-8 max-w-sm w-full">
          <div className="text-5xl mb-5">🖥️</div>
          <h1 className="text-2xl font-bold mb-3 text-white">Desktop Only</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Virtual Cosmos is currently only available for desktop devices. Please visit us on a computer!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isLoggedIn && <LoginScreen onJoin={handleJoin} />}
      {isLoggedIn && <GameWorld />}
    </>
  );
}
