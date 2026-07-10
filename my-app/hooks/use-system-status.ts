"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchSystemStatus } from "@/lib/api/system";
import {
  type SystemService,
  type SystemServiceStatus,
} from "@/lib/constants/system-status";
import { useSocketStatus } from "@/providers/socket-provider";

function mapSocketStatus(
  socketStatus: "connected" | "connecting" | "disconnected",
  serverReady: boolean,
): SystemServiceStatus {
  if (!serverReady) {
    return "down";
  }

  if (socketStatus === "connected") {
    return "connected";
  }

  if (socketStatus === "connecting") {
    return "connecting";
  }

  return "disconnected";
}

export function useSystemServices(): SystemService[] {
  const { status: socketStatus } = useSocketStatus();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["system-status"],
    queryFn: fetchSystemStatus,
    refetchInterval: 10_000,
    retry: 1,
  });

  return useMemo(() => {
    const apiStatus: SystemServiceStatus = isLoading
      ? "connecting"
      : isError
        ? "disconnected"
        : "connected";

    const kafkaStatus: SystemServiceStatus =
      data?.kafka === "connected" ? "connected" : "disconnected";

    const timescaleStatus: SystemServiceStatus =
      data?.timescaledb === "healthy" ? "healthy" : "down";

    const websocketStatus = mapSocketStatus(
      socketStatus,
      data?.websocketServer === "ready",
    );

    return [
      { id: "api", label: "API Server", status: apiStatus },
      { id: "kafka", label: "Kafka", status: kafkaStatus },
      { id: "timescale", label: "TimescaleDB", status: timescaleStatus },
      { id: "websocket", label: "WebSocket", status: websocketStatus },
    ];
  }, [data, isError, isLoading, socketStatus]);
}
