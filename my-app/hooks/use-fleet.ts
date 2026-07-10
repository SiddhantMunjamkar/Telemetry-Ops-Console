"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFleet } from "@/lib/api/devices";
import { queryKeys } from "@/lib/realtime/query-keys";
import type { Device, FleetSummary } from "@/types/fleet";

type UseFleetResult = {
  devices: Device[];
  summary: FleetSummary;
  isLoading: boolean;
  isError: boolean;
};

export function useFleet(): UseFleetResult {
  const query = useQuery({
    queryKey: queryKeys.fleet,
    queryFn: fetchFleet,
  });

  return {
    devices: query.data?.devices ?? [],
    summary:
      query.data?.summary ?? {
        totalDevices: 0,
        healthy: 0,
        warning: 0,
        critical: 0,
        offline: 0,
      },
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
