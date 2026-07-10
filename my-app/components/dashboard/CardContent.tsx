import * as React from "react";
import { cn } from "@/lib/utils";

type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}
