"use client";

import { Server } from "lucide-react";
import type { Device, DeviceStatus } from "@/types/fleet";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerReveal } from "@/components/common/StaggerReveal";
import { DeviceCard } from "@/components/dashboard/device-card";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { cn } from "@/lib/utils";

type DeviceGridProps = {
  devices: Device[];
  filter?: DeviceStatus | null;
  className?: string;
};

export function DeviceGrid({ devices, filter = null, className }: DeviceGridProps) {
  const visibleDevices = filter
    ? devices.filter((device) => device.status === filter)
    : devices;

  if (visibleDevices.length === 0) {
    return (
      <EmptyState
        icon={Server}
        title="No devices found"
        description="Nothing matches the current filter. Reset the filter to view the full fleet inventory."
        className={className}
      />
    );
  }

  return (
    <StaggerReveal className={className}>
      <DashboardGrid
        gap="md"
        className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
      >
        {visibleDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </DashboardGrid>
    </StaggerReveal>
  );
}
