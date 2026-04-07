/**
 * App — Root component with React Router DOM routing.
 *
 * Routes:
 *   /          → LandingPage
 *   /login     → LoginScreen
 *   /game      → GameWorld (canvas + HUD)
 *   /features  → FeaturesPage
 *   /about     → AboutPage
 *   /docs      → DocsPage
 *   /privacy   → PrivacyPage
 *   /terms     → TermsPage
 */
import { useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useGameStore } from './store/useGameStore';
import useSocket from './hooks/useSocket';
import useMovement from './hooks/useMovement';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import CosmosCanvas from './canvas/CosmosCanvas';
import HUD from './components/HUD';
import UserList from './components/UserList';
import ChatPanel from './components/ChatPanel';
import MiniMap from './components/MiniMap';
import FeaturesPage from './components/FeaturesPage';
import AboutPage from './components/AboutPage';
import DocsPage from './components/DocsPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';

function GameWorld() {
  useMovement();

  return (
    <>
      <CosmosCanvas />
      <HUD />
      <UserList />
      <ChatPanel />
      <MiniMap />
    </>
  );
}

/** Scroll to top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const { joinGame } = useSocket();
  const { setUsername, setLoggedIn } = useGameStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Redirect to /game when logged in
  useEffect(() => {
    if (isLoggedIn && pathname !== '/game') {
      navigate('/game', { replace: true });
    }
  }, [isLoggedIn, pathname, navigate]);

  // Toggle body scroll lock: only lock on /login and /game
  useEffect(() => {
    const lockedPaths = ['/login', '/game'];
    if (lockedPaths.includes(pathname)) {
      document.body.classList.add('game-active');
    } else {
      document.body.classList.remove('game-active');
    }
    return () => document.body.classList.remove('game-active');
  }, [pathname]);

  const handleJoin = useCallback((username) => {
    setUsername(username);
    setLoggedIn(true);
    joinGame(username);
  }, [joinGame, setUsername, setLoggedIn]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage onEnter={() => navigate('/login')} />} />
        <Route path="/login" element={<LoginScreen onJoin={handleJoin} />} />
        <Route path="/game" element={<GameWorld />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </>
  );
}
