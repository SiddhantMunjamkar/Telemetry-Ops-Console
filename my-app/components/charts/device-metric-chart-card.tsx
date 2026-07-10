"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DeviceMetricKey, DeviceTelemetryPoint } from "@/types/device-telemetry";
import { METRIC_CHART_CONFIGS } from "@/lib/constants/metric-charts";
import { DEVICE_METRIC_COLORS } from "@/lib/constants/device-detail";
import { deviceSurfaceClass, deviceSurfaceHoverClass } from "@/lib/constants/device-detail";
import { formatChartTime } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";
import { cn } from "@/lib/utils";

const TIME_RANGES = ["1H", "6H", "12H", "24H"] as const;

type DeviceMetricChartCardProps = {
  data: DeviceTelemetryPoint[];
  metric: DeviceMetricKey;
  className?: string;
};

function computeStats(values: number[]) {
  if (values.length === 0) {
    return { min: 0, max: 0, avg: 0, current: 0 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const current = values[values.length - 1];
  return { min, max, avg, current };
}

export function DeviceMetricChartCard({
  data,
  metric,
  className,
}: DeviceMetricChartCardProps) {
  const theme = useChartTheme();
  const config = METRIC_CHART_CONFIGS[metric];
  const color = DEVICE_METRIC_COLORS[metric] ?? config.darkColor;

  const values = useMemo(() => data.map((point) => point[metric]), [data, metric]);
  const stats = useMemo(() => computeStats(values), [values]);

  const trend = useMemo(() => {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }, [values]);

  if (!theme.mounted) {
    return (
      <article className={cn(deviceSurfaceClass, "h-[320px] animate-pulse", className)}>
        <div className="h-full rounded-xl bg-canvas-soft-2" />
      </article>
    );
  }

  const trendLabel = `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%`;

  return (
    <article
      className={cn(
        deviceSurfaceClass,
        deviceSurfaceHoverClass,
        "flex h-[320px] flex-col",
        className,
      )}
    >
      <div className="mb-3 min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-[15px] font-semibold text-ink">{config.label}</h3>
          <span className="text-lg font-bold tabular-nums text-ink">
            {stats.current.toFixed(config.decimals)}
            <span className="ml-0.5 text-[13px] font-medium text-mute">
              {config.unit}
            </span>
          </span>
          <span
            className={cn(
              "text-[12px] font-medium",
              trend >= 0 ? "text-[#22c55e]" : "text-[#ef4444]",
            )}
          >
            {trendLabel}
          </span>
        </div>
        <div className="mt-2 flex gap-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                range === "12H"
                  ? "bg-canvas-soft-2 text-ink"
                  : "text-mute hover:text-ink",
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatChartTime}
              tick={{ fill: theme.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: theme.axis, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={36}
              tickFormatter={(value: number) => value.toFixed(config.decimals)}
            />
            <Tooltip
              cursor={{ stroke: theme.grid, strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  unit={config.unit}
                  metricLabel={config.label}
                  decimals={config.decimals}
                  colors={{
                    tooltipBg: theme.tooltipBg,
                    tooltipBorder: theme.tooltipBorder,
                    tooltipText: theme.tooltipText,
                    tooltipMuted: theme.tooltipMuted,
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 3,
                fill: color,
                stroke: theme.tooltipBg,
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <dl className="mt-3 grid grid-cols-4 gap-2 border-t border-hairline pt-3 text-[11px]">
        {[
          { label: "Min", value: stats.min },
          { label: "Avg", value: stats.avg },
          { label: "Max", value: stats.max },
          { label: "Current", value: stats.current },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-mute">{item.label}</dt>
            <dd className="font-semibold tabular-nums text-ink">
              {item.value.toFixed(config.decimals)}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
