import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusDotVariants = cva("inline-flex shrink-0 rounded-full", {
  variants: {
    status: {
      healthy: "bg-success",
      degraded: "bg-warning",
      down: "bg-error",
      unknown: "bg-mute",
      info: "bg-link",
      warning: "bg-warning",
      error: "bg-error",
      critical: "bg-error",
      connected: "bg-success",
      connecting: "bg-warning",
      disconnected: "bg-mute",
      offline: "bg-zinc-400",
    },
    size: {
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
    pulse: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    {
      pulse: true,
      status: ["healthy", "connected", "info"],
      className:
        "relative before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-current before:opacity-40",
    },
    {
      pulse: true,
      status: ["degraded", "warning", "connecting", "critical"],
      className:
        "relative before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-current before:opacity-40",
    },
  ],
  defaultVariants: {
    status: "unknown",
    size: "md",
    pulse: false,
  },
});

type StatusDotProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusDotVariants> & {
    label?: string;
  };

export function StatusDot({
  status,
  size,
  pulse,
  label,
  className,
  ...props
}: StatusDotProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(statusDotVariants({ status, size, pulse }), className)}
      {...props}
    />
  );
}
