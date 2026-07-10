import { getPool } from "../config/db";
import {
  getDeviceWithHealthBySlug,
  getFleetSummary,
  getTelemetryHistory,
  listDevicesWithHealth,
  toDeviceSlug,
  type DeviceRow,
} from "../db/queries";
import type { FleetSummary } from "../types/fleet";

export type ApiDevice = {
  id: string;
  name: string;
  type: string;
  status: string;
  healthScore: number;
  temperature: number;
  pressure: number;
  power: number;
  vibration: number;
  lastUpdated: string;
  location?: string | null;
};

export type ApiTelemetryPoint = {
  timestamp: string;
  temperature: number;
  pressure: number;
  power: number;
  vibration: number;
};

function mapDevice(row: DeviceRow): ApiDevice {
  return {
    id: toDeviceSlug(row.name),
    name: row.name,
    type: row.type,
    status: row.status,
    healthScore: row.health_score,
    temperature: row.temperature ?? 0,
    pressure: row.pressure ?? 0,
    power: row.power ?? 0,
    vibration: row.vibration ?? 0,
    lastUpdated: (row.last_seen ?? new Date()).toISOString(),
    location: row.location,
  };
}

function mapSummary(row: Awaited<ReturnType<typeof getFleetSummary>>): FleetSummary {
  return {
    totalDevices: row.total_devices,
    healthy: row.healthy,
    warning: row.warning,
    critical: row.critical,
    offline: row.offline,
  };
}

export async function getFleet(): Promise<{ devices: ApiDevice[]; summary: FleetSummary }> {
  const pool = getPool();
  const [devices, summary] = await Promise.all([
    listDevicesWithHealth(pool),
    getFleetSummary(pool),
  ]);

  return {
    devices: devices.map(mapDevice),
    summary: mapSummary(summary),
  };
}

export async function listDevices(): Promise<ApiDevice[]> {
  const pool = getPool();
  const devices = await listDevicesWithHealth(pool);
  return devices.map(mapDevice);
}

export async function getDevice(slug: string): Promise<ApiDevice | null> {
  const pool = getPool();
  const device = await getDeviceWithHealthBySlug(pool, slug);
  return device ? mapDevice(device) : null;
}

export async function getDeviceHistory(
  slug: string,
  limit = 100,
): Promise<{ deviceId: string; points: ApiTelemetryPoint[] } | null> {
  const pool = getPool();
  const device = await getDeviceWithHealthBySlug(pool, slug);

  if (!device) {
    return null;
  }

  const rows = await getTelemetryHistory(pool, device.id, limit);

  return {
    deviceId: toDeviceSlug(device.name),
    points: rows.map((row) => ({
      timestamp: row.recorded_at.toISOString(),
      temperature: row.temperature ?? 0,
      pressure: row.pressure ?? 0,
      power: row.power ?? 0,
      vibration: row.vibration ?? 0,
    })),
  };
}
