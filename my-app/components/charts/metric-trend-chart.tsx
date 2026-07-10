"use client";

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
import { formatChartTime } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { ChartTooltipContent } from "@/components/charts/chart-tooltip";
import {
  CardContent,
  CardHeader,
  CardHeaderDescription,
  CardHeaderTitle,
  DashboardCard,
} from "@/components/dashboard";

type MetricTrendChartProps = {
  data: DeviceTelemetryPoint[];
  metric: DeviceMetricKey;
  className?: string;
};

export function MetricTrendChart({
  data,
  metric,
  className,
}: MetricTrendChartProps) {
  const theme = useChartTheme();
  const config = METRIC_CHART_CONFIGS[metric];
  const lineColor = theme.isDark ? config.darkColor : config.color;

  if (!theme.mounted) {
    return (
      <DashboardCard className={className}>
        <CardHeader>
          <CardHeaderTitle>{config.label} trend</CardHeaderTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 animate-pulse rounded-sm bg-muted" />
        </CardContent>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className={className}>
      <CardHeader>
        <CardHeaderTitle>{config.label} trend</CardHeaderTitle>
        <CardHeaderDescription>
          Last 12 hours · 15 min intervals
        </CardHeaderDescription>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-4">
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                stroke={theme.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatChartTime}
                tick={{ fill: theme.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis
                tick={{ fill: theme.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(value: number) =>
                  value.toFixed(config.decimals)
                }
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
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: lineColor,
                  stroke: theme.tooltipBg,
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={600}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </DashboardCard>
  );
}
