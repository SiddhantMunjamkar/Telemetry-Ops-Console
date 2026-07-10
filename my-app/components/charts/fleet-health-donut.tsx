"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { FleetSummary } from "@/types/fleet";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";

const SEGMENT_COLORS = {
  healthy: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  offline: "#71717a",
} as const;

type FleetHealthDonutProps = {
  summary: FleetSummary;
  className?: string;
};

export function FleetHealthDonut({ summary, className }: FleetHealthDonutProps) {
  const data = [
    { name: "Healthy", value: summary.healthy, color: SEGMENT_COLORS.healthy },
    { name: "Warning", value: summary.warning, color: SEGMENT_COLORS.warning },
    { name: "Critical", value: summary.critical, color: SEGMENT_COLORS.critical },
    ...(summary.offline > 0
      ? [{ name: "Offline", value: summary.offline, color: SEGMENT_COLORS.offline }]
      : []),
  ].filter((item) => item.value > 0);

  return (
    <DashboardCard className={cn("flex h-full flex-col p-5", className)}>
      <h3 className="text-body-md font-semibold text-ink">Fleet Health Overview</h3>

      <div className="relative mt-2 min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-display-md font-semibold tabular-nums text-ink">
            {summary.totalDevices}
          </p>
          <p className="text-caption text-mute">Devices</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap justify-center gap-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-caption text-body">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden
            />
            {item.name} ({item.value})
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
