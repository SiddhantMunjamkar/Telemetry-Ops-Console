import type { AlertSeverity } from "@/types/alerts";
import {
  ALERT_SEVERITY_LABELS,
  ALERT_SEVERITY_STYLES,
} from "@/lib/constants/alert-severity";
import { StatusDot } from "@/components/common/StatusDot";
import { cn } from "@/lib/utils";

type AlertSeverityBadgeProps = {
  severity: AlertSeverity;
  showDot?: boolean;
  className?: string;
};

export function AlertSeverityBadge({
  severity,
  showDot = true,
  className,
}: AlertSeverityBadgeProps) {
  const styles = ALERT_SEVERITY_STYLES[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-caption font-medium",
        styles.badge,
        className,
      )}
    >
      {showDot ? (
        <StatusDot
          status={
            severity === "critical"
              ? "critical"
              : severity === "high"
                ? "error"
                : severity === "medium"
                  ? "warning"
                  : "unknown"
          }
          size="sm"
          pulse={severity === "critical" || severity === "high"}
          className={styles.dot}
        />
      ) : null}
      {ALERT_SEVERITY_LABELS[severity]}
    </span>
  );
}
