import { apiGet } from "@/lib/api/client";

export type SystemStatusResponse = {
  kafka: "connected" | "disconnected";
  timescaledb: "healthy" | "down";
  websocketServer: "ready" | "down";
};

export function fetchSystemStatus(): Promise<SystemStatusResponse> {
  return apiGet<SystemStatusResponse>("/system/status");
}
