import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const dashboardGridVariants = cva("grid gap-4", {
  variants: {
    columns: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
      auto: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
    },
    gap: {
      sm: "gap-3",
      md: "gap-4",
      lg: "gap-6",
    },
  },
  defaultVariants: {
    columns: "auto",
    gap: "md",
  },
});

export type DashboardGridProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dashboardGridVariants>;

export function DashboardGrid({
  className,
  columns,
  gap,
  ...props
}: DashboardGridProps) {
  return (
    <div
      className={cn(dashboardGridVariants({ columns, gap }), className)}
      {...props}
    />
  );
}
