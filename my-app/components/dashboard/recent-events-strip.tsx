"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Info } from "lucide-react";
import type { EventType } from "@/types/events";
import { getMockEvents } from "@/lib/mock/events";
import { formatTimelineTime } from "@/lib/format";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const eventIcons: Record<EventType, typeof Info> = {
  alert_triggered: AlertCircle,
  alert_resolved: CheckCircle2,
  metric_threshold: AlertCircle,
  status_change: Info,
  maintenance: Info,
  device_online: CheckCircle2,
  device_offline: AlertCircle,
  configuration: Info,
  system: Info,
};

type RecentEventsStripProps = {
  limit?: number;
  className?: string;
};

export function RecentEventsStrip({
  limit = 6,
  className,
}: RecentEventsStripProps) {
  const events = useMemo(() => getMockEvents().slice(0, limit), [limit]);

  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-body-md font-semibold text-ink">Recent Events</h3>
        <Link
          href="/events"
          className="inline-flex items-center gap-1 text-caption font-medium text-link hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 pt-1">
        {events.map((event) => {
          const Icon = eventIcons[event.eventType] ?? Info;
          const isAlert =
            event.eventType === "alert_triggered" ||
            event.eventType === "metric_threshold";
          const isResolved = event.eventType === "alert_resolved";

          return (
            <DashboardCard
              key={event.id}
              className="w-[280px] shrink-0 p-4"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-md border border-border",
                    isAlert && "bg-red-500/10 text-red-600 dark:text-red-400",
                    isResolved && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                    !isAlert && !isResolved && "bg-canvas-soft text-mute",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <time
                    dateTime={event.timestamp}
                    className="font-mono text-caption tabular-nums text-mute"
                  >
                    {formatTimelineTime(event.timestamp)}
                  </time>
                  <p className="mt-1 line-clamp-2 text-body-sm leading-snug text-body">
                    {event.description}
                  </p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </section>
  );
}
