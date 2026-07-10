import type { Device } from "@/types/fleet";
import type { DeviceTelemetryHistory, DeviceTelemetryPoint } from "@/types/device-telemetry";

const POINT_COUNT = 48;
const INTERVAL_MS = 15 * 60 * 1000;

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(seed: number, index: number): number {
  const value = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function generateMetricSeries(
  seed: number,
  current: number,
  volatility: number,
  decimals: number,
  isOffline: boolean,
): number[] {
  if (isOffline) {
    return Array.from({ length: POINT_COUNT }, () => 0);
  }

  const values: number[] = [];
  let value = current * (0.92 + pseudoRandom(seed, 0) * 0.08);

  for (let index = POINT_COUNT - 1; index >= 0; index -= 1) {
    const noise = (pseudoRandom(seed, index + 1) - 0.5) * volatility;
    const drift = (current - value) * 0.08;
    value = Math.max(0, value + noise + drift);
    values.unshift(round(value, decimals));
  }

  values[values.length - 1] = round(current, decimals);
  return values;
}

export function getDeviceTelemetryHistory(device: Device): DeviceTelemetryHistory {
  const seed = hashSeed(device.id);
  const isOffline = device.status === "offline";
  const now = new Date(device.lastUpdated).getTime();

  const temperatureSeries = generateMetricSeries(
    seed,
    device.temperature,
    2.5,
    1,
    isOffline,
  );
  const pressureSeries = generateMetricSeries(
    seed + 1,
    device.pressure,
    8,
    1,
    isOffline,
  );
  const powerSeries = generateMetricSeries(
    seed + 2,
    device.power,
    1.5,
    1,
    isOffline,
  );
  const vibrationSeries = generateMetricSeries(
    seed + 3,
    device.vibration,
    0.35,
    2,
    isOffline,
  );

  const points: DeviceTelemetryPoint[] = Array.from(
    { length: POINT_COUNT },
    (_, index) => ({
      timestamp: new Date(
        now - (POINT_COUNT - 1 - index) * INTERVAL_MS,
      ).toISOString(),
      temperature: temperatureSeries[index],
      pressure: pressureSeries[index],
      power: powerSeries[index],
      vibration: vibrationSeries[index],
    }),
  );

  return {
    deviceId: device.id,
    points,
  };
}
