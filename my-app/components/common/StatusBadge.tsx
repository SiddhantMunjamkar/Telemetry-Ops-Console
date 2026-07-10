import type { ConnectionStatus, Severity } from "@/types/telemetry";
import type { HealthStatus } from "@/lib/constants/severity";
import {
  CONNECTION_LABELS,
  HEALTH_LABELS,
  SEVERITY_LABELS,
} from "@/lib/constants/severity";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusBadgeProps = Omit<BadgeProps, "variant"> & {
  status: Severity | HealthStatus | ConnectionStatus;
};

function resolveVariant(
  status: Severity | HealthStatus | ConnectionStatus,
): BadgeProps["variant"] {
  switch (status) {
    case "healthy":
    case "connected":
    case "info":
      return "success";
    case "degraded":
    case "connecting":
    case "warning":
      return "warning";
    case "down":
    case "disconnected":
    case "error":
    case "critical":
      return "destructive";
    default:
      return "secondary";
  }
}

function resolveLabel(
  status: Severity | HealthStatus | ConnectionStatus,
): string {
  if (status in SEVERITY_LABELS) {
    return SEVERITY_LABELS[status as Severity];
  }
  if (status in HEALTH_LABELS) {
    return HEALTH_LABELS[status as HealthStatus];
  }
  return CONNECTION_LABELS[status as ConnectionStatus];
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant={resolveVariant(status)}
      className={cn("gap-1.5", className)}
      {...props}
    >
      {resolveLabel(status)}
    </Badge>
  );
}
