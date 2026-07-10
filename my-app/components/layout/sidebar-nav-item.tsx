"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
};

export function SidebarNavItem({
  item,
  collapsed = false,
  onNavigate,
}: SidebarNavItemProps) {
  const pathname = usePathname();
  const isActive =
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center rounded-sm px-3 py-2",
        "text-body-sm font-medium transition-colors duration-200 ease-out focus-ring",
        isActive
          ? "bg-[var(--sidebar-active-bg)] text-[var(--sidebar-text)]"
          : "text-[var(--sidebar-nav-idle)] hover:bg-[var(--sidebar-hover)] hover:text-[var(--sidebar-text)]",
        collapsed ? "justify-center px-0" : "gap-2.5",
      )}
    >
      {isActive ? (
        <span
          aria-hidden
          className="absolute bottom-1.5 left-0 top-1.5 w-0.5 rounded-r-sm bg-[var(--sidebar-active-indicator)]"
        />
      ) : null}
      <Icon
        strokeWidth={2}
        className={cn(
          "size-[18px] shrink-0",
          isActive
            ? "text-[var(--sidebar-active-icon)]"
            : "text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]",
        )}
      />
      {!collapsed ? <span className="truncate">{item.title}</span> : null}
      {collapsed ? <span className="sr-only">{item.title}</span> : null}
    </Link>
  );
}
