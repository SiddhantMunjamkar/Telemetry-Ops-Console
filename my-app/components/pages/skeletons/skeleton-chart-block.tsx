import { DashboardGrid } from "@/components/dashboard/DashboardGrid";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SkeletonPanel } from "@/components/pages/skeletons/skeleton-panel";

type SkeletonChartBlockProps = {
  height?: "sm" | "md" | "lg";
  className?: string;
};

const heightClasses = {
  sm: "h-48",
  md: "h-64",
  lg: "h-80",
} as const;

export function SkeletonChartBlock({
  height = "md",
  className,
}: SkeletonChartBlockProps) {
  return (
    <SkeletonPanel className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-sm" />
      </div>
      <Skeleton className={cn("w-full rounded-sm", heightClasses[height])} />
    </SkeletonPanel>
  );
}

type SkeletonChartGridProps = {
  count?: number;
  className?: string;
};

export function SkeletonChartGrid({
  count = 4,
  className,
}: SkeletonChartGridProps) {
  return (
    <DashboardGrid
      columns={2}
      gap="md"
      className={cn("xl:grid-cols-2", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonChartBlock key={index} height={index % 2 === 0 ? "md" : "lg"} />
      ))}
    </DashboardGrid>
  );
}
