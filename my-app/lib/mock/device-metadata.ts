import type { Device } from "@/types/fleet";

export type DeviceMetadata = {
  location: string;
  model: string;
  serialNumber: string;
  firmware: string;
  installedDate: string;
  telemetryRate: number;
  runtimeHours: number;
  uptimePercent: number;
  responseLatencyMs: number;
  rpm: number;
  batteryPercent: number;
  storagePercent: number;
  connectionQuality: number;
  sensorCount: number;
};

const LOCATIONS = [
  "Plant A · Bay 3",
  "Plant B · Line 2",
  "Warehouse · Zone 7",
  "Facility East · Floor 1",
  "Cooling Tower · North",
];

const MODELS = [
  "IA-4500X",
  "CP-2200 Pro",
  "TRB-900 Series",
  "GEN-7 Modular",
  "HX-1200 Chiller",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getDeviceMetadata(device: Device): DeviceMetadata {
  const seed = hashString(device.id);
  const index = seed % LOCATIONS.length;

  return {
    location: LOCATIONS[index],
    model: MODELS[index],
    serialNumber: `SN-${device.id.replace("dev-", "").toUpperCase()}-${(seed % 9000) + 1000}`,
    firmware: `v${2 + (seed % 3)}.${10 + (seed % 40)}.${seed % 100}`,
    installedDate: new Date(2023, seed % 12, (seed % 27) + 1).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    ),
    telemetryRate: 120 + (seed % 180),
    runtimeHours: 4200 + (seed % 8000),
    uptimePercent: device.status === "offline" ? 0 : 94 + (seed % 6),
    responseLatencyMs: 12 + (seed % 48),
    rpm: device.status === "offline" ? 0 : 1200 + (seed % 2400),
    batteryPercent: 68 + (seed % 30),
    storagePercent: 42 + (seed % 45),
    connectionQuality: device.status === "offline" ? 0 : 82 + (seed % 18),
    sensorCount: 6 + (seed % 8),
  };
}
