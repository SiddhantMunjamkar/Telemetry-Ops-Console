"use client";

import { NAV_GROUPS } from "@/lib/constants/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { InfrastructureStatus } from "@/components/layout/infrastructure-status";
import { SidebarBrand } from "@/components/layout/sidebar-brand";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { SidebarSectionLabel } from "@/components/layout/sidebar-section-label";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="sidebar-surface w-[264px] gap-0 border-[var(--sidebar-border)] p-0 shadow-elevation-5"
      >
        <div className="border-b border-[var(--sidebar-border)] px-5 py-5">
          <SidebarBrand />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3">
          <nav aria-label="Mobile navigation">
            {NAV_GROUPS.map((group, index) => (
              <div key={group.label}>
                <SidebarSectionLabel
                  label={group.label}
                  className={index === 0 ? "mt-0" : undefined}
                />
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <SidebarNavItem
                        item={item}
                        onNavigate={() => onOpenChange(false)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-4 border-t border-[var(--sidebar-border)] pt-3">
            <SidebarSectionLabel label="Infrastructure" className="mt-0" />
            <InfrastructureStatus />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
