"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EventTimeline } from "@/components/events/event-timeline";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { getMockEvents } from "@/lib/mock/events";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

type DeviceRecentEventsProps = {
  deviceId: string;
  limit?: number;
  className?: string;
};

export function DeviceRecentEvents({
  deviceId,
  limit = 5,
  className,
}: DeviceRecentEventsProps) {
  const events = useMemo(
    () =>
      getMockEvents()
        .filter((event) => event.deviceId === deviceId)
        .slice(0, limit),
    [deviceId, limit],
  );

  return (
    <div className={cn("space-y-4", className)}>
      {events.length === 0 ? (
        <EmptyState
          title="No recent events"
          description="No operational events recorded for this device yet."
          className="py-8"
        />
      ) : (
        <EventTimeline events={events} />
      )}

      <Button variant="outline" size="sm" asChild>
        <Link href="/events">
          View full timeline
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
