import type { HealthStatus } from "@/lib/constants/severity";
import { HEALTH_LABELS } from "@/lib/constants/severity";
import { StatusDot } from "@/components/common/StatusDot";
import { cn } from "@/lib/utils";

type HealthIndicatorProps = {
  status: HealthStatus;
  label?: string;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
};

export function HealthIndicator({
  status,
  label,
  showLabel = true,
  pulse = status === "healthy" || status === "degraded",
  className,
}: HealthIndicatorProps) {
  const displayLabel = label ?? HEALTH_LABELS[status];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <StatusDot status={status} pulse={pulse} label={displayLabel} />
      {showLabel ? (
        <span className="font-mono text-caption text-body">{displayLabel}</span>
      ) : null}
    </div>
  );
}
