"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
  locale?: boolean;
};

export function AnimatedCounter({
  value,
  decimals = 0,
  duration = 0.6,
  className,
  locale = false,
}: AnimatedCounterProps) {
  const display = useAnimatedCounter(value, { decimals, duration });
  const formatted = locale
    ? Number(display).toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : display;

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {formatted}
    </span>
  );
}
