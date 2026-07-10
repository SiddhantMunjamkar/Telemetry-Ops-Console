"use client";

import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { cn } from "@/lib/utils";

type HeroKpiCardProps = {
  label: string;
  value: number;
  suffix?: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  sparklineData: number[];
  showDot?: boolean;
  active?: boolean;
  onClick?: () => void;
};

export function HeroKpiCard({
  label,
  value,
  suffix,
  subtitle,
  icon: Icon,
  color,
  sparklineData,
  showDot = false,
  active = false,
  onClick,
}: HeroKpiCardProps) {
  const isInteractive = Boolean(onClick);

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (event) => handleInteractiveKeyDown(event, () => onClick?.())
          : undefined
      }
      className={cn(
        "flex h-[128px] flex-col justify-between rounded-xl border border-hairline bg-card p-4 transition-colors duration-200",
        isInteractive &&
          "cursor-pointer motion-safe:hover:border-hairline-strong motion-safe:hover:bg-canvas-soft-2",
        active && "border-hairline-strong bg-canvas-soft-2",
        isInteractive && "focus-ring",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {showDot ? (
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          ) : null}
          <span
            className="truncate text-[13px] font-medium leading-none"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <Icon className="size-[18px] shrink-0" style={{ color }} aria-hidden />
      </div>

      <div className="min-w-0">
        <p className="text-[36px] font-semibold leading-none tracking-tight text-ink tabular-nums">
          <AnimatedCounter value={value} locale />
          {suffix ? (
            <span className="ml-0.5 text-base font-medium text-mute">{suffix}</span>
          ) : null}
        </p>
        <p className="mt-1 truncate text-[13px] text-mute">{subtitle}</p>
      </div>

      <SparklineChart data={sparklineData} color={color} className="h-5" />
    </div>
  );
}
