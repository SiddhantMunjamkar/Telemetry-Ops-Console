"use client";

import { Loader2 } from "lucide-react";
import { EventTimeline } from "@/components/events/event-timeline";
import { EventsEmptyState } from "@/components/events/events-empty-state";
import { EventsLoadingState } from "@/components/events/events-loading-state";
import { EventsToolbar } from "@/components/events/events-toolbar";
import { StaggerReveal } from "@/components/common/StaggerReveal";
import { PageHero } from "@/components/layout/page-hero";
import { PageLayout } from "@/components/pages/layouts/page-layout";
import { PageSection } from "@/components/pages/layouts/page-section";
import { useEvents } from "@/hooks/use-events";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";

export function EventsTimelineModule() {
  const {
    events,
    devices,
    search,
    setSearch,
    eventTypeFilter,
    setEventTypeFilter,
    deviceFilter,
    setDeviceFilter,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    clearFilters,
    totalCount,
  } = useEvents();

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isInitialLoading || isLoadingMore,
  });

  return (
    <PageLayout>
      <PageHero />

      <EventsToolbar
        search={search}
        onSearchChange={setSearch}
        eventTypeFilter={eventTypeFilter}
        onEventTypeFilterChange={setEventTypeFilter}
        deviceFilter={deviceFilter}
        onDeviceFilterChange={setDeviceFilter}
        devices={devices}
      />

      <PageSection title="Timeline" action={null}>
        {isInitialLoading ? (
          <EventsLoadingState />
        ) : events.length === 0 ? (
          <EventsEmptyState onClearFilters={clearFilters} />
        ) : (
          <>
            <p className="mb-6 font-mono text-caption text-mute">
              Showing {events.length} of {totalCount} events
            </p>
            <StaggerReveal>
              <EventTimeline events={events} />
            </StaggerReveal>

            <div
              ref={sentinelRef}
              className={cn(
                "flex items-center justify-center py-8",
                !hasMore && !isLoadingMore && "hidden",
              )}
              aria-hidden={!hasMore && !isLoadingMore}
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-body-sm text-mute">
                  <Loader2 className="size-4 animate-spin" />
                  Loading more events…
                </div>
              ) : hasMore ? (
                <div className="h-8" />
              ) : null}
            </div>

            {!hasMore && events.length > 0 ? (
              <p className="pb-4 text-center font-mono text-caption text-mute">
                End of timeline
              </p>
            ) : null}
          </>
        )}
      </PageSection>
    </PageLayout>
  );
}
