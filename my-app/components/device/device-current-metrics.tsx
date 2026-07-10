import {
  Activity,
  Gauge,
  HeartPulse,
  Thermometer,
  Zap,
} from "lucide-react";
import type { Device } from "@/types/fleet";
import {
  DEVICE_STATUS_STYLES,
  getHealthProgressColor,
} from "@/lib/constants/device-status";
import { formatMetricValue, formatRelativeTime } from "@/lib/format";
import { MetricValue } from "@/components/common/MetricValue";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type DeviceCurrentMetricsProps = {
  device: Device;
};

const metricIcons = {
  temperature: Thermometer,
  pressure: Gauge,
  power: Zap,
  vibration: Activity,
} as const;

export function DeviceCurrentMetrics({ device }: DeviceCurrentMetricsProps) {
  const isOffline = device.status === "offline";
  const styles = DEVICE_STATUS_STYLES[device.status];

  const metrics = [
    {
      key: "temperature",
      label: "Temperature",
      value: device.temperature,
      unit: "°C",
      decimals: 1,
      icon: metricIcons.temperature,
    },
    {
      key: "pressure",
      label: "Pressure",
      value: device.pressure,
      unit: "psi",
      decimals: 1,
      icon: metricIcons.pressure,
    },
    {
      key: "power",
      label: "Power",
      value: device.power,
      unit: "kW",
      decimals: 1,
      icon: metricIcons.power,
    },
    {
      key: "vibration",
      label: "Vibration",
      value: device.vibration,
      unit: "mm/s",
      decimals: 2,
      icon: metricIcons.vibration,
    },
  ] as const;

  return (
    <div className="space-y-4">
      <DashboardGrid gap="md" className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          className={cn("p-5 sm:col-span-2 xl:col-span-1", styles.border)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <p className="font-mono text-caption uppercase tracking-wide text-mute">
                Health score
              </p>
              <MetricValue
                value={isOffline ? 0 : device.healthScore}
                unit="%"
                decimals={0}
                animate={!isOffline}
              />
            </div>
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-sm border border-border bg-canvas-soft",
                styles.accent,
              )}
            >
              <HeartPulse className="size-4" aria-hidden />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Progress
              value={isOffline ? 0 : device.healthScore}
              className="h-2 bg-canvas-soft-2"
              indicatorClassName={getHealthProgressColor(
                device.healthScore,
                device.status,
              )}
            />
          </div>
        </DashboardCard>

        <DashboardCard className="p-5">
          <p className="font-mono text-caption uppercase tracking-wide text-mute">
            Status
          </p>
          <div className="mt-4">
            <DeviceStatusBadge status={device.status} />
          </div>
          <p className="mt-4 font-mono text-caption text-mute">
            Last updated{" "}
            <span className="text-body">
              {formatRelativeTime(device.lastUpdated)}
            </span>
          </p>
        </DashboardCard>

        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <DashboardCard
              key={metric.key}
              className="group p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevation-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                  <p className="font-mono text-caption uppercase tracking-wide text-mute">
                    {metric.label}
                  </p>
                  <p className="text-display-sm font-semibold tracking-display-sm text-ink tabular-nums">
                    {isOffline ? (
                      <span className="text-mute">—</span>
                    ) : (
                      <>
                        {formatMetricValue(metric.value, metric.decimals)}
                        <span className="ml-1 text-body-sm font-medium text-mute">
                          {metric.unit}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-sm border border-border bg-canvas-soft text-mute transition-colors duration-200 group-hover:text-ink">
                  <Icon className="size-4" aria-hidden />
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </DashboardGrid>
    </div>
  );
}
