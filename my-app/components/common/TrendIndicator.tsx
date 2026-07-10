import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "neutral";

type TrendIndicatorProps = {
  value: number;
  direction?: TrendDirection;
  suffix?: string;
  invertColors?: boolean;
  className?: string;
};

function resolveDirection(
  value: number,
  direction?: TrendDirection,
): TrendDirection {
  if (direction) return direction;
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
}

export function TrendIndicator({
  value,
  direction,
  suffix = "%",
  invertColors = false,
  className,
}: TrendIndicatorProps) {
  const trend = resolveDirection(value, direction);
  const formatted = `${value > 0 ? "+" : ""}${value.toFixed(1)}${suffix}`;

  const isPositive = trend === "up";
  const isNegative = trend === "down";
  const colorClass = invertColors
    ? isPositive
      ? "text-error"
      : isNegative
        ? "text-success"
        : "text-mute"
    : isPositive
      ? "text-success"
      : isNegative
        ? "text-error"
        : "text-mute";

  const Icon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-caption font-medium",
        colorClass,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {formatted}
    </span>
  );
}
