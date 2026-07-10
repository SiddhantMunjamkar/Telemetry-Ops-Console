import type { Device } from "@/types/fleet";
import type { DeviceMetricKey, DeviceTelemetryPoint } from "@/types/device-telemetry";
import { getDeviceTelemetryHistory } from "@/lib/mock/device-telemetry";
import { METRIC_CHART_ORDER } from "@/lib/constants/metric-charts";

export type FleetMetricSnapshot = {
  temperature: number;
  pressure: number;
  power: number;
  vibration: number;
  avgHealth: number;
  onlineDevices: number;
};

export function getFleetMetricSnapshot(devices: Device[]): FleetMetricSnapshot {
  const online = devices.filter((device) => device.status !== "offline");

  if (online.length === 0) {
    return {
      temperature: 0,
      pressure: 0,
      power: 0,
      vibration: 0,
      avgHealth: 0,
      onlineDevices: 0,
    };
  }

  const sum = online.reduce(
    (acc, device) => ({
      temperature: acc.temperature + device.temperature,
      pressure: acc.pressure + device.pressure,
      power: acc.power + device.power,
      vibration: acc.vibration + device.vibration,
      health: acc.health + device.healthScore,
    }),
    { temperature: 0, pressure: 0, power: 0, vibration: 0, health: 0 },
  );

  const count = online.length;

  return {
    temperature: round(sum.temperature / count, 1),
    pressure: round(sum.pressure / count, 1),
    power: round(sum.power / count, 1),
    vibration: round(sum.vibration / count, 2),
    avgHealth: Math.round(sum.health / count),
    onlineDevices: count,
  };
}

export function getFleetAggregatedHistory(
  devices: Device[],
): DeviceTelemetryPoint[] {
  const histories = devices
    .filter((device) => device.status !== "offline")
    .map((device) => getDeviceTelemetryHistory(device).points);

  if (histories.length === 0) return [];

  const pointCount = histories[0].length;

  return Array.from({ length: pointCount }, (_, index) => {
    const metrics = METRIC_CHART_ORDER.reduce(
      (acc, key) => {
        const total = histories.reduce(
          (sum, series) => sum + (series[index]?.[key] ?? 0),
          0,
        );
        acc[key] = round(total / histories.length, key === "vibration" ? 2 : 1);
        return acc;
      },
      {} as Record<DeviceMetricKey, number>,
    );

    return {
      timestamp: histories[0][index].timestamp,
      ...metrics,
    };
  });
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
