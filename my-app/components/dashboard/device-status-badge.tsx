import type { DeviceStatus } from "@/types/fleet";
import {
  DEVICE_STATUS_LABELS,
  DEVICE_STATUS_STYLES,
} from "@/lib/constants/device-status";
import { StatusDot } from "@/components/common/StatusDot";
import { cn } from "@/lib/utils";

type DeviceStatusBadgeProps = {
  status: DeviceStatus;
  showDot?: boolean;
  className?: string;
};

export function DeviceStatusBadge({
  status,
  showDot = true,
  className,
}: DeviceStatusBadgeProps) {
  const styles = DEVICE_STATUS_STYLES[status];

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
          status={status}
          size="sm"
          pulse={status === "critical" || status === "warning"}
          className={styles.dot}
        />
      ) : null}
      {DEVICE_STATUS_LABELS[status]}
    </span>
  );
}
