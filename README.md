# Telemetry-Ops-Console

Industrial telemetry platform with a Node.js backend and Next.js dashboard.

## Project layout

| Folder | Description |
|--------|-------------|
| `backend/` | Express API, Kafka consumers, Socket.IO, TimescaleDB |
| `my-app/` | Next.js dashboard (fleet, devices, alerts, events) |

## Run locally

```bash
# 1. Docker (Kafka + TimescaleDB on port 5433)
cd backend && docker compose up -d

# 2. Backend API (port 3001)
cd backend && npm run dev

# 3. Sensor simulator (optional)
cd backend && npm run simulator

# 4. Frontend (port 3000)
cd my-app && npm run dev
```

## Git (single repo)

This project uses **one git repository** at the root (`Assigement/`) for both `backend/` and `my-app/`.

```bash
# From project root — all git commands run here
cd Assigement
git status
git add .
git commit -m "your message"
```

Do **not** run `git init` inside `my-app/` or `backend/` — only the root repo should exist.

## `.gitignore` — what stays out of git

These files are **local-only** and should not be committed:

### Agent & IDE tooling
| Path | Why ignored |
|------|-------------|
| `.agents/` | Cursor/agent skill bundles (large, machine-local) |
| `.agent/` | Agent config cache |
| `.cursor/` | Cursor IDE local settings |
| `AGENTS.md` | AI agent instructions for this machine |
| `CLAUDE.md` | Claude/Cursor project notes |
| `DESIGN.md` | Local design scratchpad / specs |
| `skills-lock.json` | Agent skills lockfile |
| `Untitled` | Stray untitled scratch files |

### Secrets & environment
| Path | Why ignored |
|------|-------------|
| `.env`, `.env.local`, `.env.*` | API URLs, DB passwords, keys |

### Build & dependencies
| Path | Why ignored |
|------|-------------|
| `node_modules/` | npm packages |
| `dist/` | Compiled backend output |
| `.next/`, `out/`, `build/` | Next.js build artifacts |
| `src/**/*.js` (backend) | Accidental tsc output in `src/` |

`.gitignore` files live at the **repo root**, plus in `my-app/` and `backend/` for package-specific rules.
