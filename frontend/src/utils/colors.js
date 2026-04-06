/**
 * Color utility functions for the cosmos theme.
 */

/**
 * Convert an HSL string like "hsl(210, 70%, 60%)" to a hex number for PixiJS.
 * @param {string} hslStr
 * @returns {number} Hex color number (e.g. 0xff00ff)
 */
export function hslToHex(hslStr) {
  // Parse "hsl(H, S%, L%)"
  const match = hslStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return 0x818cf8; // fallback indigo

  const h = parseInt(match[1]) / 360;
  const s = parseInt(match[2]) / 100;
  const l = parseInt(match[3]) / 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c) => Math.round(c * 255);
  return (toHex(r) << 16) + (toHex(g) << 8) + toHex(b);
}

/**
 * Convert hex number to CSS hex string.
 * @param {number} hex
 * @returns {string} e.g. "#818cf8"
 */
export function hexToString(hex) {
  return '#' + hex.toString(16).padStart(6, '0');
}

/**
 * Generate avatar gradient colors from a base color.
 * @param {string} colorStr HSL or hex string
 * @returns {{ primary: number, glow: number }}
 */
export function getAvatarColors(colorStr) {
  const primary = hslToHex(colorStr);
  // Lighter glow variant
  const r = ((primary >> 16) & 0xff);
  const g = ((primary >> 8) & 0xff);
  const b = (primary & 0xff);
  const glow = (Math.min(255, r + 60) << 16) + (Math.min(255, g + 60) << 8) + Math.min(255, b + 60);
  return { primary, glow };
}