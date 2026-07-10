import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonDeviceGridProps = {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
};

const columnClasses = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
} as const;

export function SkeletonDeviceGrid({
  count = 6,
  columns = 3,
  className,
}: SkeletonDeviceGridProps) {
  return (
    <DashboardGrid gap="md" className={cn(columnClasses[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-4 rounded-md border border-border bg-card p-5 shadow-elevation-2"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-sm" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </DashboardGrid>
  );
}
