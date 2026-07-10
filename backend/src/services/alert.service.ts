import { getPool } from "../config/db";
import { listAlerts, toDeviceSlug, getDeviceUuidBySlug } from "../db/queries";

export type ApiAlert = {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  deviceId: string;
  deviceName: string;
  title: string;
  description: string;
  timestamp: string;
  status: "open" | "acknowledged" | "resolved";
};

const severityMap: Record<string, ApiAlert["severity"]> = {
  info: "low",
  warning: "medium",
  critical: "critical",
};

const statusMap: Record<string, ApiAlert["status"]> = {
  active: "open",
  acknowledged: "acknowledged",
  resolved: "resolved",
};

function mapAlert(row: Awaited<ReturnType<typeof listAlerts>>[number]): ApiAlert {
  return {
    id: row.id,
    severity: severityMap[row.severity] ?? "medium",
    deviceId: toDeviceSlug(row.device_name),
    deviceName: row.device_name,
    title: row.type,
    description: row.message,
    timestamp: row.created_at.toISOString(),
    status: statusMap[row.status] ?? "open",
  };
}

export async function getAlerts(deviceSlug?: string): Promise<ApiAlert[]> {
  const pool = getPool();
  const deviceUuid = deviceSlug ? await getDeviceUuidBySlug(pool, deviceSlug) : undefined;

  if (deviceSlug && !deviceUuid) {
    return [];
  }

  const alerts = await listAlerts(pool, deviceUuid ?? undefined);
  return alerts.map(mapAlert);
}
