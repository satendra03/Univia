# Univia

A real-time 2D multiplayer proximity social platform where users connect through spatial closeness — not profiles. Move your avatar, walk near others, and conversations begin automatically. Built with production-grade architecture, clean separation of concerns, and scalable design patterns.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![PixiJS](https://img.shields.io/badge/PixiJS-8-E91E63?logo=pixi)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter)
![Lucide](https://img.shields.io/badge/Lucide_React-Icons-F56565)

---

## Features

- **2D Space Navigation** — Move your avatar using WASD or Arrow keys in a vast 3000×2000 cosmic world
- **Real-Time Multiplayer** — See all connected users moving in real time via WebSocket with sub-50ms latency
- **Proximity Detection** — Automatic connection when users are within 150px radius
- **Spatial Chat** — Group-based proximity chat with typing indicators and persistent session history
- **Emoji Reactions** — Floating emoji animations visible to all nearby players
- **Live Mini-Map** — Bird's-eye view of the entire world with real-time player positions
- **Dynamic Avatars** — Unique HSL-generated colors, pulsing glow effects, and smooth position interpolation
- **Connection Lines** — Animated cyan lines connecting nearby avatars with midpoint indicators
- **Premium UI** — Dark sci-fi aesthetic with glassmorphism, Lucide icons, and micro-animations
- **Multi-Page App** — Landing, Features, About, Docs, Privacy, and Terms pages via React Router

---

## Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `LandingPage` | Animated star field, features grid, how-it-works steps, CTA |
| `/login` | `LoginScreen` | Username entry with cosmic theme |
| `/game` | `GameWorld` | PixiJS canvas + HUD + Chat + MiniMap |
| `/features` | `FeaturesPage` | Detailed feature cards with bento grid layout |
| `/about` | `AboutPage` | Mission, values, development timeline, tech stack |
| `/docs` | `DocsPage` | Getting started guide, controls, chat docs, architecture |
| `/privacy` | `PrivacyPage` | Privacy policy |
| `/terms` | `TermsPage` | Terms of service |

---

## Real-Time Design

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


## Setup

### Prerequisites

- Node.js 18+

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

Requires two separate `.env` files — one for the backend, and one for the frontend.

**Backend Configuration:**
Create `backend/.env`:
```bash
PORT=
CLIENT_URL=
PROXIMITY_RADIUS=150
WORLD_WIDTH=3000
WORLD_HEIGHT=2000
```

**Frontend Configuration:**
Create `frontend/.env`:
```bash
VITE_SERVER_URL=
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


## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | React 19 | UI components & routing |
| Canvas Rendering | PixiJS 8 | Hardware-accelerated 2D world rendering |
| Routing | React Router 7 | Client-side page navigation |
| Icons | Lucide React | Consistent SVG line icons |
| State Management | Zustand 5 | Lightweight stores |
| WebSocket Client | Socket.IO Client 4 | Real-time communication |
| Build Tool | Vite 6 | Next-gen frontend bundler |
| Backend Framework | Express 5 | REST API |
| WebSocket Server | Socket.IO 4 | Real-time server |

---

## License

This project is licensed under the [MIT License](LICENSE).

