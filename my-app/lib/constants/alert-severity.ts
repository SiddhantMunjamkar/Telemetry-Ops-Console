import type { AlertSeverity } from "@/types/alerts";

export const ALERT_SEVERITY_LABELS: Record<AlertSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export const ALERT_SEVERITY_ORDER: Record<AlertSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const ALERT_SEVERITY_STYLES: Record<
  AlertSeverity,
  {
    dot: string;
    badge: string;
    border: string;
    accent: string;
  }
> = {
  low: {
    dot: "bg-zinc-400",
    badge:
      "border-zinc-400/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    border: "border-l-zinc-400",
    accent: "text-zinc-500",
  },
  medium: {
    dot: "bg-amber-500",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    border: "border-l-amber-500",
    accent: "text-amber-600 dark:text-amber-400",
  },
  high: {
    dot: "bg-orange-500",
    badge: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400",
    border: "border-l-orange-500",
    accent: "text-orange-600 dark:text-orange-400",
  },
  critical: {
    dot: "bg-red-500",
    badge: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
    border: "border-l-red-500",
    accent: "text-red-600 dark:text-red-400",
  },
};

export const ALERT_STATUS_LABELS = {
  open: "Open",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
} as const;
