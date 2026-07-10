"use client";

import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
  Radio,
  Server,
} from "lucide-react";
import type { FleetSummary } from "@/types/fleet";
import { FleetSummaryCard } from "@/components/dashboard/fleet-summary-card";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export const MOCK_TELEMETRY_RATE = 524;

type FleetSummaryGridProps = {
  summary: FleetSummary;
  activeFilter?: string | null;
  onFilterChange?: (filter: string | null) => void;
};

const summaryConfig = [
  {
    key: "totalDevices" as const,
    label: "Devices",
    filter: null,
    icon: Server,
    accentClass: "hover:border-border",
    iconClass: "text-ink",
  },
  {
    key: "healthy" as const,
    label: "Healthy",
    filter: "healthy",
    icon: CheckCircle2,
    accentClass: "hover:border-emerald-500/30",
    iconClass: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "warning" as const,
    label: "Warning",
    filter: "warning",
    icon: AlertTriangle,
    accentClass: "hover:border-amber-500/30",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "critical" as const,
    label: "Critical",
    filter: "critical",
    icon: MinusCircle,
    accentClass: "hover:border-red-500/30",
    iconClass: "text-red-600 dark:text-red-400",
  },
] as const;

export function FleetSummaryGrid({
  summary,
  activeFilter = null,
  onFilterChange,
}: FleetSummaryGridProps) {
  return (
    <DashboardGrid
      gap="md"
      className="grid-cols-2 sm:grid-cols-3 xl:grid-cols-5"
    >
      {summaryConfig.map((config) => {
        const value = summary[config.key];
        const isActive = activeFilter === config.filter;
        const isTotal = config.filter === null;

        return (
          <FleetSummaryCard
            key={config.key}
            label={config.label}
            value={value}
            icon={config.icon}
            accentClass={config.accentClass}
            iconClass={config.iconClass}
            active={isActive}
            onClick={
              onFilterChange
                ? () =>
                    onFilterChange(
                      isTotal ? null : isActive ? null : config.filter,
                    )
                : undefined
            }
          />
        );
      })}

      <FleetSummaryCard
        label="Telemetry"
        value={MOCK_TELEMETRY_RATE}
        suffix="/sec"
        icon={Radio}
        accentClass="hover:border-link/30"
        iconClass="text-link"
      />
    </DashboardGrid>
  );
}
