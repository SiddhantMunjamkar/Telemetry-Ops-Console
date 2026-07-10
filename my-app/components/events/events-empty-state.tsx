import { CalendarX2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

type EventsEmptyStateProps = {
  onClearFilters: () => void;
};

export function EventsEmptyState({ onClearFilters }: EventsEmptyStateProps) {
  return (
    <EmptyState
      icon={CalendarX2}
      title="No events found"
      description="Nothing matches your current search or filters. Try broadening your query or clearing filters to see the full timeline."
      actionLabel="Clear filters"
      onAction={onClearFilters}
    />
  );
}
