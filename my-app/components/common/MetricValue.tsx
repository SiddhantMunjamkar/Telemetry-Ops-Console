"use client";

import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { cn } from "@/lib/utils";

type MetricValueProps = {
  value: number;
  unit?: string;
  label?: string;
  decimals?: number;
  animate?: boolean;
  className?: string;
};

export function MetricValue({
  value,
  unit,
  label,
  decimals = 0,
  animate = true,
  className,
}: MetricValueProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {label ? (
        <p className="font-mono text-caption uppercase tracking-wide text-mute">
          {label}
        </p>
      ) : null}
      <p className="flex items-baseline gap-1 text-display-md font-semibold tracking-display-md text-ink tabular-nums">
        {animate ? (
          <AnimatedCounter value={value} decimals={decimals} />
        ) : (
          <span>{value.toFixed(decimals)}</span>
        )}
        {unit ? (
          <span className="text-body-sm font-medium text-mute">{unit}</span>
        ) : null}
      </p>
    </div>
  );
}
