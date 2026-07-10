"use client";

import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { cn } from "@/lib/utils";

type KpiStatCardProps = {
  label: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: LucideIcon;
  iconClassName: string;
  sparklineColor: string;
  sparklineData: number[];
  active?: boolean;
  onClick?: () => void;
};

export function KpiStatCard({
  label,
  value,
  suffix,
  subtitle,
  icon: Icon,
  iconClassName,
  sparklineColor,
  sparklineData,
  active = false,
  onClick,
}: KpiStatCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <DashboardCard
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (event) => handleInteractiveKeyDown(event, () => onClick?.())
          : undefined
      }
      className={cn(
        "flex flex-col overflow-hidden p-4",
        isInteractive && "cursor-pointer interactive-lift focus-ring",
        active && "ring-1 ring-border",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-mono text-[10px] font-medium uppercase tracking-wide text-mute">
          {label}
        </p>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-canvas-soft",
            iconClassName,
          )}
        >
          <Icon className="size-4" aria-hidden />
        </div>
      </div>

      <p className="mt-3 text-display-md font-semibold tracking-display-md text-ink tabular-nums">
        <AnimatedCounter value={value} />
        {suffix ? (
          <span className="ml-0.5 text-body-sm font-medium text-mute">{suffix}</span>
        ) : null}
      </p>

      <p className="mt-1 text-caption text-mute">{subtitle}</p>

      <div className="mt-3 -mx-1">
        <SparklineChart data={sparklineData} color={sparklineColor} />
      </div>
    </DashboardCard>
  );
}
