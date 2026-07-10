import * as React from "react";
import { cn } from "@/lib/utils";

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  action?: React.ReactNode;
};

export function CardHeader({
  className,
  action,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-border px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 space-y-1">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardHeaderTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-body-md font-semibold text-ink", className)}
      {...props}
    />
  );
}

export function CardHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
