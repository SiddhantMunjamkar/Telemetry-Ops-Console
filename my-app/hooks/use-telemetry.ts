"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAlerts } from "@/lib/api/alerts";
import { queryKeys } from "@/lib/realtime/query-keys";
import { useSocketStatus } from "@/providers/socket-provider";

export function useTelemetry() {
  return useSocketStatus();
}

export function useAlertsQuery() {
  return useQuery({
    queryKey: queryKeys.alerts,
    queryFn: () => fetchAlerts(),
  });
}
