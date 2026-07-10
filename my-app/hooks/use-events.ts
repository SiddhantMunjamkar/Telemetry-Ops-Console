"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  DeviceFilter,
  EventTypeFilter,
  TimelineEvent,
} from "@/types/events";
import { getMockEvents, getUniqueDevices } from "@/lib/mock/events";

const PAGE_SIZE = 12;
const INITIAL_LOAD_MS = 700;

type UseEventsResult = {
  events: TimelineEvent[];
  filteredEvents: TimelineEvent[];
  devices: { id: string; name: string }[];
  search: string;
  setSearch: (value: string) => void;
  eventTypeFilter: EventTypeFilter;
  setEventTypeFilter: (value: EventTypeFilter) => void;
  deviceFilter: DeviceFilter;
  setDeviceFilter: (value: DeviceFilter) => void;
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  clearFilters: () => void;
  totalCount: number;
};

export function useEvents(): UseEventsResult {
  const allEvents = useMemo(() => getMockEvents(), []);
  const devices = useMemo(() => getUniqueDevices(allEvents), [allEvents]);

  const [search, setSearch] = useState("");
  const [eventTypeFilter, setEventTypeFilter] =
    useState<EventTypeFilter>("all");
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsInitialLoading(false);
    }, INITIAL_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredEvents = useMemo(() => {
    let result = allEvents;

    if (eventTypeFilter !== "all") {
      result = result.filter((event) => event.eventType === eventTypeFilter);
    }

    if (deviceFilter !== "all") {
      result = result.filter((event) => event.deviceId === deviceFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (event) =>
          event.description.toLowerCase().includes(query) ||
          event.deviceName.toLowerCase().includes(query) ||
          event.eventType.toLowerCase().includes(query),
      );
    }

    return result;
  }, [allEvents, eventTypeFilter, deviceFilter, search]);

  const events = useMemo(
    () => filteredEvents.slice(0, visibleCount),
    [filteredEvents, visibleCount],
  );

  const hasMore = visibleCount < filteredEvents.length;

  const setSearchWithReset = useCallback((value: string) => {
    setSearch(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setEventTypeFilterWithReset = useCallback((value: EventTypeFilter) => {
    setEventTypeFilter(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const setDeviceFilterWithReset = useCallback((value: DeviceFilter) => {
    setDeviceFilter(value);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || isInitialLoading) return;

    setIsLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((count) =>
        Math.min(count + PAGE_SIZE, filteredEvents.length),
      );
      setIsLoadingMore(false);
    }, 400);
  }, [filteredEvents.length, hasMore, isInitialLoading, isLoadingMore]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setEventTypeFilter("all");
    setDeviceFilter("all");
    setVisibleCount(PAGE_SIZE);
  }, []);

  return {
    events,
    filteredEvents,
    devices,
    search,
    setSearch: setSearchWithReset,
    eventTypeFilter,
    setEventTypeFilter: setEventTypeFilterWithReset,
    deviceFilter,
    setDeviceFilter: setDeviceFilterWithReset,
    isInitialLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    clearFilters,
    totalCount: filteredEvents.length,
  };
}
