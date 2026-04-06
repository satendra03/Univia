/**
 * MobileControls — Virtual joystick for touch AND small-screen devices.
 * Shows on touch devices OR when screen width is < 640px.
 */
import { useRef, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/useGameStore';

const JOYSTICK_SIZE = 100;
const KNOB_SIZE = 40;
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export default function MobileControls() {
  const [showJoystick, setShowJoystick] = useState(false);
  const [active, setActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const baseRef = useRef(null);
  const touchIdRef = useRef(null);
  const centerRef = useRef({ x: 0, y: 0 });
  const mouseDownRef = useRef(false);

  useEffect(() => {
    const check = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 640;
      setShowJoystick(hasTouch || isSmallScreen);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const updateKnob = useCallback((clientX, clientY) => {
    const cx = centerRef.current.x;
    const cy = centerRef.current.y;

    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > MAX_DISTANCE) {
      dx = (dx / dist) * MAX_DISTANCE;
      dy = (dy / dist) * MAX_DISTANCE;
    }

    setKnobPos({ x: dx, y: dy });
    const normX = dx / MAX_DISTANCE;
    const normY = dy / MAX_DISTANCE;
    useGameStore.getState().setJoystickDirection(normX, normY);
  }, []);

  const handleEnd = useCallback(() => {
    touchIdRef.current = null;
    mouseDownRef.current = false;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    useGameStore.getState().setJoystickDirection(0, 0);
  }, []);

  // Touch handling
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.touches[0];
    const rect = baseRef.current?.getBoundingClientRect();
    if (!rect) return;
    touchIdRef.current = touch.identifier;
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setActive(true);
    updateKnob(touch.clientX, touch.clientY);
  }, [updateKnob]);

  // Mouse handling (for testing on desktop at small size)
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = baseRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseDownRef.current = true;
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    setActive(true);
    updateKnob(e.clientX, e.clientY);
  }, [updateKnob]);

  useEffect(() => {
    if (!showJoystick) return;

    const handleTouchMove = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === touchIdRef.current) {
          e.preventDefault();
          updateKnob(touch.clientX, touch.clientY);
        }
      }
    };

    const handleTouchEnd = (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier === touchIdRef.current) handleEnd();
      }
    };

    const handleMouseMove = (e) => {
      if (mouseDownRef.current) updateKnob(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      if (mouseDownRef.current) handleEnd();
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showJoystick, updateKnob, handleEnd]);

  if (!showJoystick) return null;

  return (
    <div
      ref={baseRef}
      className="fixed z-30"
      onTouchStart={handleTouchStart}
      onMouseDown={handleMouseDown}
      style={{
        bottom: 24,
        left: 16,
        width: JOYSTICK_SIZE,
        height: JOYSTICK_SIZE,
        borderRadius: '50%',
        background: active ? 'rgba(129,140,248,0.15)' : 'rgba(129,140,248,0.08)',
        border: `2px solid ${active ? 'rgba(129,140,248,0.35)' : 'rgba(129,140,248,0.15)'}`,
        transition: active ? 'none' : 'all 0.2s ease',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        cursor: 'pointer',
      }}
    >
      {/* Crosshair */}
      <div style={{ position: 'absolute', top: '50%', left: '15%', right: '15%', height: 1, background: 'rgba(129,140,248,0.12)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '50%', top: '15%', bottom: '15%', width: 1, background: 'rgba(129,140,248,0.12)', pointerEvents: 'none' }} />

      {/* Direction arrows */}
      <div style={{ position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'rgba(129,140,248,0.3)', pointerEvents: 'none' }}>▲</div>
      <div style={{ position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'rgba(129,140,248,0.3)', pointerEvents: 'none' }}>▼</div>
      <div style={{ position: 'absolute', left: 5, top: '50%', transform: 'translateY(-50%)', fontSize: 7, color: 'rgba(129,140,248,0.3)', pointerEvents: 'none' }}>◀</div>
      <div style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', fontSize: 7, color: 'rgba(129,140,248,0.3)', pointerEvents: 'none' }}>▶</div>

      {/* Knob */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: '50%',
        background: active
          ? 'linear-gradient(135deg, rgba(129,140,248,0.6), rgba(167,139,250,0.5))'
          : 'rgba(129,140,248,0.25)',
        border: '2px solid rgba(129,140,248,0.4)',
        transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`,
        transition: active ? 'none' : 'transform 0.2s ease',
        boxShadow: active ? '0 0 20px rgba(129,140,248,0.3)' : 'none',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
