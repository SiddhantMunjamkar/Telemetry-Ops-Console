import type { ConnectionStatus, Severity } from "@/types/telemetry";

export type HealthStatus = "healthy" | "degraded" | "down" | "unknown";

export const SEVERITY_LABELS: Record<Severity, string> = {
  info: "Info",
  warning: "Warning",
  error: "Error",
  critical: "Critical",
};

export const HEALTH_LABELS: Record<HealthStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Down",
  unknown: "Unknown",
};

export const CONNECTION_LABELS: Record<ConnectionStatus, string> = {
  connected: "Connected",
  connecting: "Connecting",
  disconnected: "Disconnected",
};

export function severityToHealth(severity: Severity): HealthStatus {
  switch (severity) {
    case "info":
      return "healthy";
    case "warning":
      return "degraded";
    case "error":
    case "critical":
      return "down";
    default:
      return "unknown";
  }
}
