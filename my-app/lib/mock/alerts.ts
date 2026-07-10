import alertsJson from "@/lib/mock/alerts.json";
import type { FleetAlert } from "@/types/alerts";
import { z } from "zod";

const alertSeveritySchema = z.enum(["low", "medium", "high", "critical"]);
const alertStatusSchema = z.enum(["open", "acknowledged", "resolved"]);

const fleetAlertSchema = z.object({
  id: z.string().min(1),
  severity: alertSeveritySchema,
  deviceId: z.string().min(1),
  deviceName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  timestamp: z.string().datetime(),
  status: alertStatusSchema,
});

const alertsJsonSchema = z.object({
  alerts: z.array(fleetAlertSchema),
});

export function getMockAlerts(): FleetAlert[] {
  const parsed = alertsJsonSchema.parse(alertsJson);
  return parsed.alerts as FleetAlert[];
}

export function getActiveAlerts(alerts: FleetAlert[]): FleetAlert[] {
  return alerts.filter((alert) => alert.status !== "resolved");
}
