"use client";

import type { DeviceFilter, EventTypeFilter } from "@/types/events";
import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_OPTIONS,
} from "@/lib/constants/event-types";
import { FilterMenu } from "@/components/common/FilterMenu";
import { SearchField } from "@/components/common/SearchField";
import { cn } from "@/lib/utils";

const eventTypeOptions = [
  { value: "all" as EventTypeFilter, label: "All types" },
  ...EVENT_TYPE_OPTIONS.map((type) => ({
    value: type,
    label: EVENT_TYPE_LABELS[type],
  })),
];

type EventsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  eventTypeFilter: EventTypeFilter;
  onEventTypeFilterChange: (value: EventTypeFilter) => void;
  deviceFilter: DeviceFilter;
  onDeviceFilterChange: (value: DeviceFilter) => void;
  devices: { id: string; name: string }[];
  className?: string;
};

export function EventsToolbar({
  search,
  onSearchChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  deviceFilter,
  onDeviceFilterChange,
  devices,
  className,
}: EventsToolbarProps) {
  const deviceOptions = [
    { value: "all" as DeviceFilter, label: "All devices" },
    ...devices.map((device) => ({
      value: device.id as DeviceFilter,
      label: device.name,
    })),
  ];

  const selectedDevice = devices.find((device) => device.id === deviceFilter);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search events, devices, descriptions…"
        aria-label="Search events"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterMenu
          label="Type"
          value={eventTypeFilter}
          options={eventTypeOptions}
          onChange={onEventTypeFilterChange}
          menuLabel="Filter by type"
          contentClassName="max-h-72 w-52 overflow-y-auto"
          activeSuffix={
            eventTypeFilter !== "all"
              ? `: ${EVENT_TYPE_LABELS[eventTypeFilter]}`
              : ""
          }
        />

        <FilterMenu
          label="Device"
          value={deviceFilter}
          options={deviceOptions}
          onChange={onDeviceFilterChange}
          menuLabel="Filter by device"
          contentClassName="max-h-72 w-56 overflow-y-auto"
          activeSuffix={
            deviceFilter !== "all"
              ? `: ${selectedDevice?.name ?? "Selected"}`
              : ""
          }
        />
      </div>
    </div>
  );
}
