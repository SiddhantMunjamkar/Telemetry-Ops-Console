"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type { Device } from "@/types/fleet";
import { DEVICE_STATUS_LABELS, DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { formatMetricValue, getDeviceTrendLabel } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";

const STATUS_PRIORITY = {
  critical: 0,
  warning: 1,
  offline: 2,
  healthy: 3,
} as const;

type FleetHealthPanelProps = {
  devices: Device[];
  className?: string;
};

export function FleetHealthPanel({ devices, className }: FleetHealthPanelProps) {
  const router = useRouter();
  const sorted = [...devices].sort(
    (a, b) => STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {sorted.map((device) => {
        const styles = DEVICE_STATUS_STYLES[device.status];
        const trend = getDeviceTrendLabel(device.status);
        const isOffline = device.status === "offline";

        const handleOpen = () => router.push(`/devices/${device.id}`);

        return (
          <DashboardCard
            key={device.id}
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(event) => handleInteractiveKeyDown(event, handleOpen)}
            className={cn(
              "cursor-pointer p-4 interactive-lift focus-ring",
              styles.border,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/devices/${device.id}`}
                  className="text-body-md font-semibold text-ink hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  {device.name}
                </Link>
                <p className="mt-1 font-mono text-caption text-mute">
                  {device.type}
                </p>
              </div>
              <DeviceStatusBadge status={device.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCell label="Status" value={DEVICE_STATUS_LABELS[device.status]} accent={styles.accent} />
              <MetricCell
                label="Temperature"
                value={isOffline ? "—" : `${formatMetricValue(device.temperature, 1)}°C`}
              />
              <MetricCell
                label="Health"
                value={isOffline ? "—" : `${device.healthScore}%`}
                accent={styles.accent}
              />
              <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-wide text-mute">
                  Trend
                </p>
                <TrendLabel trend={trend} status={device.status} />
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}

function TrendLabel({
  trend,
  status,
}: {
  trend: ReturnType<typeof getDeviceTrendLabel>;
  status: Device["status"];
}) {
  const Icon =
    trend.direction === "up"
      ? TrendingUp
      : trend.direction === "down"
        ? TrendingDown
        : Minus;

  const colorClass =
    status === "critical" || status === "warning"
      ? "text-red-600 dark:text-red-400"
      : status === "offline"
        ? "text-mute"
        : "text-emerald-600 dark:text-emerald-400";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-body-sm font-medium",
        colorClass,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {trend.label}
    </span>
  );
}

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-wide text-mute">
        {label}
      </p>
      <p className={cn("text-body-sm font-semibold tabular-nums text-ink", accent)}>
        {value}
      </p>
    </div>
  );
}
