"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { FleetAlert } from "@/types/alerts";
import {
  ALERT_SEVERITY_LABELS,
  ALERT_STATUS_LABELS,
} from "@/lib/constants/alert-severity";
import { formatChartTooltipTime } from "@/lib/format";
import { AlertSeverityBadge } from "@/components/alerts/alert-severity-badge";
import { AlertStatusBadge } from "@/components/alerts/alert-card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type AlertDetailsModalProps = {
  alert: FleetAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (id: string) => void;
};

export function AlertDetailsModal({
  alert,
  open,
  onOpenChange,
  onResolve,
}: AlertDetailsModalProps) {
  if (!alert) {
    return null;
  }

  const isResolved = alert.status === "resolved";

  const handleResolve = () => {
    onResolve(alert.id);
    toast.success("Alert resolved", {
      description: `${alert.title} has been marked as resolved.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{alert.title}</DialogTitle>
          <DialogDescription>
            Incident details for {alert.deviceName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <AlertSeverityBadge severity={alert.severity} />
            <AlertStatusBadge status={alert.status} />
          </div>

          <Separator />

          <dl className="grid gap-3 text-body-sm">
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <dt className="font-mono text-caption uppercase tracking-wide text-mute">
                Device
              </dt>
              <dd className="text-ink">
                <Link
                  href={`/devices/${alert.deviceId}`}
                  className="font-medium text-link hover:underline"
                >
                  {alert.deviceName}
                </Link>
              </dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <dt className="font-mono text-caption uppercase tracking-wide text-mute">
                Severity
              </dt>
              <dd className="text-ink">
                {ALERT_SEVERITY_LABELS[alert.severity]}
              </dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <dt className="font-mono text-caption uppercase tracking-wide text-mute">
                Status
              </dt>
              <dd className="text-ink">{ALERT_STATUS_LABELS[alert.status]}</dd>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <dt className="font-mono text-caption uppercase tracking-wide text-mute">
                Timestamp
              </dt>
              <dd className="font-mono text-body">
                {formatChartTooltipTime(alert.timestamp)}
              </dd>
            </div>
          </dl>

          <Separator />

          <div className="space-y-2">
            <p className="font-mono text-caption uppercase tracking-wide text-mute">
              Description
            </p>
            <p className="text-body-md leading-relaxed text-body">
              {alert.description}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!isResolved ? (
            <Button onClick={handleResolve}>
              <CheckCircle2 className="size-4" />
              Resolve
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
