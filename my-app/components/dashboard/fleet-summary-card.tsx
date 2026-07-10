"use client";

import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";

type FleetSummaryCardProps = {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  accentClass: string;
  iconClass: string;
  active?: boolean;
  onClick?: () => void;
};

export function FleetSummaryCard({
  label,
  value,
  suffix,
  icon: Icon,
  accentClass,
  iconClass,
  active = false,
  onClick,
}: FleetSummaryCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <DashboardCard
      data-stagger
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (event) => handleInteractiveKeyDown(event, () => onClick?.())
          : undefined
      }
      elevation="low"
      className={cn(
        "group relative overflow-hidden p-5 transition-all duration-300",
        "interactive-lift focus-ring",
        isInteractive && "cursor-pointer",
        active && "ring-1 ring-border shadow-elevation-3",
        accentClass,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-3">
          <p className="font-mono text-caption uppercase tracking-wide text-mute">
            {label}
          </p>
          <p className="text-display-md font-semibold tracking-display-md text-ink tabular-nums">
            <AnimatedCounter value={value} />
            {suffix ? (
              <span className="ml-1 text-body-sm font-medium text-mute">
                {suffix}
              </span>
            ) : null}
          </p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-sm border border-border bg-canvas-soft transition-transform duration-300 group-hover:scale-105",
            iconClass,
          )}
        >
          <Icon className="size-4" aria-hidden />
        </div>
      </div>
    </DashboardCard>
  );
}
