import Link from "next/link";
import type { TimelineEvent } from "@/types/events";
import { EVENT_TYPE_STYLES } from "@/lib/constants/event-types";
import { formatTimelineTime } from "@/lib/format";
import { EventTypeBadge } from "@/components/events/event-type-badge";
import { cn } from "@/lib/utils";

type EventTimelineItemProps = {
  event: TimelineEvent;
  isLast?: boolean;
  className?: string;
};

export function EventTimelineItem({
  event,
  isLast = false,
  className,
}: EventTimelineItemProps) {
  const styles = EVENT_TYPE_STYLES[event.eventType];

  return (
    <div className={cn("relative flex gap-4 pb-8", className)}>
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            "relative z-10 mt-1.5 size-3 rounded-full ring-4 ring-background",
            styles.dot,
          )}
          aria-hidden
        />
        {!isLast ? (
          <span
            className="absolute top-4 h-[calc(100%+8px)] w-px bg-border"
            aria-hidden
          />
        ) : null}
      </div>

      <article
        data-stagger
        className={cn(
          "min-w-0 flex-1 rounded-md border border-border bg-card p-4 shadow-elevation-2",
          "interactive-lift",
        )}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <EventTypeBadge eventType={event.eventType} />
              <time
                dateTime={event.timestamp}
                className="font-mono text-caption tabular-nums text-mute"
              >
                {formatTimelineTime(event.timestamp)}
              </time>
            </div>
            <p className="text-body-md leading-relaxed text-body">
              {event.description}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
          <span className="font-mono text-caption uppercase tracking-wide text-mute">
            Device
          </span>
          <Link
            href={`/devices/${event.deviceId}`}
            className="text-body-sm font-medium text-link hover:underline"
          >
            {event.deviceName}
          </Link>
        </div>
      </article>
    </div>
  );
}
