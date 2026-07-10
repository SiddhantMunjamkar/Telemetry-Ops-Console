"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { fetchAlerts } from "@/lib/api/alerts";
import {
  patchFleetFromTelemetry,
  patchFleetSummary,
} from "@/lib/realtime/patch-fleet-cache";
import { queryKeys } from "@/lib/realtime/query-keys";
import { getSocket } from "@/lib/socket/socket";
import { useAlertsStore } from "@/stores/alerts-store";
import type { FleetAlert } from "@/types/alerts";
import type {
  AlertSocketPayload,
  FleetSummaryUpdate,
  TelemetryUpdatePayload,
} from "@/types/realtime";

type SocketStatus = "connected" | "connecting" | "disconnected";

type SocketContextValue = {
  status: SocketStatus;
};

const SocketContext = createContext<SocketContextValue>({
  status: "connecting",
});

function mapSocketAlert(alert: AlertSocketPayload): FleetAlert {
  return {
    id: alert.id,
    severity:
      alert.severity === "info"
        ? "low"
        : alert.severity === "warning"
          ? "medium"
          : alert.severity === "critical"
            ? "critical"
            : "high",
    deviceId: alert.deviceId,
    deviceName: alert.deviceName,
    title: alert.title,
    description: alert.description,
    timestamp: alert.timestamp,
    status:
      alert.status === "active"
        ? "open"
        : alert.status === "acknowledged"
          ? "acknowledged"
          : "resolved",
  };
}

type SocketProviderProps = {
  children: React.ReactNode;
};

export function SocketProvider({ children }: SocketProviderProps) {
  const queryClient = useQueryClient();
  const addAlert = useAlertsStore((state) => state.addAlert);
  const setAlerts = useAlertsStore((state) => state.setAlerts);
  const [status, setStatus] = useState<SocketStatus>("connecting");

  useEffect(() => {
    void fetchAlerts()
      .then((alerts) => setAlerts(alerts))
      .catch(() => {
        // Alerts hydrate from REST separately; socket handles live additions.
      });
  }, [setAlerts]);

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");
    const handleTelemetry = (reading: TelemetryUpdatePayload) => {
      patchFleetFromTelemetry(queryClient, reading);
    };
    const handleFleetUpdate = (summary: FleetSummaryUpdate) => {
      patchFleetSummary(queryClient, summary);
    };
    const handleAlertNew = (alert: AlertSocketPayload) => {
      const mapped = mapSocketAlert(alert);
      addAlert(mapped);
      toast.warning(mapped.title, {
        description: `${mapped.deviceName} · ${mapped.description}`,
      });
    };

    setStatus(socket.connected ? "connected" : "connecting");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("telemetry:update", handleTelemetry);
    socket.on("fleet:update", handleFleetUpdate);
    socket.on("alert:new", handleAlertNew);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("telemetry:update", handleTelemetry);
      socket.off("fleet:update", handleFleetUpdate);
      socket.off("alert:new", handleAlertNew);
    };
  }, [addAlert, queryClient]);

  const value = useMemo(() => ({ status }), [status]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketStatus(): SocketContextValue {
  return useContext(SocketContext);
}
