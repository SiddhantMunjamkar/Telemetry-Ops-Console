import Link from "next/link";
import { ArrowLeft, Server } from "lucide-react";
import type { Device } from "@/types/fleet";
import { DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeviceDetailHeaderProps = {
  device: Device;
};

export function DeviceDetailHeader({ device }: DeviceDetailHeaderProps) {
  const styles = DEVICE_STATUS_STYLES[device.status];

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 w-fit" asChild>
        <Link href="/devices">
          <ArrowLeft className="size-4" />
          Back to devices
        </Link>
      </Button>

      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-elevation-3 glass-panel sm:p-8",
          "before:absolute before:inset-y-0 before:left-0 before:w-1",
          device.status === "healthy" && "before:bg-emerald-500",
          device.status === "warning" && "before:bg-amber-500",
          device.status === "critical" && "before:bg-red-500",
          device.status === "offline" && "before:bg-zinc-400",
        )}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-canvas-soft",
                styles.accent,
              )}
            >
              <Server className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 space-y-2">
              <p className="font-mono text-caption uppercase tracking-wide text-mute">
                Equipment detail
              </p>
              <h1 className="text-display-md font-semibold tracking-display-md text-ink">
                {device.name}
              </h1>
              <p className="text-body-md text-body">{device.type}</p>
              <p className="font-mono text-caption text-mute">ID · {device.id}</p>
            </div>
          </div>
          <DeviceStatusBadge status={device.status} />
        </div>
      </div>
    </div>
  );
}
