"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TELEMETRY_METRICS,
  TIME_RANGES,
  getLiveMetricSeries,
  type TelemetryMetric,
  type TimeRange,
} from "@/lib/telemetry/live-metrics";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { cn } from "@/lib/utils";

export function LiveTelemetrySection() {
  const theme = useChartTheme();
  const [metric, setMetric] = useState<TelemetryMetric>("temperature");
  const [range, setRange] = useState<TimeRange>("1h");

  const config = TELEMETRY_METRICS.find((item) => item.key === metric)!;
  const data = useMemo(
    () => getLiveMetricSeries(metric, range),
    [metric, range],
  );

  return (
    <PremiumSurface className="p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-body-md font-semibold text-ink">Live Telemetry</h3>
          <p className="mt-1 text-body-sm text-mute">
            Fleet-wide {config.label.toLowerCase()} · rolling average
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-canvas-soft p-1">
            {TELEMETRY_METRICS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setMetric(item.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-caption font-medium transition-colors",
                  metric === item.key
                    ? "bg-canvas text-ink shadow-elevation-1"
                    : "text-mute hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-xl bg-canvas-soft p-1">
            {TIME_RANGES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRange(item.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 font-mono text-caption font-medium transition-colors",
                  range === item.key
                    ? "bg-canvas text-ink shadow-elevation-1"
                    : "text-mute hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 h-[320px] w-full">
        {theme.mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="live-metric-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: theme.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={28}
              />
              <YAxis
                tick={{ fill: theme.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.tooltipBg,
                  border: `1px solid ${theme.tooltipBorder}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `${Number(value).toFixed(1)} ${config.unit}`,
                  config.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.color}
                strokeWidth={2}
                fill="url(#live-metric-fill)"
                dot={false}
                isAnimationActive
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full animate-pulse rounded-2xl bg-canvas-soft" />
        )}
      </div>
    </PremiumSurface>
  );
}
