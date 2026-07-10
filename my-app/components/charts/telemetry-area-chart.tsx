"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TelemetryPoint } from "@/lib/mock/telemetry-throughput";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";

type TelemetryAreaChartProps = {
  data: TelemetryPoint[];
  className?: string;
};

export function TelemetryAreaChart({ data, className }: TelemetryAreaChartProps) {
  const theme = useChartTheme();
  const color = "#7928ca";

  if (!theme.mounted) {
    return (
      <DashboardCard className={cn("h-full p-5", className)}>
        <div className="h-48 animate-pulse rounded-md bg-muted" />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className={cn("flex h-full flex-col p-5", className)}>
      <h3 className="text-body-md font-semibold text-ink">Telemetry Over Time</h3>
      <p className="mt-0.5 text-caption text-mute">Messages per second · last hour</p>

      <div className="mt-4 min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="telemetry-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={theme.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: theme.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: theme.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={44}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.tooltipBg,
                border: `1px solid ${theme.tooltipBorder}`,
                borderRadius: 6,
                fontSize: 12,
              }}
              labelStyle={{ color: theme.tooltipMuted }}
              itemStyle={{ color: theme.tooltipText }}
              formatter={(value) => [
                `${Number(value).toLocaleString()} /s`,
                "Rate",
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill="url(#telemetry-area)"
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
