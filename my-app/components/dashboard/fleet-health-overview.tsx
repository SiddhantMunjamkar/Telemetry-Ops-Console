"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { Device, FleetSummary } from "@/types/fleet";
import {
  FLEET_DISTRIBUTION,
  computeFleetHealthScore,
  getFleetInsights,
} from "@/lib/telemetry/fleet-health";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { cn } from "@/lib/utils";

type FleetHealthOverviewProps = {
  summary: FleetSummary;
  devices: Device[];
};

export function FleetHealthOverview({
  summary,
  devices,
}: FleetHealthOverviewProps) {
  const healthScore = computeFleetHealthScore(devices);
  const insights = getFleetInsights(summary, devices);
  const total = summary.totalDevices || 1;

  return (
    <PremiumSurface className="flex h-full flex-col p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
            Overall health
          </p>
          <p className="mt-3 text-[48px] font-semibold leading-none tracking-tight text-ink tabular-nums">
            <AnimatedCounter value={healthScore} />
            <span className="text-2xl font-medium text-mute">%</span>
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-body-sm text-mute">
            <TrendingDown className="size-4 text-[var(--status-warning)]" />
            Down 3% from last hour
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
            Fleet status
          </p>
          <p className="mt-2 text-body-md font-medium text-ink">
            {summary.totalDevices} devices monitored
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
          Distribution
        </p>
        {FLEET_DISTRIBUTION.map((item) => {
          const count = summary[item.key];
          const width = `${Math.max((count / total) * 100, count > 0 ? 4 : 0)}%`;

          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="inline-flex items-center gap-2 text-body">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                    aria-hidden
                  />
                  {item.label}
                </span>
                <span className="font-medium tabular-nums text-ink">{count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-canvas-soft-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 space-y-3">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-mute">
          Insights
        </p>
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "flex items-start gap-2 rounded-xl px-4 py-3 text-body-sm",
              insight.tone === "critical" && "bg-red-500/5 text-ink",
              insight.tone === "warning" && "bg-amber-500/5 text-ink",
              insight.tone === "neutral" && "bg-canvas-soft text-body",
            )}
          >
            {insight.tone === "critical" ? (
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-[var(--status-critical)]" />
            ) : null}
            {insight.tone === "warning" ? (
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-[var(--status-warning)]" />
            ) : null}
            <span>{insight.message}</span>
          </div>
        ))}
      </div>
    </PremiumSurface>
  );
}
