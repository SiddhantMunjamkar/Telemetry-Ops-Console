"use client";

import { ArrowUpDown } from "lucide-react";
import type { DeviceSort, DeviceStatusFilter } from "@/lib/device-inventory";
import { DEVICE_STATUS_LABELS } from "@/lib/constants/device-status";
import { FilterMenu } from "@/components/common/FilterMenu";
import { cn } from "@/lib/utils";

const statusOptions: { value: DeviceStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...(["healthy", "warning", "critical", "offline"] as const).map((status) => ({
    value: status,
    label: DEVICE_STATUS_LABELS[status],
  })),
];

const sortOptions: { value: DeviceSort; label: string }[] = [
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "health-high", label: "Health (high → low)" },
  { value: "health-low", label: "Health (low → high)" },
  { value: "updated-newest", label: "Recently updated" },
  { value: "updated-oldest", label: "Oldest updated" },
];

type DevicesToolbarProps = {
  statusFilter: DeviceStatusFilter;
  onStatusFilterChange: (value: DeviceStatusFilter) => void;
  sort: DeviceSort;
  onSortChange: (value: DeviceSort) => void;
  className?: string;
};

export function DevicesToolbar({
  statusFilter,
  onStatusFilterChange,
  sort,
  onSortChange,
  className,
}: DevicesToolbarProps) {
  const sortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "Sort";

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <FilterMenu
        label="Filter"
        value={statusFilter}
        options={statusOptions}
        onChange={onStatusFilterChange}
        menuLabel="Filter by status"
        activeSuffix={
          statusFilter !== "all"
            ? `: ${DEVICE_STATUS_LABELS[statusFilter]}`
            : ""
        }
      />

      <FilterMenu
        label="Sort"
        value={sort}
        options={sortOptions}
        onChange={onSortChange}
        icon={ArrowUpDown}
        menuLabel="Sort by"
        activeSuffix={sort !== "name-asc" ? `: ${sortLabel}` : ""}
      />
    </div>
  );
}
