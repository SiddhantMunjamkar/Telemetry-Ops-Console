import {
  SYSTEM_STATUS_LABELS,
  getSystemStatusBadgeClass,
  getSystemStatusDotClass,
  type SystemService,
} from "@/lib/constants/system-status";
import { cn } from "@/lib/utils";

type SidebarStatusItemProps = {
  service: SystemService;
  className?: string;
};

export function SidebarStatusItem({ service, className }: SidebarStatusItemProps) {
  return (
    <div className={cn("flex h-[30px] items-center justify-between gap-2", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            getSystemStatusDotClass(service.status),
          )}
        />
        <span className="truncate text-caption text-[var(--sidebar-nav-idle)]">
          {service.label}
        </span>
      </div>
      <span
        className={cn(
          "sidebar-status-badge shrink-0",
          getSystemStatusBadgeClass(service.status),
        )}
      >
        {SYSTEM_STATUS_LABELS[service.status]}
      </span>
    </div>
  );
}
