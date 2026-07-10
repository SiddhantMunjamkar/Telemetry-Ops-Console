import type { FleetSummary } from "../types/fleet";
import type { TelemetryUpdatePayload } from "../types/telemetry";
import { getIO } from "../socket/socket";
import { logger } from "../utils/logger";

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

class RealtimeService {
  broadcastTelemetryUpdate(payload: TelemetryUpdatePayload): void {
    getIO().emit("telemetry:update", payload);
    logger.socket("Emitted telemetry:update", payload.deviceId);
  }

  broadcastFleetUpdate(summary: FleetSummary): void {
    getIO().emit("fleet:update", summary);
    logger.socket("Emitted fleet:update", "fleet");
  }

  broadcastAlertNew(alert: AlertSocketPayload): void {
    getIO().emit("alert:new", alert);
    logger.socket("Emitted alert:new", alert.deviceId);
  }
}

export const realtimeService = new RealtimeService();
