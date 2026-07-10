export type DeviceType = "motor" | "pump" | "cooling";

export type AnomalyType =
  | "overheating"
  | "pressure_loss"
  | "bearing_failure"
  | "sensor_offline"
  | "duplicate_reading"
  | "noise_spike";

export type TelemetryReading = {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  temperature: number;
  pressure: number | null;
  vibration: number;
  power: number;
  timestamp: string;
};

export type MetricBaseline = {
  temperature: number;
  pressure: number | null;
  vibration: number;
  power: number;
};

export type MetricRange = {
  temperature: { min: number; max: number; noise: number };
  pressure: { min: number; max: number; noise: number } | null;
  vibration: { min: number; max: number; noise: number };
  power: { min: number; max: number; noise: number };
};

export type DeviceProfile = {
  id: string;
  name: string;
  type: DeviceType;
  baseline: MetricBaseline;
  range: MetricRange;
};

export type ActiveAnomaly = {
  type: AnomalyType;
  startedAt: string;
  tick: number;
  durationTicks: number;
  metric?: "temperature" | "pressure" | "vibration" | "power";
};

export type DeviceRuntimeState = {
  profile: DeviceProfile;
  temperature: number;
  pressure: number | null;
  vibration: number;
  power: number;
  activeAnomaly: ActiveAnomaly | null;
  offlineUntil: number | null;
  duplicateNextBatch: boolean;
  lastReading: TelemetryReading | null;
};

export const SIMULATOR_CONFIG = {
  INTERVAL_MS: 2000,
  DEVICE_COUNT: 5,
  ANOMALY_PROBABILITY: 0.05,
  OFFLINE_DURATION_MS: 30_000,
  API_URL: process.env.TELEMETRY_API_URL ?? "http://localhost:3001/telemetry",
  REQUEST_TIMEOUT_MS: 5_000,
} as const;

export const ANOMALY_LABELS: Record<AnomalyType, string> = {
  overheating: "Overheating",
  pressure_loss: "Pressure loss",
  bearing_failure: "Bearing failure",
  sensor_offline: "Sensor offline",
  duplicate_reading: "Duplicate reading",
  noise_spike: "Noise spike",
};
