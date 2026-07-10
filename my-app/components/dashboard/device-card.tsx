"use client";

import { useRouter } from "next/navigation";
import type { Device } from "@/types/fleet";
import {
  DEVICE_STATUS_STYLES,
  getHealthProgressColor,
} from "@/lib/constants/device-status";
import { formatRelativeTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { DeviceMetricItem } from "@/components/dashboard/device-metric-item";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type DeviceCardProps = {
  device: Device;
  className?: string;
};

export function DeviceCard({ device, className }: DeviceCardProps) {
  const router = useRouter();
  const styles = DEVICE_STATUS_STYLES[device.status];
  const isOffline = device.status === "offline";

  const handleClick = () => {
    router.push(`/devices/${device.id}`);
  };

  return (
    <DashboardCard
      data-stagger
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => handleInteractiveKeyDown(event, handleClick)}
      elevation="low"
      padding="none"
      className={cn(
        "group cursor-pointer overflow-hidden interactive-lift focus-ring",
        styles.border,
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h3 className="truncate text-body-md font-semibold text-ink transition-colors duration-200 group-hover:text-ink/80">
              {device.name}
            </h3>
            <p className="truncate font-mono text-caption text-mute">
              {device.type}
            </p>
          </div>
          <DeviceStatusBadge status={device.status} />
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-caption uppercase tracking-wide text-mute">
              Health score
            </span>
            <span
              className={cn(
                "text-body-sm font-semibold tabular-nums",
                styles.accent,
              )}
            >
              {isOffline ? "—" : `${device.healthScore}%`}
            </span>
          </div>
          <div className="overflow-hidden rounded-full bg-canvas-soft-2">
            <Progress
              value={isOffline ? 0 : device.healthScore}
              className="h-1.5 bg-transparent"
              indicatorClassName={getHealthProgressColor(
                device.healthScore,
                device.status,
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DeviceMetricItem
            label="Temperature"
            value={device.temperature}
            unit="°C"
            offline={isOffline}
          />
          <DeviceMetricItem
            label="Pressure"
            value={device.pressure}
            unit="psi"
            offline={isOffline}
          />
          <DeviceMetricItem
            label="Power"
            value={device.power}
            unit="kW"
            offline={isOffline}
          />
          <DeviceMetricItem
            label="Vibration"
            value={device.vibration}
            unit="mm/s"
            offline={isOffline}
          />
        </div>
      </div>

      <div className="border-t border-border bg-canvas-soft/50 px-5 py-3">
        <p className="font-mono text-caption text-mute">
          Updated{" "}
          <span className="text-body">{formatRelativeTime(device.lastUpdated)}</span>
        </p>
      </div>
    </DashboardCard>
  );
}
