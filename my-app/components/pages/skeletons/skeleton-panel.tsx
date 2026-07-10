import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonPanelProps = {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClasses = {
  none: "p-0",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function SkeletonPanel({
  children,
  className,
  padding = "md",
}: SkeletonPanelProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border bg-card shadow-elevation-2",
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

type SkeletonToolbarProps = {
  items?: number;
  className?: string;
};

export function SkeletonToolbar({ items = 4, className }: SkeletonToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
        <Skeleton className="h-9 w-28 rounded-sm" />
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: items }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-20 rounded-sm" />
        ))}
      </div>
    </div>
  );
}
