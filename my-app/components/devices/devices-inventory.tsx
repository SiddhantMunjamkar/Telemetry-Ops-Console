"use client";

import { useMemo, useState } from "react";
import type { Device } from "@/types/fleet";
import {
  type DeviceSort,
  type DeviceStatusFilter,
  getSortedFilteredDevices,
} from "@/lib/device-inventory";
import { DeviceGrid } from "@/components/dashboard/device-grid";
import { DevicesToolbar } from "@/components/devices/devices-toolbar";
import { PageSection } from "@/components/pages/layouts/page-section";

type DevicesInventoryProps = {
  devices: Device[];
};

export function DevicesInventory({ devices }: DevicesInventoryProps) {
  const [statusFilter, setStatusFilter] = useState<DeviceStatusFilter>("all");
  const [sort, setSort] = useState<DeviceSort>("name-asc");

  const visibleDevices = useMemo(
    () => getSortedFilteredDevices(devices, statusFilter, sort),
    [devices, statusFilter, sort],
  );

  return (
    <PageSection
      title="All devices"
      description="Select a device to open its equipment detail screen."
      action={
        <DevicesToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sort={sort}
          onSortChange={setSort}
        />
      }
    >
      <DeviceGrid devices={visibleDevices} />
    </PageSection>
  );
}
