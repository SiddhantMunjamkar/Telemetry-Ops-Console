"use client";

import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import type { Device } from "@/types/fleet";
import { STATUS_COLORS } from "@/lib/constants/layout";
import { DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { generateSparkline } from "@/lib/mock/telemetry-throughput";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { cn } from "@/lib/utils";

const sparkColor = {
  healthy: STATUS_COLORS.healthy,
  warning: STATUS_COLORS.warning,
  critical: STATUS_COLORS.critical,
  offline: STATUS_COLORS.offline,
} as const;

type PremiumDeviceCardProps = {
  device: Device;
};

export function PremiumDeviceCard({ device }: PremiumDeviceCardProps) {
  const router = useRouter();
  const styles = DEVICE_STATUS_STYLES[device.status];
  const isOffline = device.status === "offline";
  const open = () => router.push(`/devices/${device.id}`);

  return (
    <PremiumSurface
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => handleInteractiveKeyDown(event, open)}
      interactive
      className="flex flex-col gap-6 p-6 focus-ring"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-semibold tracking-tight text-ink">
            {device.name}
          </h3>
          <p className="mt-1 truncate text-body-sm text-mute">{device.type}</p>
        </div>
        <Activity className={cn("size-4 shrink-0", styles.accent)} aria-hidden />
      </div>

      <DeviceStatusBadge status={device.status} />

      <div className="grid grid-cols-3 gap-4">
        <Metric label="Temp" value={isOffline ? "—" : `${device.temperature.toFixed(1)}°`} />
        <Metric label="Pressure" value={isOffline ? "—" : `${device.pressure.toFixed(0)}`} />
        <Metric label="Power" value={isOffline ? "—" : `${device.power.toFixed(1)}`} />
      </div>

      <SparklineChart
        data={generateSparkline(device.id)}
        color={sparkColor[device.status]}
        className="h-12"
      />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-mute">
            Health score
          </p>
          <p className={cn("mt-1 text-2xl font-semibold tabular-nums", styles.accent)}>
            {isOffline ? "—" : `${device.healthScore}%`}
          </p>
        </div>
      </div>
    </PremiumSurface>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wide text-mute">{label}</p>
      <p className="mt-1 text-body-sm font-medium tabular-nums text-ink">{value}</p>
    </div>
  );
}
