"use client";

import { DashboardPageLayout } from "@/components/pages/dashboard-page-layout";
import { useFleet } from "@/hooks/use-fleet";

export function DashboardPageClient() {
  const { devices, summary, isLoading, isError } = useFleet();

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-body">
        Loading fleet dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-body">
        Unable to load fleet data. Is the backend running on port 3001?
      </div>
    );
  }

  return <DashboardPageLayout devices={devices} summary={summary} />;
}
