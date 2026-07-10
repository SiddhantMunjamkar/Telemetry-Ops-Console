import type { DeviceStatus } from "@/types/fleet";

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  offline: "Offline",
};

export const DEVICE_STATUS_STYLES: Record<
  DeviceStatus,
  {
    dot: string;
    badge: string;
    border: string;
    accent: string;
    progress: string;
  }
> = {
  healthy: {
    dot: "bg-emerald-500",
    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    border: "hover:border-emerald-500/30",
    accent: "text-emerald-600 dark:text-emerald-400",
    progress: "bg-emerald-500",
  },
  warning: {
    dot: "bg-amber-500",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    border: "hover:border-amber-500/30",
    accent: "text-amber-600 dark:text-amber-400",
    progress: "bg-amber-500",
  },
  critical: {
    dot: "bg-red-500",
    badge: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
    border: "hover:border-red-500/30",
    accent: "text-red-600 dark:text-red-400",
    progress: "bg-red-500",
  },
  offline: {
    dot: "bg-zinc-400 dark:bg-zinc-500",
    badge:
      "border-zinc-400/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    border: "hover:border-zinc-400/30",
    accent: "text-zinc-500 dark:text-zinc-400",
    progress: "bg-zinc-400",
  },
};

export function getHealthProgressColor(
  score: number,
  status: DeviceStatus,
): string {
  if (status === "offline") {
    return DEVICE_STATUS_STYLES.offline.progress;
  }
  if (score >= 80) return DEVICE_STATUS_STYLES.healthy.progress;
  if (score >= 50) return DEVICE_STATUS_STYLES.warning.progress;
  return DEVICE_STATUS_STYLES.critical.progress;
}
