"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { fetchAlerts } from "@/lib/api/alerts";
import { queryKeys } from "@/lib/realtime/query-keys";
import type {
  AlertSeverityFilter,
  AlertSort,
  FleetAlert,
} from "@/types/alerts";
import { ALERT_SEVERITY_ORDER } from "@/lib/constants/alert-severity";
import { useAlertsStore } from "@/stores/alerts-store";

type UseAlertsOptions = {
  activeOnly?: boolean;
  limit?: number;
};

type UseAlertsResult = {
  alerts: FleetAlert[];
  allAlerts: FleetAlert[];
  search: string;
  setSearch: (value: string) => void;
  severityFilter: AlertSeverityFilter;
  setSeverityFilter: (value: AlertSeverityFilter) => void;
  sort: AlertSort;
  setSort: (value: AlertSort) => void;
  resolveAlert: (id: string) => void;
  activeCount: number;
};

function sortAlerts(alerts: FleetAlert[], sort: AlertSort): FleetAlert[] {
  const sorted = [...alerts];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
    case "severity":
      return sorted.sort((a, b) => {
        const severityDiff =
          ALERT_SEVERITY_ORDER[b.severity] - ALERT_SEVERITY_ORDER[a.severity];
        if (severityDiff !== 0) return severityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );
  }
}

export function useAlerts(options: UseAlertsOptions = {}): UseAlertsResult {
  const { activeOnly = false, limit } = options;
  const allAlerts = useAlertsStore((state) => state.alerts);
  const setAlerts = useAlertsStore((state) => state.setAlerts);
  const resolveAlert = useAlertsStore((state) => state.resolveAlert);

  const alertsQuery = useQuery({
    queryKey: queryKeys.alerts,
    queryFn: () => fetchAlerts(),
  });

  useEffect(() => {
    if (alertsQuery.data) {
      setAlerts(alertsQuery.data);
    }
  }, [alertsQuery.data, setAlerts]);

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] =
    useState<AlertSeverityFilter>("all");
  const [sort, setSort] = useState<AlertSort>("newest");

  const alerts = useMemo(() => {
    let result = allAlerts;

    if (activeOnly) {
      result = result.filter((alert) => alert.status !== "resolved");
    }

    if (severityFilter !== "all") {
      result = result.filter((alert) => alert.severity === severityFilter);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter(
        (alert) =>
          alert.title.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query) ||
          alert.deviceName.toLowerCase().includes(query),
      );
    }

    result = sortAlerts(result, sort);

    if (limit !== undefined) {
      result = result.slice(0, limit);
    }

    return result;
  }, [allAlerts, activeOnly, severityFilter, search, sort, limit]);

  const activeCount = useMemo(
    () => allAlerts.filter((alert) => alert.status !== "resolved").length,
    [allAlerts],
  );

  return {
    alerts,
    allAlerts,
    search,
    setSearch,
    severityFilter,
    setSeverityFilter,
    sort,
    setSort,
    resolveAlert,
    activeCount,
  };
}
