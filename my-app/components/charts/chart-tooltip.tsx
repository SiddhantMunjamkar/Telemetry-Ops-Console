"use client";

import { formatChartTooltipTime } from "@/lib/format";

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
  unit: string;
  metricLabel: string;
  decimals: number;
  colors: {
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
    tooltipMuted: string;
  };
};

export function ChartTooltipContent({
  active,
  payload,
  label,
  unit,
  metricLabel,
  decimals,
  colors,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const value = payload[0]?.value;
  const numericValue =
    typeof value === "number" ? value.toFixed(decimals) : String(value ?? "—");

  return (
    <div
      className="rounded-md border px-3 py-2 shadow-elevation-4"
      style={{
        backgroundColor: colors.tooltipBg,
        borderColor: colors.tooltipBorder,
        color: colors.tooltipText,
      }}
    >
      <p
        className="font-mono text-caption"
        style={{ color: colors.tooltipMuted }}
      >
        {formatChartTooltipTime(String(label))}
      </p>
      <p className="mt-1 text-body-sm font-semibold tabular-nums">
        {numericValue}
        <span
          className="ml-1 font-normal"
          style={{ color: colors.tooltipMuted }}
        >
          {unit}
        </span>
      </p>
      <p className="mt-0.5 text-caption" style={{ color: colors.tooltipMuted }}>
        {metricLabel}
      </p>
    </div>
  );
}
