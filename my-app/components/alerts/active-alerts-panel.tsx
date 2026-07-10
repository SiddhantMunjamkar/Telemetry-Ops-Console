"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import type { FleetAlert } from "@/types/alerts";
import { AlertDetailsModal } from "@/components/alerts/alert-details-modal";
import { AlertFeedItem } from "@/components/alerts/alert-feed-item";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAlerts } from "@/hooks/use-alerts";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ActiveAlertsPanelProps = {
  limit?: number;
  className?: string;
};

export function ActiveAlertsPanel({
  limit = 5,
  className,
}: ActiveAlertsPanelProps) {
  const { alerts, resolveAlert } = useAlerts({ activeOnly: true, limit });
  const [selectedAlert, setSelectedAlert] = useState<FleetAlert | null>(null);

  return (
    <>
      <div className={cn("flex flex-col", className)}>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No active alerts"
              description="All incidents are resolved. The fleet is operating normally."
              className="py-10"
            />
          ) : (
            alerts.map((alert) => (
              <AlertFeedItem
                key={alert.id}
                alert={alert}
                onClick={setSelectedAlert}
              />
            ))
          )}
        </div>

        <div className="mt-5 border-t border-border pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/alerts">
              View all alerts
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <AlertDetailsModal
        alert={selectedAlert}
        open={selectedAlert !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedAlert(null);
        }}
        onResolve={(id) => {
          resolveAlert(id);
          setSelectedAlert(null);
        }}
      />
    </>
  );
}
