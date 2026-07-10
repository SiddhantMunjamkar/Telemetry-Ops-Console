import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SkeletonPanel } from "@/components/pages/skeletons/skeleton-panel";

const columnClasses = {
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
} as const;

type SkeletonTableBlockProps = {
  rows?: number;
  columns?: 4 | 5 | 6;
  className?: string;
};

export function SkeletonTableBlock({
  rows = 6,
  columns = 5,
  className,
}: SkeletonTableBlockProps) {
  return (
    <SkeletonPanel padding="none" className={className}>
      <div className="border-b border-border bg-canvas-soft px-5 py-3">
        <div className={cn("grid gap-4", columnClasses[columns])}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-20" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-5 py-4">
            <div className={cn("grid items-center gap-4", columnClasses[columns])}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    "h-3",
                    colIndex === 0 ? "w-28" : "w-full max-w-24",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SkeletonPanel>
  );
}
