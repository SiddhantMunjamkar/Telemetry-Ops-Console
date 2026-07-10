export type AlertSeverity = "low" | "medium" | "high" | "critical";

export type AlertStatus = "open" | "acknowledged" | "resolved";

export type FleetAlert = {
  id: string;
  severity: AlertSeverity;
  deviceId: string;
  deviceName: string;
  title: string;
  description: string;
  timestamp: string;
  status: AlertStatus;
};

export type AlertSeverityFilter = AlertSeverity | "all";

export type AlertSort = "newest" | "oldest" | "severity";
