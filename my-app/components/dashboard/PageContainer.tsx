import * as React from "react";
import { cn } from "@/lib/utils";

type PageContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: "default" | "narrow" | "full";
};

const widthClasses = {
  default: "max-w-[var(--page-max-width)]",
  narrow: "max-w-3xl",
  full: "max-w-none",
} as const;

export function PageContainer({
  className,
  width = "default",
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", widthClasses[width], className)}
      {...props}
    />
  );
}
