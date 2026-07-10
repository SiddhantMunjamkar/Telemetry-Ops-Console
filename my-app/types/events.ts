export type EventType =
  | "status_change"
  | "metric_threshold"
  | "maintenance"
  | "alert_triggered"
  | "alert_resolved"
  | "device_online"
  | "device_offline"
  | "configuration"
  | "system";

export type TimelineEvent = {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceName: string;
  eventType: EventType;
  description: string;
};

export type EventTypeFilter = EventType | "all";

export type DeviceFilter = string | "all";
