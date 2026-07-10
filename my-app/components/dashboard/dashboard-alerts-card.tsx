"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FleetAlert } from "@/types/alerts";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { ALERT_SEVERITY_LABELS, ALERT_SEVERITY_STYLES } from "@/lib/constants/alert-severity";
import { formatRelativeTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { StatusDot } from "@/components/common/StatusDot";
import { useAlerts } from "@/hooks/use-alerts";
import { useState } from "react";
import { cn } from "@/lib/utils";

const severityDot = {
  critical: "critical",
  high: "critical",
  medium: "warning",
  low: "healthy",
} as const;

type DashboardAlertsCardProps = {
  limit?: number;
  className?: string;
};

export function DashboardAlertsCard({
  limit = 3,
  className,
}: DashboardAlertsCardProps) {
  const { alerts, resolveAlert } = useAlerts({ activeOnly: true, limit });
  const [selectedAlert, setSelectedAlert] = useState<FleetAlert | null>(null);

  return (
    <>
      <DashboardCard className={cn("flex h-full flex-col p-5", className)}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-body-md font-semibold text-ink">Active Alerts</h3>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-caption font-medium text-link hover:underline"
          >
            View all
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {alerts.length === 0 ? (
            <p className="py-8 text-center text-body-sm text-mute">
              No active alerts — fleet is healthy.
            </p>
          ) : (
            alerts.map((alert) => {
              const styles = ALERT_SEVERITY_STYLES[alert.severity];
              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={() => setSelectedAlert(alert)}
                  onKeyDown={(event) =>
                    handleInteractiveKeyDown(event, () => setSelectedAlert(alert))
                  }
                  className={cn(
                    "w-full rounded-lg border border-border bg-canvas-soft/50 p-3 text-left transition-colors hover:bg-canvas-soft focus-ring",
                    styles.border,
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <StatusDot
                      status={severityDot[alert.severity]}
                      className="mt-1.5 size-2 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-body-sm text-ink">
                          {alert.deviceName}
                        </p>
                        <span className="shrink-0 font-mono text-caption text-mute">
                          {formatRelativeTime(alert.timestamp)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-caption leading-relaxed text-body">
                        {alert.description}
                      </p>
                      <p className={cn("mt-1.5 text-caption font-medium", styles.accent)}>
                        {ALERT_SEVERITY_LABELS[alert.severity]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </DashboardCard>

      <AlertDetailsModal
        alert={selectedAlert}
        open={selectedAlert !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAlert(null);
        }}
        onResolve={(id) => {
          resolveAlert(id);
          setSelectedAlert(null);
        }}
      />
    </>
  );
}
