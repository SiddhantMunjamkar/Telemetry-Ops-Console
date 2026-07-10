import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  LayoutDashboard,
  Server,
  Table2,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "Monitor fleet health and real-time telemetry.",
      },
      {
        title: "Devices",
        href: "/devices",
        icon: Server,
        description: "Connected devices and node inventory",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Alerts",
        href: "/alerts",
        icon: AlertTriangle,
        description: "Warnings and critical incidents",
      },
      {
        title: "Events",
        href: "/events",
        icon: Table2,
        description: "Event log and audit trail",
      },
    ],
  },
];

export const MAIN_NAV: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export function getNavItemByHref(pathname: string): NavItem | undefined {
  if (pathname === "/") {
    return MAIN_NAV.find((item) => item.href === "/");
  }

  return MAIN_NAV.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
}

export function getBreadcrumbs(pathname: string): string[] {
  const nav = getNavItemByHref(pathname);
  const title = nav?.title ?? "Dashboard";
  return [title, "Overview"];
}
