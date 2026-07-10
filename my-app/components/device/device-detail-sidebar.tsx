"use client";

import Link from "next/link";
import {
  Battery,
  Cpu,
  HardDrive,
  RefreshCw,
  Settings,
  ShieldAlert,
  Wifi,
  Wrench,
} from "lucide-react";
import type { Device } from "@/types/fleet";
import type { DeviceMetadata } from "@/lib/mock/device-metadata";
import { DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { deviceSurfaceClass } from "@/lib/constants/device-detail";
import { useAlertsStore } from "@/stores/alerts-store";
import { ALERT_SEVERITY_LABELS } from "@/lib/constants/alert-severity";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type DeviceDetailSidebarProps = {
  device: Device;
  metadata: DeviceMetadata;
};

function SidebarBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(deviceSurfaceClass, "space-y-3")}>
      <h3 className="text-[13px] font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

export function DeviceDetailSidebar({ device, metadata }: DeviceDetailSidebarProps) {
  const styles = DEVICE_STATUS_STYLES[device.status];
  const allAlerts = useAlertsStore((state) => state.alerts);

  const recentAlerts = useMemo(
    () =>
      allAlerts
        .filter((alert) => alert.deviceId === device.id && alert.status !== "resolved")
        .slice(0, 3),
    [allAlerts, device.id],
  );

  return (
    <aside className="space-y-5 xl:sticky xl:top-6 xl:w-[340px] xl:shrink-0">
      <SidebarBlock title="Device Status">
        <div className="space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-mute">Status</span>
            <span className={cn("font-medium capitalize", styles.accent)}>
              {device.status}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-mute">Health</span>
            <span className="font-semibold tabular-nums text-ink">
              {device.healthScore}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-mute">Uptime</span>
            <span className="font-medium tabular-nums text-ink">
              {metadata.uptimePercent}%
            </span>
          </div>
        </div>
      </SidebarBlock>

      <SidebarBlock title="Quick Actions">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-8 justify-start gap-1.5 rounded-lg text-[12px]">
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="h-8 justify-start gap-1.5 rounded-lg text-[12px]">
            <Wrench className="size-3.5" />
            Maintain
          </Button>
          <Button variant="outline" size="sm" className="h-8 justify-start gap-1.5 rounded-lg text-[12px]">
            <Settings className="size-3.5" />
            Configure
          </Button>
          <Button variant="outline" size="sm" className="h-8 justify-start gap-1.5 rounded-lg text-[12px]" asChild>
            <Link href="/alerts">
              <ShieldAlert className="size-3.5" />
              Alerts
            </Link>
          </Button>
        </div>
      </SidebarBlock>

      <SidebarBlock title="Recent Alerts">
        {recentAlerts.length === 0 ? (
          <p className="text-[12px] text-mute">No active alerts.</p>
        ) : (
          <ul className="space-y-2">
            {recentAlerts.map((alert) => (
              <li key={alert.id} className="text-[12px]">
                <p className="font-medium text-ink">{alert.title}</p>
                <p className="text-mute">{ALERT_SEVERITY_LABELS[alert.severity]}</p>
              </li>
            ))}
          </ul>
        )}
      </SidebarBlock>

      <SidebarBlock title="Connected Sensors">
        <div className="flex items-center gap-2 text-[13px]">
          <Cpu className="size-4 text-mute" />
          <span className="font-medium text-ink">{metadata.sensorCount} sensors active</span>
        </div>
      </SidebarBlock>

      <SidebarBlock title="Network Status">
        <div className="space-y-3 text-[12px]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-mute">
              <Wifi className="size-3.5" />
              Connection
            </span>
            <span className="font-medium text-ink">
              {device.status === "offline" ? "Offline" : "Connected"}
            </span>
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-mute">Quality</span>
              <span className="font-medium tabular-nums text-ink">
                {metadata.connectionQuality}%
              </span>
            </div>
            <Progress value={metadata.connectionQuality} className="h-1.5" />
          </div>
        </div>
      </SidebarBlock>

      <SidebarBlock title="Firmware">
        <p className="font-mono text-[12px] text-ink">{metadata.firmware}</p>
      </SidebarBlock>

      <SidebarBlock title="Battery">
        <div className="flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-mute">
            <Battery className="size-3.5" />
            Charge
          </span>
          <span className="font-medium tabular-nums text-ink">
            {metadata.batteryPercent}%
          </span>
        </div>
        <Progress value={metadata.batteryPercent} className="mt-2 h-1.5" />
      </SidebarBlock>

      <SidebarBlock title="Storage">
        <div className="flex items-center justify-between text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-mute">
            <HardDrive className="size-3.5" />
            Used
          </span>
          <span className="font-medium tabular-nums text-ink">
            {metadata.storagePercent}%
          </span>
        </div>
        <Progress value={metadata.storagePercent} className="mt-2 h-1.5" />
      </SidebarBlock>
    </aside>
  );
}
