"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { getMockEvents } from "@/lib/mock/events";
import { formatTimelineTime } from "@/lib/format";
import { EVENT_TYPE_STYLES } from "@/lib/constants/event-types";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type RecentEventsPanelProps = {
  limit?: number;
  className?: string;
};

export function RecentEventsPanel({
  limit = 6,
  className,
}: RecentEventsPanelProps) {
  const events = useMemo(() => getMockEvents().slice(0, limit), [limit]);

  return (
    <div className={cn("flex flex-col", className)}>
      {events.length === 0 ? (
        <EmptyState
          title="No recent events"
          description="Operational events will appear here as they occur across the fleet."
          className="py-10"
        />
      ) : (
        <div className="relative space-y-0">
          {events.map((event, index) => {
            const styles = EVENT_TYPE_STYLES[event.eventType];
            const isLast = index === events.length - 1;

            return (
              <div key={event.id} className="relative flex gap-4 pb-6">
                <div className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      "relative z-10 mt-1 size-2.5 rounded-full ring-4 ring-background",
                      styles.dot,
                    )}
                    aria-hidden
                  />
                  {!isLast ? (
                    <span
                      className="absolute top-3 h-[calc(100%+8px)] w-px bg-border"
                      aria-hidden
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <time
                    dateTime={event.timestamp}
                    className="font-mono text-caption font-medium tabular-nums text-mute"
                  >
                    {formatTimelineTime(event.timestamp)}
                  </time>
                  <p className="mt-1 text-body-sm leading-relaxed text-body">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/events">
            View full timeline
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
