"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDevice, fetchDeviceHistory } from "@/lib/api/devices";
import { queryKeys } from "@/lib/realtime/query-keys";
import type { DeviceTelemetryHistory } from "@/types/device-telemetry";
import type { Device } from "@/types/fleet";

export function useDevice(id: string) {
  return useQuery<Device>({
    queryKey: queryKeys.device(id),
    queryFn: () => fetchDevice(id),
    enabled: Boolean(id),
  });
}

export function useDeviceHistory(id: string, limit = 100) {
  return useQuery<DeviceTelemetryHistory>({
    queryKey: queryKeys.deviceHistory(id),
    queryFn: () => fetchDeviceHistory(id, limit),
    enabled: Boolean(id),
  });
}
