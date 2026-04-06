/**
 * Sound Effects — Lightweight Web Audio API based sounds.
 * No external files needed — generates tones programmatically.
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Play a short synthesized sound effect.
 * @param {'proximityEnter' | 'proximityExit' | 'message' | 'reaction'} type
 */
export function playSound(type) {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'proximityEnter':
        // Rising two-tone chime (pleasant "connected" feel)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);        // C5
        osc.frequency.setValueAtTime(659, now + 0.1);  // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;

      case 'proximityExit':
        // Falling tone (soft "disconnected")
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);        // A4
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.2); // E4
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'message':
        // Quick pop (subtle notification)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);  // A5
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;

      case 'reaction':
        // Bright sparkle
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1047, now);  // C6
        osc.frequency.setValueAtTime(1319, now + 0.05); // E6
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      default:
        osc.disconnect();
        return;
    }
  } catch {
    // Silently ignore audio errors (user hasn't interacted yet, etc.)
  }
}
