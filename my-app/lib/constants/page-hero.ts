export type PageHeroConfig = {
  section: string;
  title: string;
  description: string;
};

export const PAGE_HERO_CONFIG: Record<string, PageHeroConfig> = {
  "/": {
    section: "Dashboard",
    title: "Overview",
    description: "Monitor real-time telemetry, device health and active alerts.",
  },
  "/devices": {
    section: "Devices",
    title: "Overview",
    description: "Browse, filter, and inspect every connected node in the workspace.",
  },
  "/alerts": {
    section: "Alerts",
    title: "Overview",
    description: "Monitor open, acknowledged, and resolved incidents across the fleet.",
  },
  "/events": {
    section: "Events",
    title: "Overview",
    description: "Chronological history of operational events, state changes, and system signals.",
  },
};

export function usesPageHero(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname === "/devices" ||
    pathname === "/alerts" ||
    pathname === "/events"
  );
}

export function usesDeviceDetailHeader(pathname: string): boolean {
  return pathname.startsWith("/devices/") && pathname !== "/devices";
}

export function getPageHeroConfig(pathname: string): PageHeroConfig {
  if (pathname in PAGE_HERO_CONFIG) {
    return PAGE_HERO_CONFIG[pathname];
  }

  return PAGE_HERO_CONFIG["/"];
}
