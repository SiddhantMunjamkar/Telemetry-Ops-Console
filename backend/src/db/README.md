# Database Schema (TimescaleDB)

Industrial telemetry platform schema for device metadata, time-series readings, computed health, and alerts.

## Design overview

```
devices          → static metadata (name, type, location)
device_health    → latest computed state (health_score, last metrics)
telemetry        → historical time-series (hypertable)
alerts           → significant events over time
```

| Table | Responsibility | Write pattern |
|-------|----------------|---------------|
| `devices` | Device registry | Rare inserts/updates |
| `telemetry` | Raw sensor readings | High-volume append |
| `device_health` | Current health snapshot | Frequent upsert per device |
| `alerts` | Alert history | Append on anomaly detection |

`health_score` lives in `device_health`, not `devices`, so static metadata stays separate from computed state.

## Prerequisites

Start TimescaleDB from the backend root:

```bash
cd backend
docker compose up -d timescaledb
```

Connection details (from `docker-compose.yml`):

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `5432` |
| Database | `telemetry` |
| User | `telemetry` |
| Password | `telemetry123` |

Connection string:

```text
postgresql://telemetry:telemetry123@localhost:5432/telemetry
```

## 1. Enable TimescaleDB extension

The extension is created automatically when you run `schema.sql`:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

To enable manually:

```bash
docker exec -it timescaledb psql -U telemetry -d telemetry -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
```

Verify:

```sql
SELECT extname, extversion FROM pg_extension WHERE extname = 'timescaledb';
```

## 2. Apply schema

From the host (Git Bash / WSL / macOS):

```bash
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/schema.sql
```

From inside the container:

```bash
docker exec -it timescaledb psql -U telemetry -d telemetry
\i /path/to/schema.sql
```

Or with `psql` locally:

```bash
psql "postgresql://telemetry:telemetry123@localhost:5432/telemetry" -f src/db/schema.sql
```

## 3. Load seed data

```bash
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/seed.sql
```

Seeded devices:

| Name | Type | UUID |
|------|------|------|
| Motor-1 | Motor | `11111111-1111-4111-8111-111111111101` |
| Motor-2 | Motor | `11111111-1111-4111-8111-111111111102` |
| Pump-1 | Pump | `22222222-2222-4222-8222-222222222201` |
| Pump-2 | Pump | `22222222-2222-4222-8222-222222222202` |
| Cooling-Unit-1 | Cooling Unit | `33333333-3333-4333-8333-333333333301` |

## 4. Verify hypertable

```sql
SELECT hypertable_schema, hypertable_name
FROM timescaledb_information.hypertables
WHERE hypertable_name = 'telemetry';
```

Expected: one row with `telemetry`.

**Note:** `telemetry` uses a composite primary key `(id, recorded_at)` because TimescaleDB requires the partition column to be part of any primary key on a hypertable.

Check chunks and partitioning:

```sql
SELECT chunk_name, range_start, range_end
FROM timescaledb_information.chunks
WHERE hypertable_name = 'telemetry'
ORDER BY range_start DESC
LIMIT 5;
```

## Useful inspection queries

**List all tables:**

```sql
\dt
```

**Device fleet with latest health:**

```sql
SELECT
  d.id,
  d.name,
  d.type,
  d.location,
  h.health_score,
  h.status,
  h.last_temperature,
  h.last_pressure,
  h.last_power,
  h.last_vibration,
  h.last_seen
FROM devices d
LEFT JOIN device_health h ON h.device_id = d.id
ORDER BY d.name;
```

**Recent telemetry for a device:**

```sql
SELECT device_id, temperature, pressure, power, vibration, recorded_at
FROM telemetry
WHERE device_id = '11111111-1111-4111-8111-111111111101'
ORDER BY recorded_at DESC
LIMIT 20;
```

**Active alerts:**

```sql
SELECT a.id, d.name, a.severity, a.type, a.message, a.status, a.created_at
FROM alerts a
JOIN devices d ON d.id = a.device_id
WHERE a.status = 'active'
ORDER BY a.created_at DESC;
```

**Fleet summary (dashboard-style):**

```sql
SELECT
  COUNT(*) AS total_devices,
  COUNT(*) FILTER (WHERE status = 'healthy')  AS healthy,
  COUNT(*) FILTER (WHERE status = 'warning')  AS warning,
  COUNT(*) FILTER (WHERE status = 'critical') AS critical,
  COUNT(*) FILTER (WHERE status = 'offline')  AS offline
FROM device_health;
```

**Telemetry volume (last hour):**

```sql
SELECT COUNT(*) AS readings_last_hour
FROM telemetry
WHERE recorded_at >= NOW() - INTERVAL '1 hour';
```

## Reset database (development only)

```bash
docker compose down -v
docker compose up -d timescaledb
# wait a few seconds for Postgres to start, then re-apply schema + seed
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/schema.sql
docker exec -i timescaledb psql -U telemetry -d telemetry < src/db/seed.sql
```

## File layout

```text
backend/src/db/
├── schema.sql   # tables, constraints, indexes, hypertable
├── seed.sql     # five simulator devices + initial device_health rows
├── queries.ts   # application query helpers (updated in later phases)
└── README.md    # this file
```
