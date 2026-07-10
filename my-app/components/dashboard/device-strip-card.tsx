"use client";

import { Activity } from "lucide-react";
import type { Device, DeviceStatus } from "@/types/fleet";
import { STATUS_COLORS } from "@/lib/constants/layout";
import { generateSparkline } from "@/lib/mock/telemetry-throughput";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { cn } from "@/lib/utils";

const STATUS_DOT: Record<DeviceStatus, string> = {
  healthy: STATUS_COLORS.healthy,
  warning: STATUS_COLORS.warning,
  critical: STATUS_COLORS.critical,
  offline: STATUS_COLORS.offline,
};

const SPARKLINE_COLOR: Record<DeviceStatus, string> = {
  healthy: STATUS_COLORS.healthy,
  warning: STATUS_COLORS.warning,
  critical: STATUS_COLORS.critical,
  offline: STATUS_COLORS.offline,
};

const HEALTH_SCORE_COLOR: Record<DeviceStatus, string> = {
  healthy: STATUS_COLORS.healthy,
  warning: STATUS_COLORS.warning,
  critical: STATUS_COLORS.critical,
  offline: STATUS_COLORS.offline,
};

type DeviceStripCardProps = {
  device: Device;
  onSelect?: (device: Device) => void;
};

export function DeviceStripCard({ device, onSelect }: DeviceStripCardProps) {
  const isOffline = device.status === "offline";
  const open = () => onSelect?.(device);

  const metricValueColor =
    device.status === "healthy" ? STATUS_COLORS.healthy : undefined;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(event) => handleInteractiveKeyDown(event, open)}
      className="w-[200px] shrink-0 cursor-pointer rounded-xl border border-hairline bg-card p-3.5 transition-colors duration-200 motion-safe:hover:border-hairline-strong focus-ring"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: STATUS_DOT[device.status] }}
              aria-hidden
            />
            <h4 className="truncate text-[13px] font-semibold leading-tight text-ink">
              {device.name}
            </h4>
          </div>
          <p className="mt-1 truncate pl-3.5 text-[12px] leading-tight text-mute">
            {device.type}
          </p>
        </div>
        <Activity className="size-3.5 shrink-0 text-mute/70" aria-hidden />
      </div>

      <div className="mt-3 space-y-1.5">
        <MetricRow
          label="Temp"
          value={isOffline ? "—" : `${device.temperature.toFixed(1)} °C`}
          valueColor={metricValueColor}
        />
        <MetricRow
          label="Pressure"
          value={isOffline ? "—" : `${device.pressure.toFixed(1)} PSI`}
          valueColor={metricValueColor}
        />
        <MetricRow
          label="Vibration"
          value={isOffline ? "—" : `${device.vibration.toFixed(1)} mm/s`}
          valueColor={metricValueColor}
        />
      </div>

      <div className="mt-3">
        <SparklineChart
          data={generateSparkline(device.id)}
          color={SPARKLINE_COLOR[device.status]}
          className="h-6"
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <span className="text-[12px] text-mute">Health Score</span>
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color: isOffline ? undefined : HEALTH_SCORE_COLOR[device.status] }}
        >
          {isOffline ? "—" : `${device.healthScore}%`}
        </span>
      </div>
    </article>
  );
}

function MetricRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[12px] leading-tight">
      <span className="text-mute">{label}</span>
      <span
        className={cn("font-medium tabular-nums", !valueColor && "text-ink")}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
