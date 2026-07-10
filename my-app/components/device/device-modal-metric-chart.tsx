"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { DeviceMetricKey, DeviceTelemetryPoint } from "@/types/device-telemetry";
import { METRIC_CHART_CONFIGS } from "@/lib/constants/metric-charts";
import { formatChartTime } from "@/lib/format";
import { useChartTheme } from "@/hooks/use-chart-theme";
import { DeviceModalPanel } from "@/components/device/device-modal-panel";

type DeviceModalMetricChartProps = {
  data: DeviceTelemetryPoint[];
  metric: DeviceMetricKey;
};

export function DeviceModalMetricChart({
  data,
  metric,
}: DeviceModalMetricChartProps) {
  const theme = useChartTheme();
  const config = METRIC_CHART_CONFIGS[metric];
  const stroke = theme.isDark ? config.darkColor : config.color;
  const gradientId = `device-modal-${metric}`;

  if (!theme.mounted) {
    return (
      <DeviceModalPanel noPadding>
        <div className="h-[132px] animate-pulse bg-canvas-soft-2" />
      </DeviceModalPanel>
    );
  }

  return (
    <DeviceModalPanel
      title={`${config.label} (${config.unit})`}
      noPadding
      bodyClassName="px-2 pb-2 pt-0"
    >
      <div className="h-[120px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 6, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={theme.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatChartTime}
              tick={{ fill: theme.axis, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              dy={4}
            />
            <YAxis
              tick={{ fill: theme.axis, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={30}
              tickFormatter={(value: number) => value.toFixed(config.decimals)}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={stroke}
              strokeWidth={1.75}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </DeviceModalPanel>
  );
}
