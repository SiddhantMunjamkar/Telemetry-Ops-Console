"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { AlertFeedItem } from "@/components/alerts/alert-feed-item";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { useAlertsStore } from "@/stores/alerts-store";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type DeviceAlertHistoryProps = {
  deviceId: string;
  className?: string;
};

export function DeviceAlertHistory({
  deviceId,
  className,
}: DeviceAlertHistoryProps) {
  const allAlerts = useAlertsStore((state) => state.alerts);

  const alerts = useMemo(
    () =>
      allAlerts
        .filter((alert) => alert.deviceId === deviceId)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .slice(0, 5),
    [allAlerts, deviceId],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {alerts.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No alert history"
          description="This device has no recorded incidents in the mock dataset."
          className="py-8"
        />
      ) : (
        alerts.map((alert) => (
          <AlertFeedItem key={alert.id} alert={alert} />
        ))
      )}

      <Button variant="outline" size="sm" asChild>
        <Link href="/alerts">
          View all alerts
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
