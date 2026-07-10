"use client";

import { notFound } from "next/navigation";
import type { Device } from "@/types/fleet";
import { METRIC_CHART_ORDER } from "@/lib/constants/metric-charts";
import { getDeviceMetadata } from "@/lib/mock/device-metadata";
import { useDevice, useDeviceHistory } from "@/hooks/use-device";
import { DeviceMetricChartCard } from "@/components/charts/device-metric-chart-card";
import { DeviceDetailPageHeader } from "@/components/device/device-detail-page-header";
import { DeviceDetailShell } from "@/components/device/device-detail-shell";
import { DeviceHeroCard } from "@/components/device/device-hero-card";
import { DeviceIncidentTable } from "@/components/device/device-incident-table";
import { DeviceKpiStrip } from "@/components/device/device-kpi-strip";

type DeviceDetailViewProps = {
  deviceId: string;
};

export function DeviceDetailView({ deviceId }: DeviceDetailViewProps) {
  const deviceQuery = useDevice(deviceId);
  const historyQuery = useDeviceHistory(deviceId);

  if (deviceQuery.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-body">
        Loading device telemetry...
      </div>
    );
  }

  if (deviceQuery.isError || !deviceQuery.data) {
    notFound();
  }

  const device: Device = deviceQuery.data;
  const metadata = getDeviceMetadata(device);
  const historyPoints = historyQuery.data?.points ?? [];

  return (
    <DeviceDetailShell>
      <DeviceDetailPageHeader device={device} />

      <DeviceHeroCard device={device} metadata={metadata} />

      <DeviceKpiStrip device={device} metadata={metadata} />

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-ink">Historical Charts</h2>
          <p className="mt-1 text-[14px] text-body">
            Temperature, pressure, power, and vibration — live with the latest 100 points.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {METRIC_CHART_ORDER.map((metric) => (
            <DeviceMetricChartCard
              key={metric}
              data={historyPoints}
              metric={metric}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-ink">Alert History</h2>
          <p className="mt-1 text-[14px] text-body">
            Incidents and warnings recorded for this device.
          </p>
        </div>
        <DeviceIncidentTable deviceId={device.id} />
      </section>
    </DeviceDetailShell>
  );
}
