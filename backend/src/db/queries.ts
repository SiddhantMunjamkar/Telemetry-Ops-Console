import type { Pool } from "pg";

export type DeviceRow = {
  id: string;
  name: string;
  type: string;
  location: string | null;
  status: string;
  health_score: number;
  temperature: number | null;
  pressure: number | null;
  power: number | null;
  vibration: number | null;
  last_seen: Date | null;
};

export type TelemetryHistoryRow = {
  temperature: number | null;
  pressure: number | null;
  power: number | null;
  vibration: number | null;
  recorded_at: Date;
};

export type AlertRow = {
  id: string;
  severity: string;
  device_id: string;
  device_name: string;
  type: string;
  message: string;
  status: string;
  created_at: Date;
};

export type FleetSummaryRow = {
  total_devices: number;
  healthy: number;
  warning: number;
  critical: number;
  offline: number;
};

export function toDeviceSlug(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

export async function listDevicesWithHealth(pool: Pool): Promise<DeviceRow[]> {
  const result = await pool.query<DeviceRow>(
    `SELECT
       d.id::text,
       d.name,
       d.type,
       d.location,
       COALESCE(h.status, d.status) AS status,
       COALESCE(h.health_score, 100) AS health_score,
       h.last_temperature AS temperature,
       h.last_pressure AS pressure,
       h.last_power AS power,
       h.last_vibration AS vibration,
       h.last_seen
     FROM devices d
     LEFT JOIN device_health h ON h.device_id = d.id
     ORDER BY d.name ASC`,
  );

  return result.rows;
}

export async function getDeviceWithHealthBySlug(
  pool: Pool,
  slug: string,
): Promise<DeviceRow | null> {
  const result = await pool.query<DeviceRow>(
    `SELECT
       d.id::text,
       d.name,
       d.type,
       d.location,
       COALESCE(h.status, d.status) AS status,
       COALESCE(h.health_score, 100) AS health_score,
       h.last_temperature AS temperature,
       h.last_pressure AS pressure,
       h.last_power AS power,
       h.last_vibration AS vibration,
       h.last_seen
     FROM devices d
     LEFT JOIN device_health h ON h.device_id = d.id
     WHERE LOWER(REPLACE(d.name, ' ', '-')) = LOWER($1)
        OR d.id::text = $1
     LIMIT 1`,
    [slug],
  );

  return result.rows[0] ?? null;
}

export async function getFleetSummary(pool: Pool): Promise<FleetSummaryRow> {
  const result = await pool.query<FleetSummaryRow>(
    `SELECT
       COUNT(*)::int AS total_devices,
       COUNT(*) FILTER (WHERE status = 'healthy')::int AS healthy,
       COUNT(*) FILTER (WHERE status = 'warning')::int AS warning,
       COUNT(*) FILTER (WHERE status = 'critical')::int AS critical,
       COUNT(*) FILTER (WHERE status = 'offline')::int AS offline
     FROM device_health`,
  );

  return (
    result.rows[0] ?? {
      total_devices: 0,
      healthy: 0,
      warning: 0,
      critical: 0,
      offline: 0,
    }
  );
}

export async function getTelemetryHistory(
  pool: Pool,
  deviceUuid: string,
  limit = 100,
): Promise<TelemetryHistoryRow[]> {
  const result = await pool.query<TelemetryHistoryRow>(
    `SELECT temperature, pressure, power, vibration, recorded_at
     FROM telemetry
     WHERE device_id = $1::uuid
     ORDER BY recorded_at DESC
     LIMIT $2`,
    [deviceUuid, limit],
  );

  return result.rows.reverse();
}

export async function listAlerts(pool: Pool, deviceUuid?: string): Promise<AlertRow[]> {
  const result = deviceUuid
    ? await pool.query<AlertRow>(
        `SELECT
           a.id::text,
           a.severity,
           a.device_id::text,
           d.name AS device_name,
           a.type,
           a.message,
           a.status,
           a.created_at
         FROM alerts a
         JOIN devices d ON d.id = a.device_id
         WHERE a.device_id = $1::uuid
         ORDER BY a.created_at DESC`,
        [deviceUuid],
      )
    : await pool.query<AlertRow>(
        `SELECT
           a.id::text,
           a.severity,
           a.device_id::text,
           d.name AS device_name,
           a.type,
           a.message,
           a.status,
           a.created_at
         FROM alerts a
         JOIN devices d ON d.id = a.device_id
         ORDER BY a.created_at DESC`,
      );

  return result.rows;
}

export async function insertTelemetryPoint(
  pool: Pool,
  input: {
    deviceUuid: string;
    temperature: number;
    pressure: number | null;
    power: number;
    vibration: number;
    recordedAt: Date;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO telemetry (device_id, temperature, pressure, power, vibration, recorded_at)
     VALUES ($1::uuid, $2, $3, $4, $5, $6)`,
    [
      input.deviceUuid,
      input.temperature,
      input.pressure,
      input.power,
      input.vibration,
      input.recordedAt,
    ],
  );
}

export async function upsertDeviceHealthFromTelemetry(
  pool: Pool,
  input: {
    deviceUuid: string;
    temperature: number;
    pressure: number | null;
    power: number;
    vibration: number;
    recordedAt: Date;
  },
): Promise<void> {
  await pool.query(
    `INSERT INTO device_health (
       device_id, health_score, status,
       last_temperature, last_pressure, last_power, last_vibration,
       last_seen, updated_at
     )
     VALUES ($1::uuid, 100, 'healthy', $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (device_id) DO UPDATE SET
       last_temperature = EXCLUDED.last_temperature,
       last_pressure = EXCLUDED.last_pressure,
       last_power = EXCLUDED.last_power,
       last_vibration = EXCLUDED.last_vibration,
       last_seen = EXCLUDED.last_seen,
       updated_at = NOW()`,
    [
      input.deviceUuid,
      input.temperature,
      input.pressure,
      input.power,
      input.vibration,
      input.recordedAt,
    ],
  );
}

export async function getDeviceUuidBySlug(
  pool: Pool,
  slug: string,
): Promise<string | null> {
  const result = await pool.query<{ id: string }>(
    `SELECT d.id::text
     FROM devices d
     WHERE LOWER(REPLACE(d.name, ' ', '-')) = LOWER($1)
        OR d.id::text = $1
     LIMIT 1`,
    [slug],
  );

  return result.rows[0]?.id ?? null;
}
