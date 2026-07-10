import { Skeleton } from "@/components/ui/skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { CardContent } from "@/components/dashboard/CardContent";
import { CardHeader } from "@/components/dashboard/CardHeader";
import { cn } from "@/lib/utils";

type LoadingCardProps = {
  lines?: number;
  showHeader?: boolean;
  className?: string;
};

export function LoadingCard({
  lines = 3,
  showHeader = true,
  className,
}: LoadingCardProps) {
  return (
    <DashboardCard className={cn("overflow-hidden", className)}>
      {showHeader ? (
        <CardHeader>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </CardHeader>
      ) : null}
      <CardContent className="space-y-3">
        <Skeleton className="h-8 w-28" />
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={cn(
              "h-3",
              index === 0 && "w-full",
              index === 1 && "w-11/12",
              index === 2 && "w-10/12",
              index >= 3 && "w-9/12",
            )}
          />
        ))}
      </CardContent>
    </DashboardCard>
  );
}
