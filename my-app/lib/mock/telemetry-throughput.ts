export function hashSeed(input: string): number {
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

export function generateSparkline(seed: string, points = 14): number[] {
  const numericSeed = hashSeed(seed);
  const values: number[] = [];
  let value = 40 + pseudoRandom(numericSeed, 0) * 30;

  for (let index = 0; index < points; index += 1) {
    const noise = (pseudoRandom(numericSeed, index + 1) - 0.5) * 12;
    value = Math.max(8, Math.min(100, value + noise));
    values.push(Math.round(value * 10) / 10);
  }

  return values;
}

export type TelemetryPoint = {
  time: string;
  value: number;
};

export function generateTelemetrySeries(points = 12): TelemetryPoint[] {
  const now = Date.now();
  const intervalMs = 5 * 60 * 1000;
  const values = generateSparkline("telemetry-throughput", points);
  const scale = 85;

  return values.map((point, index) => {
    const timestamp = new Date(now - (points - 1 - index) * intervalMs);
    return {
      time: timestamp.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Math.round(point * scale),
    };
  });
}

export const MOCK_TELEMETRY_RATE = 8524;
