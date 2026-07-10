import type { DeviceTelemetryPoint } from "@/types/device-telemetry";
import { METRIC_CHART_ORDER } from "@/lib/constants/metric-charts";
import { MetricTrendChart } from "@/components/charts/metric-trend-chart";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

type MetricChartGridProps = {
  data: DeviceTelemetryPoint[];
};

export function MetricChartGrid({ data }: MetricChartGridProps) {
  return (
    <DashboardGrid gap="md" className="grid-cols-1 xl:grid-cols-2">
      {METRIC_CHART_ORDER.map((metric) => (
        <MetricTrendChart key={metric} data={data} metric={metric} />
      ))}
    </DashboardGrid>
  );
}
