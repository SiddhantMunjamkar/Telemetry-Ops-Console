import { cn } from "@/lib/utils";

type DashboardSectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function DashboardSectionHeader({
  title,
  description,
  className,
}: DashboardSectionHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-1.5", className)}>
      <h2 className="text-display-sm font-semibold tracking-display-sm text-ink">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-body-md text-body">{description}</p>
      ) : null}
    </div>
  );
}
