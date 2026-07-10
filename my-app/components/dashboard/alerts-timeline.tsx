"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FleetAlert } from "@/types/alerts";
import { ALERT_SEVERITY_LABELS, ALERT_SEVERITY_STYLES } from "@/lib/constants/alert-severity";
import { formatRelativeTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { PremiumSurface } from "@/components/dashboard/premium-surface";
import { StatusDot } from "@/components/common/StatusDot";
import { useAlerts } from "@/hooks/use-alerts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const dotMap = {
  critical: "critical",
  high: "critical",
  medium: "warning",
  low: "healthy",
} as const;

type AlertsTimelineProps = {
  limit?: number;
};

export function AlertsTimeline({ limit = 4 }: AlertsTimelineProps) {
  const { alerts, resolveAlert } = useAlerts({ activeOnly: true, limit });
  const [selected, setSelected] = useState<FleetAlert | null>(null);

  return (
    <>
      <PremiumSurface className="flex h-full flex-col p-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h3 className="text-body-md font-semibold text-ink">Active Alerts</h3>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-caption font-medium text-mute transition-colors hover:text-ink"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {alerts.length === 0 ? (
          <p className="py-12 text-center text-body-sm text-mute">
            No active alerts. Fleet is operating normally.
          </p>
        ) : (
          <div className="relative space-y-0">
            {alerts.map((alert, index) => {
              const styles = ALERT_SEVERITY_STYLES[alert.severity];
              const isLast = index === alerts.length - 1;

              return (
                <div key={alert.id} className="relative flex gap-4 pb-8">
                  <div className="relative flex flex-col items-center">
                    <StatusDot
                      status={dotMap[alert.severity]}
                      className="mt-1 size-2.5 shrink-0"
                    />
                    {!isLast ? (
                      <span
                        className="absolute top-4 h-[calc(100%+8px)] w-px bg-hairline"
                        aria-hidden
                      />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(alert)}
                    onKeyDown={(event) =>
                      handleInteractiveKeyDown(event, () => setSelected(alert))
                    }
                    className="min-w-0 flex-1 pb-1 text-left focus-ring rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-body-sm text-ink">
                        {alert.deviceName}
                      </p>
                      <span className="shrink-0 font-mono text-caption text-mute">
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-body-sm leading-relaxed text-body">
                      {alert.description}
                    </p>
                    <p className={cn("mt-2 text-caption font-medium", styles.accent)}>
                      {ALERT_SEVERITY_LABELS[alert.severity]}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </PremiumSurface>

      <AlertDetailsModal
        alert={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onResolve={(id) => {
          resolveAlert(id);
          setSelected(null);
        }}
      />
    </>
  );
}
