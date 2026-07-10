export type TelemetryUpdatePayload = {
  deviceId: string;
  deviceName: string;
  temperature: number;
  pressure: number | null;
  power: number;
  vibration: number;
  timestamp: string;
};

export type FleetSummaryUpdate = {
  totalDevices: number;
  healthy: number;
  warning: number;
  critical: number;
  offline: number;
};

export type AlertSocketPayload = {
  id: string;
  severity: string;
  deviceId: string;
  deviceName: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
};
