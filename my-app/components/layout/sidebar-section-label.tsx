import { cn } from "@/lib/utils";

type SidebarSectionLabelProps = {
  label: string;
  className?: string;
};

export function SidebarSectionLabel({ label, className }: SidebarSectionLabelProps) {
  return (
    <div className={cn("mb-2 mt-5 first:mt-0", className)}>
      <div className="flex items-center gap-2">
        <span className="shrink-0 font-mono text-caption uppercase tracking-[0.12em] text-[var(--sidebar-label)]">
          {label}
        </span>
        <div className="h-px flex-1 bg-[var(--sidebar-border)]" aria-hidden />
      </div>
    </div>
  );
}
