import type { DeviceMetricKey } from "@/types/device-telemetry";

export const METRIC_CHART_CONFIGS: Record<
  DeviceMetricKey,
  {
    label: string;
    unit: string;
    color: string;
    darkColor: string;
    decimals: number;
  }
> = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    color: "#06b6d4",
    darkColor: "#22d3ee",
    decimals: 1,
  },
  pressure: {
    label: "Pressure",
    unit: "psi",
    color: "#f97316",
    darkColor: "#fb923c",
    decimals: 1,
  },
  power: {
    label: "Power",
    unit: "kW",
    color: "#8b5cf6",
    darkColor: "#a78bfa",
    decimals: 1,
  },
  vibration: {
    label: "Vibration",
    unit: "mm/s",
    color: "#3b82f6",
    darkColor: "#60a5fa",
    decimals: 2,
  },
};

export const METRIC_CHART_ORDER: DeviceMetricKey[] = [
  "temperature",
  "pressure",
  "power",
  "vibration",
];
