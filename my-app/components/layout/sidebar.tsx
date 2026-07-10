"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_GROUPS } from "@/lib/constants/navigation";
import { LAYOUT } from "@/lib/constants/layout";
import { useSidebarAnimation } from "@/hooks/use-sidebar-animation";
import { cn } from "@/lib/utils";
import { InfrastructureStatus } from "@/components/layout/infrastructure-status";
import { SidebarBrand } from "@/components/layout/sidebar-brand";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { SidebarSectionLabel } from "@/components/layout/sidebar-section-label";

type SidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
};

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  className,
}: SidebarProps) {
  const sidebarRef = useSidebarAnimation(collapsed);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "sidebar-surface fixed inset-y-0 left-0 z-30 flex h-full shrink-0 flex-col",
        className,
      )}
      style={{ width: collapsed ? 72 : LAYOUT.sidebarWidth }}
    >
      <div
        className={cn(
          "shrink-0 border-b border-[var(--sidebar-border)] px-5",
          collapsed ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            collapsed ? "flex-col gap-2" : "justify-between gap-2",
          )}
        >
          <SidebarBrand collapsed={collapsed} />

          {onToggleCollapse ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-sm",
                "text-[var(--sidebar-text-muted)] transition-colors duration-200",
                "hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)] focus-ring",
              )}
            >
              {collapsed ? (
                <PanelLeftOpen className="size-3.5" strokeWidth={2} />
              ) : (
                <PanelLeftClose className="size-3.5" strokeWidth={2} />
              )}
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-2 pt-3">
        <nav aria-label="Main navigation">
          {NAV_GROUPS.map((group, index) => (
            <div key={group.label}>
              {!collapsed ? (
                <SidebarSectionLabel
                  label={group.label}
                  className={index === 0 ? "mt-0" : undefined}
                />
              ) : null}
              <ul className={cn("space-y-1", collapsed && "space-y-0.5")}>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <SidebarNavItem item={item} collapsed={collapsed} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {!collapsed ? (
        <div className="shrink-0 border-t border-[var(--sidebar-border)] px-5 pb-2 pt-3">
          <SidebarSectionLabel label="Infrastructure" className="mt-0" />
          <InfrastructureStatus />
        </div>
      ) : null}

      <div
        className={cn(
          "shrink-0 border-t border-[var(--sidebar-border)] px-5 py-3",
          collapsed && "px-2",
        )}
      >
        {collapsed ? (
          <div className="flex justify-center">
            <div className="flex size-8 items-center justify-center rounded-sm bg-[var(--sidebar-avatar-bg)] font-mono text-caption font-semibold text-[var(--sidebar-text)]">
              OP
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-[var(--sidebar-avatar-bg)] font-mono text-caption font-semibold text-[var(--sidebar-text)]">
              OP
            </div>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium leading-tight text-[var(--sidebar-text)]">
                Operator
              </p>
              <p className="truncate text-caption leading-tight text-[var(--sidebar-text-muted)]">
                operator@telemetry.io
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
