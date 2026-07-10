export type DeviceStatus = "healthy" | "warning" | "critical" | "offline";

export type Device = {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  healthScore: number;
  temperature: number;
  pressure: number;
  power: number;
  vibration: number;
  lastUpdated: string;
};

export type FleetSummary = {
  totalDevices: number;
  healthy: number;
  warning: number;
  critical: number;
  offline: number;
};

export type FleetData = {
  devices: Device[];
  summary: FleetSummary;
};
