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
import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { MonitorX } from 'lucide-react';
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
  const isLoggedIn = useGameStore((s) => s.isLoggedIn);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Redirect to login if user typed /game directly in the URL
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useMovement();

  // Wait for redirect to prevent canvas from crashing when state is empty
  if (!isLoggedIn) return null;

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#0a0a0e', color: '#fff',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 32, textAlign: 'center', fontFamily: "'Inter', sans-serif"
      }}>
        <MonitorX size={48} color="#00e5ff" style={{ marginBottom: 24, opacity: 0.8 }} />
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Desktop Only</h2>
        <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.6, maxWidth: 320, marginBottom: 32 }}>
          Univia requires a larger screen and keyboard controls to navigate the cosmic canvas.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            padding: '12px 24px', borderRadius: 8, background: 'rgba(0,229,255,0.1)',
            border: '1px solid rgba(0,229,255,0.2)', color: '#00e5ff',
            fontWeight: 600, fontSize: 14, cursor: 'pointer'
          }}
        >
          Return Home
        </button>
      </div>
    );
  }

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
