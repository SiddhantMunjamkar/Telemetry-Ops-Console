"use client";

import type { AlertSeverityFilter, AlertSort } from "@/types/alerts";
import { ALERT_SEVERITY_LABELS } from "@/lib/constants/alert-severity";
import { FilterMenu } from "@/components/common/FilterMenu";
import { SearchField } from "@/components/common/SearchField";
import { cn } from "@/lib/utils";

const severityOptions = (
  ["all", "critical", "high", "medium", "low"] as AlertSeverityFilter[]
).map((value) => ({
  value,
  label:
    value === "all" ? "All severities" : ALERT_SEVERITY_LABELS[value],
}));

const sortOptions: { value: AlertSort; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "severity", label: "Severity (high → low)" },
];

type AlertsToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  severityFilter: AlertSeverityFilter;
  onSeverityFilterChange: (value: AlertSeverityFilter) => void;
  sort: AlertSort;
  onSortChange: (value: AlertSort) => void;
  className?: string;
};

export function AlertsToolbar({
  search,
  onSearchChange,
  severityFilter,
  onSeverityFilterChange,
  sort,
  onSortChange,
  className,
}: AlertsToolbarProps) {
  const sortLabel =
    sortOptions.find((option) => option.value === sort)?.label ?? "Sort";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder="Search alerts, devices, descriptions…"
        aria-label="Search alerts"
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterMenu
          label="Severity"
          value={severityFilter}
          options={severityOptions}
          onChange={onSeverityFilterChange}
          menuLabel="Filter by severity"
          activeSuffix={
            severityFilter !== "all"
              ? `: ${ALERT_SEVERITY_LABELS[severityFilter]}`
              : ""
          }
        />

        <FilterMenu
          label={sortLabel}
          value={sort}
          options={sortOptions}
          onChange={onSortChange}
          menuLabel="Sort by"
        />
      </div>
    </div>
  );
}
