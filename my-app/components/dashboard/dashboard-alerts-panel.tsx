"use client";

import { useState } from "react";
import type { FleetAlert, AlertSeverity } from "@/types/alerts";
import { ALERT_SEVERITY_LABELS } from "@/lib/constants/alert-severity";
import { formatRelativeTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { DashboardFeedEntry } from "@/components/dashboard/dashboard-feed-entry";
import { DashboardFeedPanel } from "@/components/dashboard/dashboard-feed-panel";
import { useAlerts } from "@/hooks/use-alerts";

const severityColor: Record<AlertSeverity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#22c55e",
};

type DashboardAlertsPanelProps = {
  limit?: number;
};

export function DashboardAlertsPanel({ limit = 4 }: DashboardAlertsPanelProps) {
  const { alerts, resolveAlert } = useAlerts({ activeOnly: true, limit });
  const [selected, setSelected] = useState<FleetAlert | null>(null);

  return (
    <>
      <div className="h-full">
      <DashboardFeedPanel title="Active Alerts" href="/alerts" className="h-full">
        {alerts.length === 0 ? (
          <p className="flex flex-1 items-center justify-center text-center text-[13px] text-mute">
            No active alerts. Fleet is operating normally.
          </p>
        ) : (
          <div className="grid flex-1 grid-rows-4 gap-5">
            {alerts.map((alert) => (
              <DashboardFeedEntry
                key={alert.id}
                dotColor={severityColor[alert.severity]}
                title={alert.deviceName}
                time={formatRelativeTime(alert.timestamp)}
                description={alert.description}
                footer={{
                  label: ALERT_SEVERITY_LABELS[alert.severity],
                  color: severityColor[alert.severity],
                }}
                onClick={() => setSelected(alert)}
                onKeyDown={(event) =>
                  handleInteractiveKeyDown(event, () => setSelected(alert))
                }
              />
            ))}
          </div>
        )}
      </DashboardFeedPanel>
      </div>

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
