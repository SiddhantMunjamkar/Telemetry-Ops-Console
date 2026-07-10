"use client";

import {
  Activity,
  AlertTriangle,
  Gauge,
  Thermometer,
  Zap,
} from "lucide-react";
import { useMemo } from "react";
import type { Device } from "@/types/fleet";
import type { DeviceMetricKey } from "@/types/device-telemetry";
import { METRIC_CHART_CONFIGS, METRIC_CHART_ORDER } from "@/lib/constants/metric-charts";
import { DEVICE_STATUS_LABELS } from "@/lib/constants/device-status";
import { useDeviceHistory } from "@/hooks/use-device";
import { useAlerts } from "@/hooks/use-alerts";
import {
  computeMetricTrend,
  formatAlertDuration,
  getPrimaryDeviceAlert,
  sliceTelemetryByRange,
  type DeviceTimeRange,
} from "@/lib/device-modal";
import { DeviceModalMetricChart } from "@/components/device/device-modal-metric-chart";
import { DeviceModalPanel } from "@/components/device/device-modal-panel";
import { cn } from "@/lib/utils";

export const TIME_RANGE_OPTIONS: { value: DeviceTimeRange; label: string }[] = [
  { value: "1h", label: "Last 1 Hour" },
  { value: "6h", label: "Last 6 Hours" },
  { value: "12h", label: "Last 12 Hours" },
];

const METRIC_ROWS: Array<{
  key: DeviceMetricKey;
  label: string;
  icon: typeof Thermometer;
  color: string;
  iconBg: string;
  format: (device: Device) => string;
}> = [
  {
    key: "temperature",
    label: "Temperature",
    icon: Thermometer,
    color: METRIC_CHART_CONFIGS.temperature.darkColor,
    iconBg: "rgba(251,191,36,0.14)",
    format: (device) => `${device.temperature.toFixed(1)} °C`,
  },
  {
    key: "pressure",
    label: "Pressure",
    icon: Gauge,
    color: METRIC_CHART_CONFIGS.pressure.darkColor,
    iconBg: "rgba(50,145,255,0.14)",
    format: (device) => `${device.pressure.toFixed(1)} PSI`,
  },
  {
    key: "power",
    label: "Power",
    icon: Zap,
    color: METRIC_CHART_CONFIGS.power.darkColor,
    iconBg: "rgba(168,85,247,0.14)",
    format: (device) => `${device.power.toFixed(1)} kW`,
  },
  {
    key: "vibration",
    label: "Vibration",
    icon: Activity,
    color: METRIC_CHART_CONFIGS.vibration.darkColor,
    iconBg: "rgba(80,227,194,0.14)",
    format: (device) => `${device.vibration.toFixed(1)} mm/s`,
  },
];

type DeviceModalOverviewProps = {
  device: Device;
  timeRange: DeviceTimeRange;
  clock: string;
};

export function DeviceModalOverview({
  device,
  timeRange,
  clock,
}: DeviceModalOverviewProps) {
  const historyQuery = useDeviceHistory(device.id);
  const { allAlerts } = useAlerts();
  const history = historyQuery.data ?? { deviceId: device.id, points: [] };
  const chartData = useMemo(
    () => sliceTelemetryByRange(history.points, timeRange),
    [history.points, timeRange],
  );

  const activeAlert = useMemo(
    () => getPrimaryDeviceAlert(allAlerts, device.id),
    [allAlerts, device.id],
  );

  const isOffline = device.status === "offline";
  const healthColor =
    device.status === "healthy"
      ? "#22c55e"
      : device.status === "warning"
        ? "#f59e0b"
        : device.status === "critical"
          ? "#f85149"
          : "#71717a";

  return (
    <div className="space-y-3">
      <DeviceModalPanel
        title="Current Metrics"
        flush
        action={
          <span className="font-mono text-[10px] tabular-nums text-mute">
            {clock}
          </span>
        }
      >
        <div className="grid grid-cols-2 divide-x divide-y divide-hairline sm:grid-cols-4 sm:divide-y-0">
          {METRIC_ROWS.map((row) => {
            const Icon = row.icon;
            const series = chartData.map((point) => point[row.key]);
            const trend = computeMetricTrend(series);
            const trendUp = trend.direction === "up";

            return (
              <div
                key={row.key}
                className="flex items-center gap-2.5 px-3.5 py-3"
              >
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-[7px]"
                  style={{ backgroundColor: row.iconBg, color: row.color }}
                >
                  <Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] leading-none text-mute">
                    {row.label}
                  </p>
                  <div className="mt-1 flex items-baseline justify-between gap-1.5">
                    <p className="truncate text-[15px] font-semibold leading-none tabular-nums tracking-tight text-ink">
                      {isOffline ? "—" : row.format(device)}
                    </p>
                    {!isOffline ? (
                      <span
                        className={cn(
                          "shrink-0 text-[10px] font-medium tabular-nums",
                          trendUp ? "text-red-400" : "text-blue-400",
                        )}
                      >
                        {trendUp ? "↑" : "↓"}
                        {trendUp
                          ? trend.pct.toFixed(1)
                          : `-${trend.pct.toFixed(1)}`}
                        %
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DeviceModalPanel>

      <div className="grid gap-3 sm:grid-cols-2">
        {METRIC_CHART_ORDER.map((metric) => (
          <DeviceModalMetricChart
            key={metric}
            data={chartData}
            metric={metric}
          />
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DeviceModalPanel title="Active Alert Summary" bodyClassName="pt-0">
          {activeAlert ? (
            <div className="flex items-center gap-2.5 rounded-[8px] bg-canvas-soft/80 px-2.5 py-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-red-500/12 text-red-400">
                <AlertTriangle className="size-3.5" strokeWidth={2.25} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium leading-tight text-ink">
                  {activeAlert.title}
                </p>
                <p className="mt-0.5 truncate text-[11px] leading-tight text-mute">
                  Started:{" "}
                  {new Date(activeAlert.timestamp).toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit",
                  })}{" "}
                  • Duration: {formatAlertDuration(activeAlert.timestamp)}
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-red-400">
                {activeAlert.severity}
              </span>
            </div>
          ) : (
            <p className="text-[12px] text-mute">No active alerts for this device.</p>
          )}
        </DeviceModalPanel>

        <DeviceModalPanel title="Health Score" bodyClassName="pt-0">
          <div className="flex items-center gap-4">
            <HealthRing
              score={isOffline ? 0 : device.healthScore}
              color={healthColor}
            />
            <div className="min-w-0">
              <p
                className="text-[15px] font-semibold leading-tight capitalize"
                style={{ color: healthColor }}
              >
                {DEVICE_STATUS_LABELS[device.status]}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-mute">
                {device.status === "critical"
                  ? "Health score is low. Immediate attention required."
                  : device.status === "warning"
                    ? "Health score is declining. Schedule inspection soon."
                    : device.status === "offline"
                      ? "Device is offline. Telemetry unavailable."
                      : "Device is operating within normal parameters."}
              </p>
            </div>
          </div>
        </DeviceModalPanel>
      </div>
    </div>
  );
}

function HealthRing({ score, color }: { score: number; color: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative size-[76px] shrink-0">
      <svg viewBox="0 0 76 76" className="size-full -rotate-90">
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-canvas-soft-2"
        />
        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[15px] font-semibold tabular-nums text-ink">
          {score}%
        </span>
      </div>
    </div>
  );
}
