import type { EventType } from "@/types/events";
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_STYLES,
} from "@/lib/constants/event-types";
import { cn } from "@/lib/utils";

type EventTypeBadgeProps = {
  eventType: EventType;
  className?: string;
};

export function EventTypeBadge({ eventType, className }: EventTypeBadgeProps) {
  const styles = EVENT_TYPE_STYLES[eventType];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-caption font-medium",
        styles.badge,
        className,
      )}
    >
      {EVENT_TYPE_LABELS[eventType]}
    </span>
  );
}
