/**
 * Virtual Cosmos — Visual Load Test
 *
 * Spawns a small number of virtual users that you can WATCH on your
 * frontend at http://localhost:5173. Open the frontend and you'll see
 * the bot avatars moving around, entering proximity, and chatting.
 *
 * Usage:
 *   node visualize.js                   (default: 10 users, cluster mode)
 *   node visualize.js --users 20        (custom count)
 *   node visualize.js --speed slow      (slower movement for easier viewing)
 *
 * Then open http://localhost:5173 in your browser, login as any name,
 * and watch the bots roaming around the cosmos!
 */

import { io } from 'socket.io-client';
import chalk from 'chalk';

const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultVal;
}

const TOTAL_USERS = parseInt(getArg('users', '10'), 10);
const SERVER_URL = getArg('server', 'http://localhost:3000');
const SPEED_MODE = getArg('speed', 'normal'); // slow, normal, fast
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2000;

// Speed settings
const SPEED = { slow: 1.5, normal: 3, fast: 6 }[SPEED_MODE] || 3;
const MOVE_INTERVAL = { slow: 300, normal: 150, fast: 80 }[SPEED_MODE] || 150;

// Group definitions — each group moves together as a cluster
const GROUPS = [
  { name: 'Alpha',   color: '🔴', cx: 600,  cy: 500,  r: 100, members: [] },
  { name: 'Bravo',   color: '🔵', cx: 1500, cy: 800,  r: 100, members: [] },
  { name: 'Charlie', color: '🟢', cx: 2400, cy: 500,  r: 100, members: [] },
  { name: 'Delta',   color: '🟡', cx: 800,  cy: 1400, r: 100, members: [] },
  { name: 'Echo',    color: '🟣', cx: 2000, cy: 1500, r: 100, members: [] },
];

const CHAT_LINES = [
  'Hey team!', 'Let\'s go!', 'Follow me!', 'What\'s up?',
  'Nice!', 'Over here!', 'Wait up!', 'Looking good!',
  'Let\'s explore west', 'Head north!', 'Regroup!', '🚀',
];

class VisualBot {
  constructor(id, username, group) {
    this.id = id;
    this.username = username;
    this.group = group;
    this.socket = null;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.nearbyCount = 0;
    this.moveTimer = null;
    this.chatTimer = null;
    this.connected = false;

    // Spawn in group zone
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * group.r * 0.8;
    this.x = group.cx + Math.cos(angle) * dist;
    this.y = group.cy + Math.sin(angle) * dist;
    this._setNewTarget();
  }

  _setNewTarget() {
    // Usually stay near group, occasionally wander toward another group
    if (Math.random() < 0.1) {
      // Wander to another group
      const otherGroup = GROUPS[Math.floor(Math.random() * GROUPS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * otherGroup.r;
      this.targetX = otherGroup.cx + Math.cos(angle) * dist;
      this.targetY = otherGroup.cy + Math.sin(angle) * dist;
    } else {
      // Stay in own group zone
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * this.group.r;
      this.targetX = this.group.cx + Math.cos(angle) * dist;
      this.targetY = this.group.cy + Math.sin(angle) * dist;
    }
  }

  async connect() {
    return new Promise((resolve) => {
      this.socket = io(SERVER_URL, {
        transports: ['websocket'],
        forceNew: true,
        timeout: 10000,
        reconnection: false,
      });

      this.socket.on('connect', () => {
        this.connected = true;
        this.socket.emit('player:join', { username: this.username });
        resolve(true);
      });

      this.socket.on('players:state', (data) => {
        if (data.self) {
          this.x = data.self.x;
          this.y = data.self.y;
        }
      });

      this.socket.on('proximity:update', (data) => {
        if (data.type === 'list') {
          this.nearbyCount = (data.nearby || []).length;
        }
      });

      this.socket.on('connect_error', () => resolve(false));
      setTimeout(() => !this.connected && resolve(false), 10000);
    });
  }

  startMoving() {
    this.moveTimer = setInterval(() => {
      if (!this.connected) return;

      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        this._setNewTarget();
        return;
      }

      this.x += (dx / dist) * SPEED;
      this.y += (dy / dist) * SPEED;
      this.x = Math.max(0, Math.min(WORLD_WIDTH, this.x));
      this.y = Math.max(0, Math.min(WORLD_HEIGHT, this.y));

      this.socket.emit('player:move', { x: this.x, y: this.y });
    }, MOVE_INTERVAL);

    // Periodic chat
    this.chatTimer = setInterval(() => {
      if (!this.connected || this.nearbyCount === 0) return;
      if (Math.random() < 0.2) {
        const msg = CHAT_LINES[Math.floor(Math.random() * CHAT_LINES.length)];
        this.socket.emit('chat:send', { content: msg });
      }
    }, 3000 + Math.random() * 4000);
  }

  disconnect() {
    if (this.moveTimer) clearInterval(this.moveTimer);
    if (this.chatTimer) clearInterval(this.chatTimer);
    if (this.socket) this.socket.disconnect();
  }
}

// ─── Main ────────────────────────────────────────────────────
async function run() {
  console.log('');
  console.log(chalk.hex('#818cf8').bold('  🔭  Virtual Cosmos — Visual Test'));
  console.log(chalk.gray(`  Spawning ${TOTAL_USERS} bots in ${GROUPS.length} groups`));
  console.log(chalk.gray(`  Speed: ${SPEED_MODE} | Server: ${SERVER_URL}`));
  console.log('');

  // Distribute users across groups
  const botsPerGroup = Math.ceil(TOTAL_USERS / GROUPS.length);
  const bots = [];

  for (let i = 0; i < TOTAL_USERS; i++) {
    const groupIdx = i % GROUPS.length;
    const group = GROUPS[groupIdx];
    const username = `${group.name.toLowerCase()}_${Math.floor(i / GROUPS.length) + 1}`;
    const bot = new VisualBot(i, username, group);
    bots.push(bot);
    group.members.push(username);
  }

  // Connect all
  console.log(chalk.gray('  Connecting bots...\n'));

  let connected = 0;
  for (const bot of bots) {
    const ok = await bot.connect();
    if (ok) {
      connected++;
      bot.startMoving();
    }
    await sleep(100);
  }

  console.log(chalk.green(`  ✓ ${connected}/${TOTAL_USERS} bots connected and moving!\n`));
  console.log(chalk.white.bold('  📺 Open your frontend at http://localhost:5173'));
  console.log(chalk.white('     Login as any name and watch the bots move around!\n'));

  // Print group info
  for (const group of GROUPS) {
    console.log(chalk.gray(`    ${group.color}  ${group.name.padEnd(8)} — ${group.members.length} bots at (${group.cx}, ${group.cy})`));
  }

  console.log(chalk.gray('\n  Press Ctrl+C to stop.\n'));

  // Live status
  setInterval(() => {
    const statusParts = GROUPS.map((g) => {
      const activeBots = bots.filter(b => b.group === g && b.connected);
      const nearbySum = activeBots.reduce((s, b) => s + b.nearbyCount, 0);
      return `${g.color} ${g.name}:${nearbySum}n`;
    });
    process.stdout.write(`\r  ${chalk.gray('Nearby:')} ${statusParts.join('  ')}  `);
  }, 2000);

  // Keep running
  process.on('SIGINT', () => {
    console.log(chalk.gray('\n\n  Disconnecting all bots...'));
    bots.forEach((b) => b.disconnect());
    setTimeout(() => process.exit(0), 1000);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

run().catch((err) => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});
