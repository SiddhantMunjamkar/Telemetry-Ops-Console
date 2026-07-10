"use client";

import { useMemo, useState } from "react";
import type { AlertSeverity, FleetAlert } from "@/types/alerts";
import { ALERT_SEVERITY_LABELS, ALERT_SEVERITY_STYLES } from "@/lib/constants/alert-severity";
import { formatRelativeTime } from "@/lib/format";
import { deviceSurfaceClass } from "@/lib/constants/device-detail";
import { useAlertsStore } from "@/stores/alerts-store";
import { cn } from "@/lib/utils";

type FilterKey = "all" | AlertSeverity | "resolved";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "medium", label: "Warning" },
  { key: "resolved", label: "Resolved" },
];

type DeviceIncidentTableProps = {
  deviceId: string;
};

function formatDuration(alert: FleetAlert): string {
  if (alert.status === "resolved") return "2h 14m";
  const started = new Date(alert.timestamp).getTime();
  const diffMinutes = Math.max(1, Math.floor((Date.now() - started) / 60_000));
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const hours = Math.floor(diffMinutes / 60);
  const mins = diffMinutes % 60;
  return `${hours}h ${mins}m`;
}

export function DeviceIncidentTable({ deviceId }: DeviceIncidentTableProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const allAlerts = useAlertsStore((state) => state.alerts);

  const alerts = useMemo(() => {
    const deviceAlerts = allAlerts
      .filter((alert) => alert.deviceId === deviceId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

    if (filter === "resolved") {
      return deviceAlerts.filter((alert) => alert.status === "resolved");
    }
    if (filter === "all") return deviceAlerts;
    if (filter === "medium") {
      return deviceAlerts.filter(
        (alert) => alert.severity === "medium" || alert.severity === "high",
      );
    }
    return deviceAlerts.filter((alert) => alert.severity === filter);
  }, [allAlerts, deviceId, filter]);

  return (
    <div className={cn(deviceSurfaceClass, "overflow-hidden p-0")}>
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline px-5 py-3">
        {FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "rounded-md px-2.5 py-1 text-[12px] font-medium transition-colors",
              filter === item.key
                ? "bg-canvas-soft-2 text-ink"
                : "text-mute hover:text-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-hairline text-[11px] uppercase tracking-[0.14em] text-mute">
              <th className="px-5 py-3 font-medium">Severity</th>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Started</th>
              <th className="px-5 py-3 font-medium">Resolved</th>
              <th className="px-5 py-3 font-medium">Duration</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Operator</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-mute">
                  No incidents match this filter.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const styles = ALERT_SEVERITY_STYLES[alert.severity];
                return (
                  <tr
                    key={alert.id}
                    className="border-b border-hairline/60 transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <span className={cn("font-medium", styles.accent)}>
                        {ALERT_SEVERITY_LABELS[alert.severity]}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-ink">{alert.title}</td>
                    <td className="px-5 py-3 text-mute">
                      {formatRelativeTime(alert.timestamp)}
                    </td>
                    <td className="px-5 py-3 text-mute">
                      {alert.status === "resolved" ? "Resolved" : "—"}
                    </td>
                    <td className="px-5 py-3 tabular-nums text-body">
                      {formatDuration(alert)}
                    </td>
                    <td className="px-5 py-3 capitalize text-body">{alert.status}</td>
                    <td className="px-5 py-3 text-mute">System</td>
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        className="font-medium text-link hover:text-link-deep"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
