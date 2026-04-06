/**
 * Utility helpers — math, color, and spawn functions.
 */

export function euclideanDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  const sat = 60 + Math.floor(Math.random() * 30);
  const light = 55 + Math.floor(Math.random() * 20);
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

export function randomSpawnPosition(worldWidth, worldHeight, padding = 50) {
  return {
    x: padding + Math.random() * (worldWidth - 2 * padding),
    y: padding + Math.random() * (worldHeight - 2 * padding),
  };
}