import type { Device, DeviceStatus } from "@/types/fleet";

export type DeviceStatusFilter = "all" | DeviceStatus;

export type DeviceSort =
  | "name-asc"
  | "name-desc"
  | "health-high"
  | "health-low"
  | "updated-newest"
  | "updated-oldest";

export function getSortedFilteredDevices(
  devices: Device[],
  statusFilter: DeviceStatusFilter,
  sort: DeviceSort,
): Device[] {
  const filtered =
    statusFilter === "all"
      ? devices
      : devices.filter((device) => device.status === statusFilter);

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "health-high":
        return b.healthScore - a.healthScore;
      case "health-low":
        return a.healthScore - b.healthScore;
      case "updated-newest":
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      case "updated-oldest":
        return (
          new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
        );
      default:
        return 0;
    }
  });
}
