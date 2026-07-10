# Telemetry Ops Console

Industrial telemetry platform for monitoring a fleet of sensors in real time. A **Node.js backend** ingests telemetry through Kafka, stores it in **TimescaleDB**, and pushes live updates over **Socket.IO**. A **Next.js dashboard** shows fleet health, device metrics, and alerts.

```
Simulator → POST /telemetry → Express → Kafka
                                        ├─ Storage worker  → TimescaleDB
                                        └─ Analytics worker → Socket.IO → Dashboard
```

| Service | Port | URL |
|---------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Backend (API + Socket.IO) | 3001 | http://localhost:3001 |
| TimescaleDB | **5433** | `localhost:5433` (host) |
| Kafka | 9092 | `localhost:9092` |

> **Note:** TimescaleDB uses port **5433** on the host (not 5432) to avoid conflicts with a local PostgreSQL install.

---

## Prerequisites

- **Node.js** 20+ (24 recommended)
- **npm**
- **Docker Desktop** (for Kafka, Zookeeper, TimescaleDB)
- **Git** (single repo at project root)

---

## Quick start

Open **four terminals** from the project root (`Assigement/`).

### 1. Install dependencies

```bash
cd backend && npm install
cd ../my-app && npm install
```

### 2. Start infrastructure (Docker)

```bash
cd backend
docker compose up -d
```

Wait until Kafka, Zookeeper, and TimescaleDB are running:

```bash
docker compose ps
```

### 3. Initialize the database (first time only)

From `backend/`:

```bash
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/schema.sql
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/seed.sql
```

This creates tables and seeds **5 devices** (Motor-1, Motor-2, Pump-1, Pump-2, Cooling-Unit-1).

### 4. Configure environment files

**Frontend** — create `my-app/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Backend** — optional. Defaults work for local development. To override, create `backend/.env`:

```env
# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000

# TimescaleDB (defaults match docker-compose on port 5433)
DB_HOST=localhost
DB_PORT=5433
DB_NAME=telemetry
DB_USER=telemetry
DB_PASSWORD=telemetry123

# Or use a single connection string instead:
# DATABASE_URL=postgresql://telemetry:telemetry123@localhost:5433/telemetry

# Kafka
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=telemetry-backend

# Socket.IO
SOCKET_CORS_ORIGIN=*

# Simulator (optional — where fake sensors POST data)
TELEMETRY_API_URL=http://localhost:3001/telemetry
```

### 5. Start the backend

```bash
cd backend
npm run dev
```

You should see:

- `API listening on http://localhost:3001`
- `Kafka Producer Connected`
- `Storage Consumer Started`
- `Analytics Consumer Started`

Verify: http://localhost:3001/health → `{"status":"ok"}`

### 6. Start the simulator (live data)

```bash
cd backend
npm run simulator
```

Sends telemetry every **2 seconds** for all 5 devices, with occasional anomalies.

### 7. Start the frontend

```bash
cd my-app
npm run dev
```

Open **http://localhost:3000** — the dashboard should load fleet data and update live when the simulator is running.

---

## Environment variables reference

### Frontend (`my-app/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | — | Backend REST API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | Yes | — | Socket.IO server URL (same host as API) |

Both must be set for the dashboard to load data and connect WebSockets. Restart `npm run dev` after changing `.env.local`.

### Backend (`backend/.env` — all optional locally)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP + Socket.IO port |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin for REST API |
| `DB_HOST` | `localhost` | TimescaleDB host |
| `DB_PORT` | `5433` | TimescaleDB host port |
| `DB_NAME` | `telemetry` | Database name |
| `DB_USER` | `telemetry` | Database user |
| `DB_PASSWORD` | `telemetry123` | Database password |
| `DATABASE_URL` | *(built from above)* | Full Postgres connection string (overrides individual DB_* vars) |
| `KAFKA_BROKER` | `localhost:9092` | Kafka broker address |
| `KAFKA_CLIENT_ID` | `telemetry-backend` | Kafka client id |
| `SOCKET_CORS_ORIGIN` | `*` | Socket.IO CORS origin |
| `TELEMETRY_API_URL` | `http://localhost:3001/telemetry` | Simulator ingest endpoint |

---

## Project layout

| Path | Stack | Purpose |
|------|-------|---------|
| `backend/` | Express, Kafka, Socket.IO, pg | API, consumers, simulator |
| `my-app/` | Next.js 16, React Query, Socket.IO client | Dashboard UI |
| `backend/docker-compose.yml` | Docker | Kafka, Zookeeper, TimescaleDB |
| `backend/src/db/` | SQL | Schema + seed data |
| `backend/src/simulator/` | Node | Fake sensor data generator |

### npm scripts

**Backend** (`backend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Build TypeScript + start API server |
| `npm run start` | Start compiled server (no rebuild) |
| `npm run simulator` | Run sensor simulator |
| `npm run build` | Compile TypeScript to `dist/` |

**Frontend** (`my-app/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Start production server |

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/system/status` | Kafka, DB, and Socket server status |
| `GET` | `/fleet` | All devices + fleet summary |
| `GET` | `/devices` | Device list |
| `GET` | `/devices/:id` | Single device (slug, e.g. `motor-1`) |
| `GET` | `/devices/:id/history?limit=100` | Telemetry history for charts |
| `GET` | `/alerts` | Alerts (`?deviceId=` optional) |
| `POST` | `/telemetry` | Ingest telemetry batch (simulator) |

## Socket events (server → client)

| Event | Description |
|-------|-------------|
| `telemetry:update` | Live sensor reading for one device |
| `fleet:update` | Updated fleet summary counts |
| `alert:new` | New alert (listener ready; generation not yet implemented) |

---

## Troubleshooting

### `EADDRINUSE` on port 3001

Another process is using the port. Free it:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <pid> /F
```

### Dashboard: "Unable to load fleet data"

1. Backend running? → `curl http://localhost:3001/health`
2. Database running? → `docker compose ps`
3. Schema applied? → Re-run `schema.sql` and `seed.sql`
4. `my-app/.env.local` set? → Restart frontend after adding it
5. Wrong DB port? → Use **5433**, not 5432

### `password authentication failed for user "telemetry"`

Local PostgreSQL on port 5432 is intercepting connections. This project uses **5433** for TimescaleDB in Docker. Do not set `DB_PORT=5432` unless you changed `docker-compose.yml`.

### Infrastructure sidebar shows red

- **API Server** — backend not reachable
- **Kafka** — `docker compose up -d` not running or Kafka not ready
- **TimescaleDB** — container down or schema not applied
- **WebSocket** — backend running but client disconnected (check header status)

### Active Alerts empty

Expected for now. The alerts table exists and `GET /alerts` works, but the analytics pipeline does not yet create alerts from anomalies.

### Recent Events show mock data

The events panel still uses local mock data. There is no `GET /events` API yet.

---

## Git (single repo)

One repository at the project root covers both `backend/` and `my-app/`.

```bash
cd Assigement
git status
git add .
git commit -m "your message"
```

Do **not** run `git init` inside `my-app/` or `backend/`.

### Ignored files (not committed)

| Category | Examples |
|----------|----------|
| Agent / IDE | `.agents/`, `AGENTS.md`, `CLAUDE.md`, `DESIGN.md` |
| Secrets | `.env`, `.env.local` |
| Build output | `node_modules/`, `dist/`, `.next/` |

See `.gitignore` at the repo root and in `my-app/` and `backend/`.

---

## License

ISC (backend). Frontend is private (`my-app`).
