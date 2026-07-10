import { apiGet } from "@/lib/api/client";
import type { DeviceTelemetryHistory } from "@/types/device-telemetry";
import type { Device, FleetData } from "@/types/fleet";

export function fetchFleet(): Promise<FleetData> {
  return apiGet<FleetData>("/fleet");
}

export function fetchDevices(): Promise<Device[]> {
  return apiGet<Device[]>("/devices");
}

export function fetchDevice(id: string): Promise<Device> {
  return apiGet<Device>(`/devices/${id}`);
}

export function fetchDeviceHistory(
  id: string,
  limit = 100,
): Promise<DeviceTelemetryHistory> {
  return apiGet<DeviceTelemetryHistory>(`/devices/${id}/history?limit=${limit}`);
}
