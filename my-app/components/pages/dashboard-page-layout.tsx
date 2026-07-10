import type { Device, FleetSummary } from "@/types/fleet";
import { FleetOverview } from "@/components/dashboard/fleet-overview";

type DashboardPageLayoutProps = {
  devices: Device[];
  summary: FleetSummary;
};

export function DashboardPageLayout({
  devices,
  summary,
}: DashboardPageLayoutProps) {
  return <FleetOverview devices={devices} summary={summary} />;
}
