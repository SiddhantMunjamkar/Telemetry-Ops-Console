import type { DeviceTelemetryPoint } from "@/types/device-telemetry";
import type { FleetAlert } from "@/types/alerts";

export type DeviceTimeRange = "1h" | "6h" | "12h";

const RANGE_POINTS: Record<DeviceTimeRange, number> = {
  "1h": 4,
  "6h": 24,
  "12h": 48,
};

export function sliceTelemetryByRange(
  points: DeviceTelemetryPoint[],
  range: DeviceTimeRange,
): DeviceTelemetryPoint[] {
  const count = RANGE_POINTS[range];
  return points.slice(-count);
}

export function computeMetricTrend(series: number[]): {
  pct: number;
  direction: "up" | "down";
} {
  if (series.length < 2) {
    return { pct: 0, direction: "up" };
  }

  const current = series[series.length - 1] ?? 0;
  const previous = series[Math.max(0, series.length - 5)] ?? current;

  if (previous === 0) {
    return { pct: 0, direction: "up" };
  }

  const delta = ((current - previous) / previous) * 100;
  return {
    pct: Math.abs(delta),
    direction: delta >= 0 ? "up" : "down",
  };
}

export function getPrimaryDeviceAlert(
  alerts: FleetAlert[],
  deviceId: string,
): FleetAlert | undefined {
  const deviceAlerts = alerts
    .filter(
      (alert) =>
        alert.deviceId === deviceId &&
        (alert.status === "open" || alert.status === "acknowledged"),
    )
    .sort((a, b) => {
      const severityRank = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityRank[a.severity] - severityRank[b.severity];
    });

  return deviceAlerts[0];
}

export function formatAlertDuration(startIso: string): string {
  const diffMs = Math.max(0, Date.now() - new Date(startIso).getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function formatClockTime(date = new Date()): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}
