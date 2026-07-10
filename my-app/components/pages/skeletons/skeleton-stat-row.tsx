import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonStatRowProps = {
  count?: number;
  className?: string;
};

export function SkeletonStatRow({ count = 4, className }: SkeletonStatRowProps) {
  return (
    <DashboardGrid
      columns={4}
      gap="md"
      className={cn(
        "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-md border border-border bg-card p-5 shadow-elevation-2"
        >
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </DashboardGrid>
  );
}
