import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-canvas-soft-2 text-body",
        outline: "border-border bg-canvas text-body",
        success:
          "border-transparent bg-link-bg-soft text-link-deep",
        warning:
          "border-transparent bg-warning-soft text-warning-deep",
        destructive:
          "border-transparent bg-error-soft text-error",
        info:
          "border-transparent bg-canvas-soft-2 text-mute",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
