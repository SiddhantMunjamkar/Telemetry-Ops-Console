"use client";

import type { Device, DeviceStatus } from "@/types/fleet";
import { PremiumDeviceCard } from "@/components/dashboard/premium-device-card";

const STATUS_ORDER: Record<DeviceStatus, number> = {
  critical: 0,
  warning: 1,
  offline: 2,
  healthy: 3,
};

type PremiumDeviceGridProps = {
  devices: Device[];
  filter?: DeviceStatus | null;
};

export function PremiumDeviceGrid({
  devices,
  filter = null,
}: PremiumDeviceGridProps) {
  const visible = (filter ? devices.filter((d) => d.status === filter) : devices)
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  if (visible.length === 0) {
    return (
      <p className="py-16 text-center text-body-md text-mute">
        No devices match the current filter.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visible.map((device) => (
        <PremiumDeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
