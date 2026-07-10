import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function DashboardSection({
  title,
  description,
  action,
  children,
  className,
}: DashboardSectionProps) {
  return (
    <section className={cn("space-y-5", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="section-title">{title}</h2>
          {description ? (
            <p className="max-w-2xl text-[15px] leading-snug text-body">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
