import type { FleetAlert } from "@/types/alerts";
import { ALERT_SEVERITY_LABELS, ALERT_SEVERITY_STYLES } from "@/lib/constants/alert-severity";
import { formatRelativeTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { StatusDot } from "@/components/common/StatusDot";
import { cn } from "@/lib/utils";

type AlertFeedItemProps = {
  alert: FleetAlert;
  onClick?: (alert: FleetAlert) => void;
  className?: string;
};

const severityToStatus = {
  critical: "critical",
  high: "critical",
  medium: "warning",
  low: "healthy",
} as const;

export function AlertFeedItem({ alert, onClick, className }: AlertFeedItemProps) {
  const styles = ALERT_SEVERITY_STYLES[alert.severity];
  const dotStatus = severityToStatus[alert.severity];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(alert)}
      onKeyDown={(event) =>
        handleInteractiveKeyDown(event, () => onClick?.(alert))
      }
      className={cn(
        "cursor-pointer rounded-lg border border-border bg-card p-4 shadow-elevation-1 transition-colors duration-200",
        "hover:border-border hover:bg-canvas-soft/50 focus-ring",
        styles.border,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <StatusDot status={dotStatus} className="mt-1.5 size-2.5 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <h3 className="text-body-md font-semibold text-ink">
              {alert.deviceName}
            </h3>
            <p className="mt-1 text-body-sm leading-relaxed text-body">
              {alert.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-caption text-mute">
            <span>
              Severity:{" "}
              <span className={cn("font-medium", styles.accent)}>
                {ALERT_SEVERITY_LABELS[alert.severity]}
              </span>
            </span>
            <span>Started {formatRelativeTime(alert.timestamp)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
