import type { DeviceMetricKey } from "@/types/device-telemetry";

export const DEVICE_DETAIL_MAX_WIDTH = 1600;

export const DEVICE_METRIC_COLORS: Record<
  DeviceMetricKey | "health" | "rpm",
  string
> = {
  health: "#22c55e",
  temperature: "#06b6d4",
  pressure: "#f97316",
  power: "#8b5cf6",
  vibration: "#3b82f6",
  rpm: "#64748b",
};

export const deviceSurfaceClass =
  "rounded-2xl border border-hairline bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all duration-200";

export const deviceSurfaceHoverClass =
  "motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-hairline-strong motion-safe:hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]";
