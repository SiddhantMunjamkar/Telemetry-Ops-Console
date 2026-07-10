import fleetJson from "@/lib/mock/fleet.json";
import type { Device, FleetData, FleetSummary } from "@/types/fleet";
import { z } from "zod";

const deviceStatusSchema = z.enum([
  "healthy",
  "warning",
  "critical",
  "offline",
]);

const deviceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  status: deviceStatusSchema,
  healthScore: z.number().min(0).max(100),
  temperature: z.number().min(0),
  pressure: z.number().min(0),
  power: z.number().min(0),
  vibration: z.number().min(0),
  lastUpdated: z.string().datetime(),
});

const fleetJsonSchema = z.object({
  devices: z.array(deviceSchema),
});

function computeFleetSummary(devices: Device[]): FleetSummary {
  return {
    totalDevices: devices.length,
    healthy: devices.filter((d) => d.status === "healthy").length,
    warning: devices.filter((d) => d.status === "warning").length,
    critical: devices.filter((d) => d.status === "critical").length,
    offline: devices.filter((d) => d.status === "offline").length,
  };
}

export function getFleetData(): FleetData {
  const parsed = fleetJsonSchema.parse(fleetJson);
  const devices = parsed.devices as Device[];

  return {
    devices,
    summary: computeFleetSummary(devices),
  };
}

export function getDeviceById(id: string): Device | undefined {
  return getFleetData().devices.find((device) => device.id === id);
}
