export type DeviceMetricKey =
  | "temperature"
  | "pressure"
  | "power"
  | "vibration";

export type DeviceTelemetryPoint = {
  timestamp: string;
  temperature: number;
  pressure: number;
  power: number;
  vibration: number;
};

export type DeviceTelemetryHistory = {
  deviceId: string;
  points: DeviceTelemetryPoint[];
};

export type MetricChartConfig = {
  key: DeviceMetricKey;
  label: string;
  unit: string;
  color: string;
  decimals: number;
};
