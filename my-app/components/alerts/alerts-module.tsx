"use client";

import { useState } from "react";
import { useMemo } from "react";
import { ShieldAlert } from "lucide-react";
import type { FleetAlert } from "@/types/alerts";
import { AlertCard } from "@/components/alerts/alert-card";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { AlertsToolbar } from "@/components/alerts/alerts-toolbar";
import { EmptyState } from "@/components/common/EmptyState";
import { StaggerReveal } from "@/components/common/StaggerReveal";
import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { FleetSummaryCard } from "@/components/dashboard/fleet-summary-card";
import { PageHero } from "@/components/layout/page-hero";
import { PageLayout } from "@/components/pages/layouts/page-layout";
import { PageSection } from "@/components/pages/layouts/page-section";
import { useAlerts } from "@/hooks/use-alerts";
import {
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";

export function AlertsModule() {
  const {
    alerts,
    allAlerts,
    search,
    setSearch,
    severityFilter,
    setSeverityFilter,
    sort,
    setSort,
    resolveAlert,
    activeCount,
  } = useAlerts();

  const [selectedAlert, setSelectedAlert] = useState<FleetAlert | null>(null);

  const summary = useMemo(() => {
    const active = allAlerts.filter((a) => a.status !== "resolved");
    return {
      active: activeCount,
      critical: active.filter((a) => a.severity === "critical").length,
      high: active.filter((a) => a.severity === "high").length,
      resolved: allAlerts.filter((a) => a.status === "resolved").length,
    };
  }, [allAlerts, activeCount]);

  return (
    <>
      <PageLayout>
        <PageHero />

        <AlertsToolbar
          search={search}
          onSearchChange={setSearch}
          severityFilter={severityFilter}
          onSeverityFilterChange={setSeverityFilter}
          sort={sort}
          onSortChange={setSort}
        />

        <PageSection title="Summary" action={null}>
          <StaggerReveal>
            <DashboardGrid gap="md" className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            <FleetSummaryCard
              label="Active alerts"
              value={summary.active}
              icon={ShieldAlert}
              accentClass="hover:border-border"
              iconClass="text-ink"
            />
            <FleetSummaryCard
              label="Critical"
              value={summary.critical}
              icon={MinusCircle}
              accentClass="hover:border-red-500/30"
              iconClass="text-red-600 dark:text-red-400"
            />
            <FleetSummaryCard
              label="High"
              value={summary.high}
              icon={AlertTriangle}
              accentClass="hover:border-orange-500/30"
              iconClass="text-orange-600 dark:text-orange-400"
            />
            <FleetSummaryCard
              label="Resolved"
              value={summary.resolved}
              icon={CheckCircle2}
              accentClass="hover:border-emerald-500/30"
              iconClass="text-emerald-600 dark:text-emerald-400"
            />
          </DashboardGrid>
          </StaggerReveal>
        </PageSection>

        <PageSection
          title="All alerts"
          description={`${alerts.length} alert${alerts.length === 1 ? "" : "s"} matching your filters.`}
          action={null}
        >
          {alerts.length === 0 ? (
            <EmptyState
              icon={ShieldAlert}
              title="No alerts found"
              description="Try adjusting your search or severity filter to find matching incidents."
            />
          ) : (
            <StaggerReveal>
              <DashboardGrid gap="md" className="grid-cols-1 lg:grid-cols-2">
                {alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onClick={setSelectedAlert}
                  />
                ))}
              </DashboardGrid>
            </StaggerReveal>
          )}
        </PageSection>
      </PageLayout>

      <AlertDetailsModal
        alert={selectedAlert}
        open={selectedAlert !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAlert(null);
        }}
        onResolve={resolveAlert}
      />
    </>
  );
}
