"use client";

import { useMemo } from "react";
import { getMockEvents } from "@/lib/mock/events";
import { formatRelativeTime } from "@/lib/format";
import { EVENT_TYPE_LABELS } from "@/lib/constants/event-types";
import type { EventType } from "@/types/events";
import { DashboardFeedEntry } from "@/components/dashboard/dashboard-feed-entry";
import { DashboardFeedPanel } from "@/components/dashboard/dashboard-feed-panel";

const eventDotColor: Record<EventType, string> = {
  status_change: "#3b82f6",
  metric_threshold: "#f59e0b",
  maintenance: "#8b5cf6",
  alert_triggered: "#ef4444",
  alert_resolved: "#22c55e",
  device_online: "#22c55e",
  device_offline: "#71717a",
  configuration: "#06b6d4",
  system: "#64748b",
};

type DashboardEventsPanelProps = {
  limit?: number;
};

export function DashboardEventsPanel({ limit = 4 }: DashboardEventsPanelProps) {
  const events = useMemo(() => getMockEvents().slice(0, limit), [limit]);

  return (
    <DashboardFeedPanel title="Recent Events" href="/events" className="h-full">
      {events.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-center text-[13px] text-mute">
          No recent events recorded.
        </p>
      ) : (
        <div className="grid flex-1 grid-rows-4 gap-5">
          {events.map((event) => (
            <DashboardFeedEntry
              key={event.id}
              dotColor={eventDotColor[event.eventType]}
              title={EVENT_TYPE_LABELS[event.eventType]}
              time={formatRelativeTime(event.timestamp)}
              description={event.description}
              footer={
                event.deviceName
                  ? { label: event.deviceName, muted: true }
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </DashboardFeedPanel>
  );
}
