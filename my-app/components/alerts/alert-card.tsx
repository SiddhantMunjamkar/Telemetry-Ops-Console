import type { AlertStatus, FleetAlert } from "@/types/alerts";
import { ALERT_STATUS_LABELS } from "@/lib/constants/alert-severity";
import { ALERT_SEVERITY_STYLES } from "@/lib/constants/alert-severity";
import { formatChartTooltipTime } from "@/lib/format";
import { handleInteractiveKeyDown } from "@/lib/keyboard";
import { AlertSeverityBadge } from "@/components/alerts/alert-severity-badge";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AlertStatusBadgeProps = {
  status: AlertStatus;
  className?: string;
};

function resolveStatusVariant(status: AlertStatus) {
  switch (status) {
    case "open":
      return "destructive" as const;
    case "acknowledged":
      return "warning" as const;
    case "resolved":
      return "success" as const;
  }
}

export function AlertStatusBadge({ status, className }: AlertStatusBadgeProps) {
  return (
    <Badge variant={resolveStatusVariant(status)} className={className}>
      {ALERT_STATUS_LABELS[status]}
    </Badge>
  );
}

type AlertCardProps = {
  alert: FleetAlert;
  onClick?: (alert: FleetAlert) => void;
  compact?: boolean;
  className?: string;
};

export function AlertCard({
  alert,
  onClick,
  compact = false,
  className,
}: AlertCardProps) {
  const styles = ALERT_SEVERITY_STYLES[alert.severity];
  const isResolved = alert.status === "resolved";

  return (
    <article
      data-stagger
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(alert)}
      onKeyDown={(event) =>
        handleInteractiveKeyDown(event, () => onClick?.(alert))
      }
      className={cn(
        "group cursor-pointer overflow-hidden rounded-md border border-border bg-card shadow-elevation-2",
        "border-l-4 interactive-lift focus-ring",
        styles.border,
        isResolved && "opacity-70",
        className,
      )}
    >
      <div className={cn("space-y-3", compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="font-mono text-caption text-mute">{alert.deviceName}</p>
            <h3
              className={cn(
                "font-semibold text-ink",
                compact ? "text-body-sm" : "text-body-md",
              )}
            >
              {alert.title}
            </h3>
          </div>
          <AlertSeverityBadge severity={alert.severity} />
        </div>

        {!compact ? (
          <p className="line-clamp-2 text-body-sm text-body">
            {alert.description}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <AlertStatusBadge status={alert.status} />
          <time
            dateTime={alert.timestamp}
            className="font-mono text-caption text-mute"
          >
            {formatChartTooltipTime(alert.timestamp)}
          </time>
        </div>
      </div>
    </article>
  );
}
