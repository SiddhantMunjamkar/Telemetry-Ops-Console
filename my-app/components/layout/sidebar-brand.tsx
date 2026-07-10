import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarBrandProps = {
  collapsed?: boolean;
  className?: string;
};

export function SidebarBrand({ collapsed = false, className }: SidebarBrandProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center",
        collapsed ? "justify-center" : "flex-1 gap-3",
        className,
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-[var(--sidebar-mark-bg)]">
        <Radio
          className="size-4 text-[var(--sidebar-active-icon)]"
          strokeWidth={2}
          aria-hidden
        />
      </div>
      {!collapsed ? (
        <div className="min-w-0 flex-1">
          <p className="truncate text-body-sm font-semibold leading-tight text-[var(--sidebar-text)]">
            Ops Console
          </p>
          <p className="truncate font-mono text-caption leading-tight text-[var(--sidebar-text-muted)]">
            Infrastructure Platform
          </p>
        </div>
      ) : null}
    </div>
  );
}
