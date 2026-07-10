import { cn } from "@/lib/utils";

type PremiumSurfaceProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function PremiumSurface({
  className,
  interactive = false,
  ...props
}: PremiumSurfaceProps) {
  return (
    <div
      className={cn(
        "premium-surface",
        interactive &&
          "cursor-pointer transition-all duration-200 motion-safe:hover:-translate-y-[3px] motion-safe:hover:border-hairline-strong motion-safe:hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
        className,
      )}
      {...props}
    />
  );
}
