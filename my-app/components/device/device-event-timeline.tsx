"use client";

import { useMemo } from "react";
import { getMockEvents } from "@/lib/mock/events";
import { formatRelativeTime } from "@/lib/format";
import { EVENT_TYPE_LABELS } from "@/lib/constants/event-types";
import { deviceSurfaceClass } from "@/lib/constants/device-detail";
import { cn } from "@/lib/utils";

type DeviceEventTimelineProps = {
  deviceId: string;
  limit?: number;
};

export function DeviceEventTimeline({ deviceId, limit = 6 }: DeviceEventTimelineProps) {
  const events = useMemo(
    () =>
      getMockEvents()
        .filter((event) => event.deviceId === deviceId)
        .slice(0, limit),
    [deviceId, limit],
  );

  if (events.length === 0) {
    return (
      <p className="py-10 text-center text-[15px] text-mute">
        No operational events recorded for this device.
      </p>
    );
  }

  return (
    <div className="relative mx-auto max-w-3xl py-2">
      <span
        className="absolute top-0 bottom-0 left-1/2 hidden w-px -translate-x-1/2 bg-hairline md:block"
        aria-hidden
      />

      <div className="space-y-6">
        {events.map((event, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div
              key={event.id}
              className={cn(
                "relative grid grid-cols-1 gap-4 md:grid-cols-2",
                !isLeft && "md:[&>article]:col-start-2",
              )}
            >
              <span
                className="absolute top-6 left-1/2 z-10 hidden size-2.5 -translate-x-1/2 rounded-full bg-link shadow-[0_0_0_4px_rgba(59,130,246,0.15)] md:block"
                aria-hidden
              />

              <article
                className={cn(
                  deviceSurfaceClass,
                  "max-w-[480px] shadow-[0_2px_8px_rgba(0,0,0,0.12)]",
                  isLeft ? "md:mr-auto" : "md:ml-auto",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[14px] font-semibold text-ink">
                    {EVENT_TYPE_LABELS[event.eventType]}
                  </h3>
                  <time className="shrink-0 text-[12px] text-mute">
                    {formatRelativeTime(event.timestamp)}
                  </time>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  {event.description}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
                  <div>
                    <dt className="text-mute">Operator</dt>
                    <dd className="font-medium text-ink">System</dd>
                  </div>
                  <div>
                    <dt className="text-mute">Duration</dt>
                    <dd className="font-medium text-ink">—</dd>
                  </div>
                </dl>
                <p className="mt-3 text-[12px] font-medium text-link">View Details</p>
              </article>
            </div>
          );
        })}
      </div>
    </div>
  );
}
