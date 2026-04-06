# 🌌 Cosmos

A real-time 2D multiplayer environment where users move and interact based on proximity. Built with production-grade architecture, clean separation of concerns, and scalable design patterns.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/PixiJS-8-E91E63?logo=pixi)
![Tech Stack](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio)
![Tech Stack](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)
![Tech Stack](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

---

## ✨ Features

- **2D Space Navigation** — Move your avatar using WASD or Arrow keys in a vast cosmic world
- **Real-Time Multiplayer** — See all connected users moving in real time via WebSocket
- **Proximity Detection** — Automatic connection when users are within 150px radius
- **Proximity Chat** — Auto-join/leave chat rooms based on spatial distance
- **Smooth Camera** — Camera follows your avatar with smooth interpolation
- **MiniMap** — Bird's-eye view of the entire world with player positions
- **Glass UI** — Premium glassmorphism design with cosmic dark theme

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Client (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Canvas   │  │   UI     │  │  Hooks   │  │  Store  │ │
│  │ (PixiJS)  │  │Components│  │          │  │(Zustand)│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
│       └──────────────┴─────────────┴─────────────┘      │
│                          │                               │
│                 ┌────────┴────────┐                      │
│                 │  Socket Service  │                      │
│                 └────────┬────────┘                      │
└──────────────────────────┼──────────────────────────────┘
                           │ WebSocket
┌──────────────────────────┼──────────────────────────────┐
│                      Server (Node.js)                    │
│                 ┌────────┴────────┐                      │
│                 │ Socket Handlers  │                      │
│                 └────────┬────────┘                      │
│       ┌──────────────────┼──────────────────┐           │
│  ┌────┴─────┐  ┌────────┴──────┐  ┌────────┴────┐      │
│  │  User    │  │  Proximity    │  │    Chat     │      │
│  │ Service  │  │   Service     │  │   Service   │      │
│  └────┬─────┘  └────────┬──────┘  └────────┬────┘      │
│       │        ┌────────┴──────┐           │           │
│       │        │ Spatial Grid  │           │           │
│       │        └───────────────┘           │           │
│  ┌────┴────────────────────────────────────┴────┐      │
│  │                 MongoDB                       │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **SRP** | Each service handles one domain (User, Proximity, Chat) |
| **OCP** | Socket handlers are composable — add new ones without modifying existing |
| **DIP** | Components depend on abstractions (stores, services), not implementations |
| **Separation of Concerns** | Canvas rendering, state, networking, and UI are fully decoupled |

### Frontend Architecture

```
frontend/src/
├── canvas/          # PixiJS rendering layer (isolated from React)
│   └── CosmosCanvas.jsx
├── components/      # React UI components (overlaid on canvas)
│   ├── ChatPanel.jsx
│   ├── HUD.jsx
│   ├── LoginScreen.jsx
│   ├── MiniMap.jsx
│   └── UserList.jsx
├── hooks/           # Custom React hooks (business logic)
│   ├── useChat.js
│   ├── useMovement.js
│   └── useSocket.js
├── services/        # Network communication layer
│   └── socketService.js
├── store/           # Zustand state management
│   ├── useChatStore.js
│   └── useGameStore.js
├── utils/           # Pure helper functions
│   ├── colors.js
│   └── constants.js
├── App.jsx
├── main.jsx
└── index.css        # Design system tokens
```

### Backend Architecture

```
backend/src/
├── config/          # Configuration modules
│   ├── constants.js # Centralized constants
│   ├── db.js        # MongoDB connection
│   └── socket.js    # Socket.IO server factory
├── controllers/     # REST API controllers (thin layer)
│   └── userController.js
├── models/          # MongoDB schemas
│   ├── Message.js
│   └── User.js
├── routes/          # Express routes
│   └── userRoutes.js
├── services/        # Business logic (core domain)
│   ├── ChatService.js
│   ├── ProximityService.js
│   └── UserService.js
├── sockets/         # Socket event handlers (transport layer)
│   ├── chatHandler.js
│   ├── connectionHandler.js
│   ├── movementHandler.js
│   └── index.js
├── utils/           # Data structures & helpers
│   ├── SpatialGrid.js
│   └── helpers.js
└── app.js           # Express app setup
```

---

## 📐 Proximity Algorithm

### Spatial Grid Partitioning

Instead of O(n²) brute-force distance checks, we use **grid-based spatial partitioning**:

1. **Grid Cell Size = Proximity Radius** (150px)
2. Each user is mapped to a grid cell based on position
3. On movement, only check the **3×3 neighborhood** (9 cells)
4. Reduces complexity to **O(n × k)** where k = avg users per neighborhood

```
┌─────┬─────┬─────┬─────┐
│     │     │ ✦   │     │   ✦ = User
│     │     │     │     │
├─────┼─────┼─────┼─────┤   Only check the 9 cells
│     │ ░░░ │ ░░░ │ ░░░ │   around the user (shaded)
│     │ ░✦░ │ ░░░ │ ░░░ │
├─────┼─────┼─────┼─────┤
│     │ ░░░ │ ░✧░ │ ░░░ │   ✧ = Nearby user (checked)
│     │ ░░░ │ ░░░ │ ░░░ │
├─────┼─────┼─────┼─────┤
│     │     │     │     │
└─────┴─────┴─────┴─────┘
```

### Diff-Based Enter/Exit Detection

- Track each user's **previous nearby set**
- On movement, compute **current nearby set**
- **Diff** to find: `entered = current - previous`, `exited = previous - current`
- Only emit proximity events for actual **state transitions**

---

## 🔄 Real-Time Design

### Socket Event Flow

```
Client A                Server                 Client B
   │                       │                       │
   ├─ player:join ────────►│                       │
   │                       ├─ player:joined ──────►│
   │◄─ players:state ─────┤                       │
   │                       │                       │
   ├─ player:move ────────►│ (throttled)           │
   │                       ├─ player:moved ───────►│
   │                       │                       │
   │    (when nearby)      │                       │
   │◄─ proximity:update ──┤── proximity:update ──►│
   │                       │                       │
   ├─ chat:send ──────────►│                       │
   │◄─ chat:message ──────┤── chat:message ──────►│
```

### Throttling Strategy

| Layer | Mechanism | Interval |
|-------|-----------|----------|
| Client | `requestAnimationFrame` + timestamp check | 50ms |
| Server | Timestamp diff per socket | 50ms |

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- MongoDB (optional — works without it)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# backend/.env (already created with defaults)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/virtual-cosmos
CLIENT_URL=http://localhost:5173
PROXIMITY_RADIUS=150
WORLD_WIDTH=3000
WORLD_HEIGHT=2000
```

### 3. Start Development

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 4. Test Multiplayer

Open `http://localhost:5173` in **multiple browser tabs**, enter different usernames, and move avatars toward each other to see proximity detection and chat in action.

---

## 🧪 Edge Cases Handled

| Edge Case | Solution |
|-----------|----------|
| Sudden disconnect | Server cleans up user state, spatial grid, and chat rooms |
| Rapid in/out of radius | Diff-based detection prevents duplicate events |
| Multiple simultaneous connections | Each user has independent proximity tracking |
| Same username, different tab | Session transfer to new socket ID |
| DB unavailable | Graceful fallback to in-memory operation |
| Invalid input | Server-side validation on all socket events |

---

## 📈 Scaling Ideas

### Short-term
- **Redis adapter for Socket.IO** — Scale horizontally across multiple server instances
- **Worker threads** — Move proximity calculations off the main event loop
- **Message queue** — Decouple chat persistence from real-time delivery

### Long-term
- **QuadTree** — Replace grid with adaptive spatial partitioning for non-uniform distribution
- **Interest management** — Only send position updates for players within a broader radius
- **Area-of-Interest (AOI) zones** — Pre-defined regions with dedicated server processes
- **WebRTC for P2P** — Direct player-to-player audio/video when in proximity

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 19 | UI components |
| Canvas Rendering | PixiJS 8 | 2D world rendering |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| State Management | Zustand 5 | Lightweight stores |
| WebSocket Client | Socket.IO Client 4 | Real-time communication |
| Backend Framework | Express 5 | REST API |
| WebSocket Server | Socket.IO 4 | Real-time server |
| Database | MongoDB + Mongoose 8 | User & message persistence |

---

## 📄 License

MIT
