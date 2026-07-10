import type { TimelineEvent } from "@/types/events";
import { formatTimelineDate } from "@/lib/format";
import { EventTimelineItem } from "@/components/events/event-timeline-item";
import { cn } from "@/lib/utils";

type GroupedEvents = {
  dateLabel: string;
  events: TimelineEvent[];
};

function groupEventsByDate(events: TimelineEvent[]): GroupedEvents[] {
  const groups = new Map<string, TimelineEvent[]>();

  for (const event of events) {
    const label = formatTimelineDate(event.timestamp);
    const existing = groups.get(label) ?? [];
    existing.push(event);
    groups.set(label, existing);
  }

  return Array.from(groups.entries()).map(([dateLabel, groupEvents]) => ({
    dateLabel,
    events: groupEvents,
  }));
}

type EventTimelineProps = {
  events: TimelineEvent[];
  className?: string;
};

export function EventTimeline({ events, className }: EventTimelineProps) {
  const groups = groupEventsByDate(events);

  return (
    <div className={cn("space-y-8", className)}>
      {groups.map((group) => (
        <section key={group.dateLabel}>
          <div className="mb-4 flex items-center gap-3">
            <h3 className="font-mono text-caption font-medium uppercase tracking-wide text-mute">
              {group.dateLabel}
            </h3>
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-caption text-mute">
              {group.events.length} event{group.events.length === 1 ? "" : "s"}
            </span>
          </div>

          <div>
            {group.events.map((event, index) => (
              <EventTimelineItem
                key={event.id}
                event={event}
                isLast={index === group.events.length - 1}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
