"use client";

import { DevicesInventory } from "@/components/devices/devices-inventory";
import { PageHero } from "@/components/layout/page-hero";
import { PageLayout } from "@/components/pages/layouts/page-layout";
import { useFleet } from "@/hooks/use-fleet";

export function DevicesPageLayout() {
  const { devices, isLoading, isError } = useFleet();

  return (
    <PageLayout>
      <PageHero />
      {isLoading ? (
        <div className="py-12 text-body">Loading devices...</div>
      ) : isError ? (
        <div className="py-12 text-body">Unable to load devices.</div>
      ) : (
        <DevicesInventory devices={devices} />
      )}
    </PageLayout>
  );
}
