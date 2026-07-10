import type { DeviceMetricKey } from "@/types/device-telemetry";
import { getFleetData } from "@/lib/mock/fleet";
import { getFleetAggregatedHistory } from "@/lib/mock/fleet-metrics";

export type TelemetryMetric = Extract<DeviceMetricKey, "temperature" | "pressure" | "power">;

export type TimeRange = "1h" | "6h" | "12h" | "24h";

const RANGE_POINTS: Record<TimeRange, number> = {
  "1h": 12,
  "6h": 24,
  "12h": 36,
  "24h": 48,
};

export type LiveMetricPoint = {
  time: string;
  value: number;
};

export function getLiveMetricSeries(
  metric: TelemetryMetric,
  range: TimeRange,
): LiveMetricPoint[] {
  const { devices } = getFleetData();
  const history = getFleetAggregatedHistory(devices);
  const points = RANGE_POINTS[range];
  const slice = history.slice(-points);

  return slice.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: point[metric],
  }));
}

export const TELEMETRY_METRICS: {
  key: TelemetryMetric;
  label: string;
  unit: string;
  color: string;
}[] = [
  { key: "temperature", label: "Temperature", unit: "°C", color: "#f59e0b" },
  { key: "pressure", label: "Pressure", unit: "psi", color: "#3b82f6" },
  { key: "power", label: "Power", unit: "kW", color: "#8b5cf6" },
];

export const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "1h", label: "1H" },
  { key: "6h", label: "6H" },
  { key: "12h", label: "12H" },
  { key: "24h", label: "24H" },
];
