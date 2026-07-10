"use client";

import {
  AlertTriangle,
  Heart,
  Server,
  ShieldAlert,
  WifiOff,
} from "lucide-react";
import type { FleetSummary } from "@/types/fleet";
import { STATUS_COLORS } from "@/lib/constants/layout";
import { generateSparkline } from "@/lib/mock/telemetry-throughput";
import { HeroKpiCard } from "@/components/dashboard/hero-kpi-card";

type HeroKpiRowProps = {
  summary: FleetSummary;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
};

export function HeroKpiRow({
  summary,
  activeFilter = null,
  onFilterChange,
}: HeroKpiRowProps) {
  const total = summary.totalDevices || 1;
  const pct = (count: number) => `${((count / total) * 100).toFixed(1)}% of total`;

  const cards = [
    {
      key: "total",
      label: "Total Devices",
      value: summary.totalDevices,
      subtitle: "All connected",
      icon: Server,
      color: STATUS_COLORS.info,
      seed: "hero-total",
      filter: null as string | null,
      showDot: false,
    },
    {
      key: "healthy",
      label: "Healthy",
      value: summary.healthy,
      subtitle: pct(summary.healthy),
      icon: Heart,
      color: STATUS_COLORS.healthy,
      seed: "hero-healthy",
      filter: "healthy",
      showDot: true,
    },
    {
      key: "warning",
      label: "Warning",
      value: summary.warning,
      subtitle: pct(summary.warning),
      icon: AlertTriangle,
      color: STATUS_COLORS.warning,
      seed: "hero-warning",
      filter: "warning",
      showDot: true,
    },
    {
      key: "critical",
      label: "Critical",
      value: summary.critical,
      subtitle: pct(summary.critical),
      icon: ShieldAlert,
      color: STATUS_COLORS.critical,
      seed: "hero-critical",
      filter: "critical",
      showDot: true,
    },
    {
      key: "offline",
      label: "Offline",
      value: summary.offline,
      subtitle: pct(summary.offline),
      icon: WifiOff,
      color: STATUS_COLORS.offline,
      seed: "hero-offline",
      filter: "offline",
      showDot: true,
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const isActive = card.filter !== null && activeFilter === card.filter;
        const isTotal = card.key === "total";

        return (
          <HeroKpiCard
            key={card.key}
            label={card.label}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            showDot={card.showDot}
            sparklineData={generateSparkline(card.seed)}
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
    </div>
  );
}
