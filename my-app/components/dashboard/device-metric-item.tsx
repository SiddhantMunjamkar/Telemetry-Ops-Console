import { formatMetricValue } from "@/lib/format";
import { cn } from "@/lib/utils";

type DeviceMetricItemProps = {
  label: string;
  value: number;
  unit: string;
  offline?: boolean;
  className?: string;
};

export function DeviceMetricItem({
  label,
  value,
  unit,
  offline = false,
  className,
}: DeviceMetricItemProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="font-mono text-caption uppercase tracking-wide text-mute">
        {label}
      </p>
      <p className="text-body-sm font-medium tabular-nums text-ink">
        {offline ? (
          <span className="text-mute">—</span>
        ) : (
          <>
            {formatMetricValue(value)}
            <span className="ml-0.5 text-caption font-normal text-mute">
              {unit}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
