import { apiGet } from "@/lib/api/client";
import type { FleetAlert } from "@/types/alerts";

export function fetchAlerts(deviceId?: string): Promise<FleetAlert[]> {
  const query = deviceId ? `?deviceId=${encodeURIComponent(deviceId)}` : "";
  return apiGet<FleetAlert[]>(`/alerts${query}`);
}
