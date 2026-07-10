import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/realtime/query-keys";
import type { DeviceTelemetryPoint } from "@/types/device-telemetry";
import type { Device, FleetData } from "@/types/fleet";
import type { FleetSummaryUpdate, TelemetryUpdatePayload } from "@/types/realtime";

const MAX_CHART_POINTS = 100;

function matchDeviceId(device: Device, deviceId: string): boolean {
  return device.id === deviceId || device.name.toLowerCase() === deviceId.toLowerCase();
}

export function patchFleetFromTelemetry(
  queryClient: QueryClient,
  reading: TelemetryUpdatePayload,
): void {
  queryClient.setQueryData<FleetData>(queryKeys.fleet, (current) => {
    if (!current) {
      return current;
    }

    const devices = current.devices.map((device) => {
      if (!matchDeviceId(device, reading.deviceId)) {
        return device;
      }

      return {
        ...device,
        temperature: reading.temperature,
        pressure: reading.pressure ?? device.pressure,
        power: reading.power,
        vibration: reading.vibration,
        lastUpdated: reading.timestamp,
      };
    });

    return { ...current, devices };
  });

  queryClient.setQueryData<Device>(queryKeys.device(reading.deviceId), (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      temperature: reading.temperature,
      pressure: reading.pressure ?? current.pressure,
      power: reading.power,
      vibration: reading.vibration,
      lastUpdated: reading.timestamp,
    };
  });

  queryClient.setQueryData<{ deviceId: string; points: DeviceTelemetryPoint[] }>(
    queryKeys.deviceHistory(reading.deviceId),
    (current) => {
      const point: DeviceTelemetryPoint = {
        timestamp: reading.timestamp,
        temperature: reading.temperature,
        pressure: reading.pressure ?? 0,
        power: reading.power,
        vibration: reading.vibration,
      };

      if (!current) {
        return { deviceId: reading.deviceId, points: [point] };
      }

      const points = [...current.points, point].slice(-MAX_CHART_POINTS);
      return { deviceId: reading.deviceId, points };
    },
  );
}

export function patchFleetSummary(
  queryClient: QueryClient,
  summary: FleetSummaryUpdate,
): void {
  queryClient.setQueryData<FleetData>(queryKeys.fleet, (current) => {
    if (!current) {
      return current;
    }

    return { ...current, summary };
  });
}
