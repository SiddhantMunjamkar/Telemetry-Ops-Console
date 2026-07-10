"use client";

import {
  AlertTriangle,
  Heart,
  Server,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import type { FleetSummary } from "@/types/fleet";
import { generateSparkline } from "@/lib/mock/telemetry-throughput";
import { KpiStatCard } from "@/components/dashboard/kpi-stat-card";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

type DashboardKpiRowProps = {
  summary: FleetSummary;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
};

const SPARKLINE_COLORS = {
  total: "#0070f3",
  healthy: "#22c55e",
  warning: "#f59e0b",
  critical: "#ef4444",
  offline: "#71717a",
} as const;

export function DashboardKpiRow({
  summary,
  activeFilter = null,
  onFilterChange,
}: DashboardKpiRowProps) {
  const total = summary.totalDevices || 1;
  const pct = (count: number) => `${((count / total) * 100).toFixed(1)}% of total`;

  const cards = [
    {
      key: "total",
      label: "Total Devices",
      value: summary.totalDevices,
      subtitle: "All connected",
      icon: Server,
      iconClassName: "text-link",
      sparklineColor: SPARKLINE_COLORS.total,
      sparklineSeed: "kpi-total",
      filter: null as string | null,
    },
    {
      key: "healthy",
      label: "Healthy",
      value: summary.healthy,
      subtitle: pct(summary.healthy),
      icon: Heart,
      iconClassName: "text-emerald-600 dark:text-emerald-400",
      sparklineColor: SPARKLINE_COLORS.healthy,
      sparklineSeed: "kpi-healthy",
      filter: "healthy",
    },
    {
      key: "warning",
      label: "Warning",
      value: summary.warning,
      subtitle: pct(summary.warning),
      icon: AlertTriangle,
      iconClassName: "text-amber-600 dark:text-amber-400",
      sparklineColor: SPARKLINE_COLORS.warning,
      sparklineSeed: "kpi-warning",
      filter: "warning",
    },
    {
      key: "critical",
      label: "Critical",
      value: summary.critical,
      subtitle: pct(summary.critical),
      icon: ShieldAlert,
      iconClassName: "text-red-600 dark:text-red-400",
      sparklineColor: SPARKLINE_COLORS.critical,
      sparklineSeed: "kpi-critical",
      filter: "critical",
    },
    {
      key: "offline",
      label: "Offline",
      value: summary.offline,
      subtitle: pct(summary.offline),
      icon: WifiOff,
      iconClassName: "text-zinc-500 dark:text-zinc-400",
      sparklineColor: SPARKLINE_COLORS.offline,
      sparklineSeed: "kpi-offline",
      filter: "offline",
    },
  ] as const;

  return (
    <DashboardGrid gap="md" className="grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => {
        const isActive = card.filter !== null && activeFilter === card.filter;
        const isTotal = card.key === "total";

        return (
          <KpiStatCard
            key={card.key}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            iconClassName={card.iconClassName}
            sparklineColor={card.sparklineColor}
            sparklineData={generateSparkline(card.sparklineSeed)}
            active={isActive}
            onClick={
              onFilterChange
                ? () => {
                    if (isTotal) {
                      onFilterChange(null);
                      return;
                    }
                    onFilterChange(isActive ? null : card.filter);
                  }
                : undefined
            }
          />
        );
      })}
    </DashboardGrid>
  );
}
