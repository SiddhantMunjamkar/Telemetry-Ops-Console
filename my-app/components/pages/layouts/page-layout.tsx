import * as React from "react";
import { cn } from "@/lib/utils";

type PageLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: "sm" | "md" | "lg";
};

const gapClasses = {
  sm: "gap-6",
  md: "gap-8",
  lg: "gap-10",
} as const;

export function PageLayout({
  className,
  gap = "md",
  ...props
}: PageLayoutProps) {
  return (
    <div
      className={cn("flex w-full flex-col", gapClasses[gap], className)}
      {...props}
    />
  );
}
