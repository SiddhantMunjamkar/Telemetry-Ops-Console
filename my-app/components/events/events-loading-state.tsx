import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type EventsLoadingStateProps = {
  count?: number;
  className?: string;
};

export function EventsLoadingState({
  count = 6,
  className,
}: EventsLoadingStateProps) {
  return (
    <div className={cn("space-y-8", className)} aria-busy="true" aria-label="Loading events">
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-px flex-1" />
        <Skeleton className="h-4 w-16" />
      </div>

      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="mt-1.5 size-3 shrink-0 rounded-full" />
          <div className="flex-1 space-y-3 rounded-md border border-border bg-card p-4 shadow-elevation-2">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}
