/**
 * Virtual Cosmos — Load Test Script
 *
 * Simulates virtual users that:
 * - Connect and join with unique usernames
 * - Move around the world randomly (forming clusters for proximity)
 * - Send chat messages when in proximity with others
 * - Track connection, movement, proximity, and chat metrics
 *
 * Usage:
 *   node loadtest.js --users 50
 *   node loadtest.js --users 100 --duration 60 --server http://localhost:3000
 *   node loadtest.js --users 200 --cluster    (users spawn in clusters)
 */

import { io } from 'socket.io-client';
import chalk from 'chalk';

// ─── CLI Args ────────────────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, defaultVal) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultVal;
}

const TOTAL_USERS = parseInt(getArg('users', '50'), 10);
const DURATION_SEC = parseInt(getArg('duration', '60'), 10);
const SERVER_URL = getArg('server', 'http://localhost:3000');
const CLUSTER_MODE = args.includes('--cluster');
const RAMP_UP_SEC = parseInt(getArg('rampup', '10'), 10);
const MOVE_INTERVAL_MS = parseInt(getArg('moveInterval', '200'), 10);
const CHAT_CHANCE = parseFloat(getArg('chatChance', '0.3')); // 30% chance to chat when nearby

// ─── World Config ────────────────────────────────────────────
const WORLD_WIDTH = 3000;
const WORLD_HEIGHT = 2000;
const PROXIMITY_RADIUS = 150;

// ─── Cluster Zones (for cluster mode) ────────────────────────
const CLUSTER_ZONES = [
  { cx: 500, cy: 400, r: 200 },
  { cx: 1500, cy: 1000, r: 200 },
  { cx: 2500, cy: 600, r: 200 },
  { cx: 1000, cy: 1500, r: 200 },
  { cx: 2000, cy: 1400, r: 200 },
];

// ─── Chat Messages ───────────────────────────────────────────
const CHAT_MESSAGES = [
  'Hello!', 'Hey there!', 'What\'s up?', 'Nice to meet you!',
  'How are you?', 'Cool!', 'Awesome!', 'Let\'s explore!',
  'Follow me!', 'Where are you going?', 'Wait up!', 'See you!',
  'This is fun!', 'Great spot!', 'Anyone here?', 'GG!',
  'LOL', 'brb', 'Nice!', 'Yo!',
];

// ─── Metrics ─────────────────────────────────────────────────
const metrics = {
  connectAttempts: 0,
  connected: 0,
  connectFailed: 0,
  disconnected: 0,
  movesSent: 0,
  proximityEntered: 0,
  proximityExited: 0,
  chatSent: 0,
  chatReceived: 0,
  errors: 0,
  latencies: [],       // connection latencies in ms
  peakNearby: 0,       // max simultaneous nearby across all users
  activeUsers: 0,
};

// ─── Virtual User Class ─────────────────────────────────────
class VirtualUser {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.socket = null;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.nearbyCount = 0;
    this.moveTimer = null;
    this.connected = false;
    this.joinedAt = 0;
    this.cluster = null;

    // Assign to a cluster zone if in cluster mode
    if (CLUSTER_MODE) {
      this.cluster = CLUSTER_ZONES[id % CLUSTER_ZONES.length];
    }

    this._setSpawnPosition();
    this._setNewTarget();
  }

  _setSpawnPosition() {
    if (this.cluster) {
      // Spawn within cluster zone
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * this.cluster.r;
      this.x = this.cluster.cx + Math.cos(angle) * dist;
      this.y = this.cluster.cy + Math.sin(angle) * dist;
    } else {
      // Random spawn
      this.x = Math.random() * WORLD_WIDTH;
      this.y = Math.random() * WORLD_HEIGHT;
    }
  }

  _setNewTarget() {
    if (this.cluster) {
      // Move within cluster zone (sometimes wander out)
      const wanderChance = Math.random();
      if (wanderChance < 0.15) {
        // 15% chance to wander to another cluster or random spot
        const otherCluster = CLUSTER_ZONES[Math.floor(Math.random() * CLUSTER_ZONES.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * otherCluster.r;
        this.targetX = otherCluster.cx + Math.cos(angle) * dist;
        this.targetY = otherCluster.cy + Math.sin(angle) * dist;
      } else {
        // Stay near cluster
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * this.cluster.r;
        this.targetX = this.cluster.cx + Math.cos(angle) * dist;
        this.targetY = this.cluster.cy + Math.sin(angle) * dist;
      }
    } else {
      this.targetX = Math.random() * WORLD_WIDTH;
      this.targetY = Math.random() * WORLD_HEIGHT;
    }
  }

  connect() {
    return new Promise((resolve) => {
      metrics.connectAttempts++;
      const startTime = Date.now();

      this.socket = io(SERVER_URL, {
        transports: ['websocket'],
        forceNew: true,
        timeout: 10000,
        reconnection: false,
      });

      this.socket.on('connect', () => {
        this.connected = true;
        this.joinedAt = Date.now();
        metrics.connected++;
        metrics.activeUsers++;
        metrics.latencies.push(Date.now() - startTime);

        // Join game
        this.socket.emit('player:join', { username: this.username });
        resolve(true);
      });

      this.socket.on('connect_error', (err) => {
        metrics.connectFailed++;
        metrics.errors++;
        resolve(false);
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
        metrics.disconnected++;
        metrics.activeUsers--;
        this._stopMoving();
      });

      // ── Game Events ──
      this.socket.on('players:state', (data) => {
        if (data.self) {
          this.x = data.self.x;
          this.y = data.self.y;
        }
      });

      this.socket.on('proximity:update', (data) => {
        if (data.type === 'entered') {
          metrics.proximityEntered++;
        } else if (data.type === 'exited') {
          metrics.proximityExited++;
        } else if (data.type === 'list') {
          this.nearbyCount = (data.nearby || []).length;
          if (this.nearbyCount > metrics.peakNearby) {
            metrics.peakNearby = this.nearbyCount;
          }

          // Chat when nearby others
          if (this.nearbyCount > 0 && Math.random() < CHAT_CHANCE) {
            this._sendChat();
          }
        }
      });

      this.socket.on('chat:message', () => {
        metrics.chatReceived++;
      });

      this.socket.on('error', () => {
        metrics.errors++;
      });

      // Timeout fallback
      setTimeout(() => {
        if (!this.connected) {
          metrics.connectFailed++;
          resolve(false);
        }
      }, 10000);
    });
  }

  startMoving() {
    this.moveTimer = setInterval(() => {
      if (!this.connected || !this.socket) return;

      // Move toward target
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 10) {
        // Reached target, set new one
        this._setNewTarget();
        return;
      }

      // Move at speed 4 per tick
      const speed = 4;
      this.x += (dx / dist) * speed;
      this.y += (dy / dist) * speed;

      // Clamp to world
      this.x = Math.max(0, Math.min(WORLD_WIDTH, this.x));
      this.y = Math.max(0, Math.min(WORLD_HEIGHT, this.y));

      this.socket.emit('player:move', { x: this.x, y: this.y });
      metrics.movesSent++;
    }, MOVE_INTERVAL_MS);
  }

  _stopMoving() {
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
  }

  _sendChat() {
    if (!this.connected || !this.socket) return;
    const msg = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    this.socket.emit('chat:send', { content: msg });
    metrics.chatSent++;
  }

  disconnect() {
    this._stopMoving();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// ─── Reporter ────────────────────────────────────────────────
function printBanner() {
  console.log('');
  console.log(chalk.hex('#818cf8').bold('  ╔═══════════════════════════════════════════════════╗'));
  console.log(chalk.hex('#818cf8').bold('  ║') + chalk.white.bold('   🚀  Virtual Cosmos — Load Test                 ') + chalk.hex('#818cf8').bold('║'));
  console.log(chalk.hex('#818cf8').bold('  ╚═══════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.gray('  Config:'));
  console.log(chalk.gray(`    Users:      ${chalk.white(TOTAL_USERS)}`));
  console.log(chalk.gray(`    Duration:   ${chalk.white(DURATION_SEC + 's')}`));
  console.log(chalk.gray(`    Ramp-up:    ${chalk.white(RAMP_UP_SEC + 's')}`));
  console.log(chalk.gray(`    Server:     ${chalk.white(SERVER_URL)}`));
  console.log(chalk.gray(`    Cluster:    ${chalk.white(CLUSTER_MODE ? 'YES' : 'NO')}`));
  console.log(chalk.gray(`    Move Rate:  ${chalk.white(MOVE_INTERVAL_MS + 'ms')}`));
  console.log(chalk.gray(`    Chat %:     ${chalk.white(Math.round(CHAT_CHANCE * 100) + '%')}`));
  console.log('');
}

function printProgress(elapsed) {
  const bar = createProgressBar(elapsed / DURATION_SEC, 30);
  const remaining = Math.max(0, DURATION_SEC - elapsed);

  process.stdout.write(
    `\r  ${bar} ${elapsed}s / ${DURATION_SEC}s  |  ` +
    `${chalk.green('●')} ${metrics.activeUsers} active  |  ` +
    `${chalk.cyan('↗')} ${metrics.movesSent} moves  |  ` +
    `${chalk.yellow('⚡')} ${metrics.proximityEntered} prox  |  ` +
    `${chalk.magenta('💬')} ${metrics.chatSent}/${metrics.chatReceived} chat  |  ` +
    `${chalk.red('✖')} ${metrics.errors} err  `
  );
}

function createProgressBar(percent, width) {
  const filled = Math.round(percent * width);
  const empty = width - filled;
  return chalk.hex('#818cf8')('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
}

function printFinalReport() {
  const avgLatency = metrics.latencies.length > 0
    ? Math.round(metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length)
    : 0;
  const maxLatency = metrics.latencies.length > 0 ? Math.max(...metrics.latencies) : 0;
  const minLatency = metrics.latencies.length > 0 ? Math.min(...metrics.latencies) : 0;
  const p95Latency = metrics.latencies.length > 0
    ? metrics.latencies.sort((a, b) => a - b)[Math.floor(metrics.latencies.length * 0.95)]
    : 0;

  console.log('\n');
  console.log(chalk.hex('#818cf8').bold('  ┌─────────────────────────────────────────────────┐'));
  console.log(chalk.hex('#818cf8').bold('  │') + chalk.white.bold('   📊  Load Test Results                          ') + chalk.hex('#818cf8').bold('│'));
  console.log(chalk.hex('#818cf8').bold('  └─────────────────────────────────────────────────┘'));
  console.log('');

  // Connection metrics
  console.log(chalk.cyan.bold('  ── Connections ──'));
  console.log(`    Attempted:       ${chalk.white(metrics.connectAttempts)}`);
  console.log(`    Successful:      ${chalk.green(metrics.connected)}`);
  console.log(`    Failed:          ${chalk.red(metrics.connectFailed)}`);
  console.log(`    Disconnected:    ${chalk.yellow(metrics.disconnected)}`);
  console.log(`    Success Rate:    ${chalk.white(((metrics.connected / metrics.connectAttempts) * 100).toFixed(1) + '%')}`);
  console.log('');

  // Latency metrics
  console.log(chalk.cyan.bold('  ── Connection Latency ──'));
  console.log(`    Min:             ${chalk.green(minLatency + 'ms')}`);
  console.log(`    Avg:             ${chalk.white(avgLatency + 'ms')}`);
  console.log(`    P95:             ${chalk.yellow(p95Latency + 'ms')}`);
  console.log(`    Max:             ${chalk.red(maxLatency + 'ms')}`);
  console.log('');

  // Activity metrics
  console.log(chalk.cyan.bold('  ── Activity ──'));
  console.log(`    Moves Sent:      ${chalk.white(metrics.movesSent.toLocaleString())}`);
  console.log(`    Moves/sec:       ${chalk.white(Math.round(metrics.movesSent / DURATION_SEC).toLocaleString())}`);
  console.log('');

  // Proximity metrics
  console.log(chalk.cyan.bold('  ── Proximity ──'));
  console.log(`    Entered Events:  ${chalk.green(metrics.proximityEntered.toLocaleString())}`);
  console.log(`    Exited Events:   ${chalk.red(metrics.proximityExited.toLocaleString())}`);
  console.log(`    Peak Nearby:     ${chalk.white(metrics.peakNearby)}`);
  console.log('');

  // Chat metrics
  console.log(chalk.cyan.bold('  ── Chat ──'));
  console.log(`    Sent:            ${chalk.white(metrics.chatSent.toLocaleString())}`);
  console.log(`    Received:        ${chalk.white(metrics.chatReceived.toLocaleString())}`);
  console.log(`    Fan-out Ratio:   ${chalk.white(metrics.chatSent > 0 ? (metrics.chatReceived / metrics.chatSent).toFixed(1) + 'x' : 'N/A')}`);
  console.log('');

  // Errors
  console.log(chalk.cyan.bold('  ── Errors ──'));
  console.log(`    Total:           ${metrics.errors > 0 ? chalk.red(metrics.errors) : chalk.green('0')}`);
  console.log('');

  // Verdict
  const successRate = (metrics.connected / metrics.connectAttempts) * 100;
  if (successRate >= 99 && metrics.errors === 0) {
    console.log(chalk.green.bold('  ✅ PASSED — All users connected successfully with no errors'));
  } else if (successRate >= 90) {
    console.log(chalk.yellow.bold(`  ⚠️  WARN — ${successRate.toFixed(1)}% success rate, ${metrics.errors} errors`));
  } else {
    console.log(chalk.red.bold(`  ❌ FAILED — ${successRate.toFixed(1)}% success rate, ${metrics.errors} errors`));
  }
  console.log('');
}

// ─── Main Runner ─────────────────────────────────────────────
async function run() {
  printBanner();

  const users = [];
  const rampDelay = (RAMP_UP_SEC * 1000) / TOTAL_USERS;

  console.log(chalk.gray(`  Ramping up ${TOTAL_USERS} users over ${RAMP_UP_SEC}s...\n`));

  // Ramp up: connect users gradually
  for (let i = 0; i < TOTAL_USERS; i++) {
    const username = `bot_${String(i + 1).padStart(4, '0')}`;
    const user = new VirtualUser(i, username);
    users.push(user);

    const success = await user.connect();
    if (success) {
      user.startMoving();
    }

    // Progress during ramp-up
    if ((i + 1) % 10 === 0 || i === TOTAL_USERS - 1) {
      process.stdout.write(
        `\r  ${chalk.gray('Connecting:')} ${createProgressBar((i + 1) / TOTAL_USERS, 25)} ` +
        `${chalk.white(i + 1)}/${TOTAL_USERS}  ` +
        `(${chalk.green(metrics.connected)} ok, ${chalk.red(metrics.connectFailed)} failed)  `
      );
    }

    // Stagger connections
    if (rampDelay > 0) {
      await sleep(rampDelay);
    }
  }

  console.log('\n');
  console.log(chalk.green(`  ✓ Ramp-up complete. ${metrics.activeUsers} users active.\n`));
  console.log(chalk.gray(`  Running test for ${DURATION_SEC}s...\n`));

  // Run for duration, printing live progress
  const startTime = Date.now();
  const progressTimer = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    printProgress(elapsed);

    if (elapsed >= DURATION_SEC) {
      clearInterval(progressTimer);
    }
  }, 1000);

  // Wait for test duration
  await sleep(DURATION_SEC * 1000);
  clearInterval(progressTimer);

  // Disconnect all
  console.log(chalk.gray('\n\n  Disconnecting all users...'));
  for (const user of users) {
    user.disconnect();
    await sleep(5); // Small delay to avoid thundering herd on disconnect
  }

  await sleep(1000); // Let final events settle

  printFinalReport();
  process.exit(0);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Run ─────────────────────────────────────────────────────
run().catch((err) => {
  console.error(chalk.red('  Fatal error:'), err);
  process.exit(1);
});