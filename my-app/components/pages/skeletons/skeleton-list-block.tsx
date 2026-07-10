import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SkeletonPanel } from "@/components/pages/skeletons/skeleton-panel";

type SkeletonListBlockProps = {
  rows?: number;
  className?: string;
};

export function SkeletonListBlock({
  rows = 5,
  className,
}: SkeletonListBlockProps) {
  return (
    <SkeletonPanel padding="none" className={cn("divide-y divide-border", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-start gap-3 px-5 py-4">
          <Skeleton className="mt-0.5 size-2 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full max-w-md" />
          </div>
        </div>
      ))}
    </SkeletonPanel>
  );
}
