import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const dashboardCardVariants = cva("transition-shadow duration-200", {
  variants: {
    elevation: {
      low: "shadow-elevation-2 hover:shadow-elevation-3",
      medium: "shadow-elevation-3 hover:shadow-elevation-4",
      high: "shadow-elevation-4 hover:shadow-elevation-5",
    },
    padding: {
      none: "p-0",
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {
    elevation: "low",
    padding: "md",
  },
});

export type DashboardCardProps = React.ComponentProps<typeof Card> &
  VariantProps<typeof dashboardCardVariants>;

export function DashboardCard({
  className,
  elevation,
  padding,
  ...props
}: DashboardCardProps) {
  return (
    <Card
      className={cn(dashboardCardVariants({ elevation, padding }), className)}
      {...props}
    />
  );
}
