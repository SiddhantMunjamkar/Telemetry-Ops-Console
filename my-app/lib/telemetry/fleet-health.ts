import type { Device, FleetSummary } from "@/types/fleet";
import { STATUS_COLORS } from "@/lib/constants/layout";

export function computeFleetHealthScore(devices: Device[]): number {
  const online = devices.filter((device) => device.status !== "offline");
  if (online.length === 0) return 0;
  return Math.round(
    online.reduce((sum, device) => sum + device.healthScore, 0) / online.length,
  );
}

export type FleetInsight = {
  id: string;
  message: string;
  tone: "critical" | "warning" | "neutral";
};

export function getFleetInsights(
  summary: FleetSummary,
  devices: Device[],
): FleetInsight[] {
  const insights: FleetInsight[] = [];

  if (summary.critical > 0) {
    insights.push({
      id: "critical-attention",
      message: `${summary.critical} device${summary.critical === 1 ? "" : "s"} require immediate attention`,
      tone: "critical",
    });
  }

  if (summary.warning > 0) {
    insights.push({
      id: "warning-watch",
      message: `${summary.warning} device${summary.warning === 1 ? "" : "s"} trending toward threshold limits`,
      tone: "warning",
    });
  }

  const criticalDevices = devices.filter((d) => d.status === "critical");
  if (criticalDevices.length > 0) {
    insights.push({
      id: "critical-trend",
      message: `+${Math.min(criticalDevices.length, 1)} critical device since last hour`,
      tone: "critical",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "stable",
      message: "Fleet operating within normal parameters",
      tone: "neutral",
    });
  }

  return insights.slice(0, 3);
}

export const FLEET_DISTRIBUTION = [
  { key: "healthy" as const, label: "Healthy", color: STATUS_COLORS.healthy },
  { key: "warning" as const, label: "Warning", color: STATUS_COLORS.warning },
  { key: "critical" as const, label: "Critical", color: STATUS_COLORS.critical },
  { key: "offline" as const, label: "Offline", color: STATUS_COLORS.offline },
];
