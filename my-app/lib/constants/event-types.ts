import type { EventType } from "@/types/events";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  status_change: "Status change",
  metric_threshold: "Metric threshold",
  maintenance: "Maintenance",
  alert_triggered: "Alert triggered",
  alert_resolved: "Alert resolved",
  device_online: "Device online",
  device_offline: "Device offline",
  configuration: "Configuration",
  system: "System",
};

export const EVENT_TYPE_STYLES: Record<
  EventType,
  { dot: string; badge: string; icon: string }
> = {
  status_change: {
    dot: "bg-link",
    badge: "border-link/20 bg-link-bg-soft text-link-deep",
    icon: "text-link",
  },
  metric_threshold: {
    dot: "bg-amber-500",
    badge: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
  },
  maintenance: {
    dot: "bg-violet-500",
    badge: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-400",
    icon: "text-violet-600 dark:text-violet-400",
  },
  alert_triggered: {
    dot: "bg-red-500",
    badge: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400",
    icon: "text-red-600 dark:text-red-400",
  },
  alert_resolved: {
    dot: "bg-emerald-500",
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  device_online: {
    dot: "bg-emerald-500",
    badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  device_offline: {
    dot: "bg-zinc-400",
    badge: "border-zinc-400/20 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
    icon: "text-zinc-500",
  },
  configuration: {
    dot: "bg-cyan-500",
    badge: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
  system: {
    dot: "bg-ink",
    badge: "border-border bg-canvas-soft-2 text-body",
    icon: "text-ink",
  },
};

export const EVENT_TYPE_OPTIONS: EventType[] = [
  "status_change",
  "metric_threshold",
  "maintenance",
  "alert_triggered",
  "alert_resolved",
  "device_online",
  "device_offline",
  "configuration",
  "system",
];
