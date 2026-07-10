"use client";

import { useState } from "react";
import type { Device, DeviceStatus, FleetSummary } from "@/types/fleet";
import { PageHero } from "@/components/layout/page-hero";
import { DashboardActivityGrid } from "@/components/dashboard/dashboard-activity-grid";
import { DeviceStrip } from "@/components/dashboard/device-strip";
import { HeroKpiRow } from "@/components/dashboard/hero-kpi-row";
import { DeviceDetailModal } from "@/components/device/device-detail-modal";

type FleetOverviewProps = {
  devices: Device[];
  summary: FleetSummary;
};

export function FleetOverview({ devices, summary }: FleetOverviewProps) {
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  return (
    <div className="pb-8">
      <PageHero />

      <HeroKpiRow
        summary={summary}
        activeFilter={statusFilter}
        onFilterChange={(filter) => setStatusFilter(filter as DeviceStatus | null)}
      />

      <DeviceStrip
        devices={devices}
        filter={statusFilter}
        onFilterChange={setStatusFilter}
        onDeviceSelect={setSelectedDevice}
      />

      <DashboardActivityGrid />

      <DeviceDetailModal
        device={selectedDevice}
        open={selectedDevice !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDevice(null);
          }
        }}
      />
    </div>
  );
}
