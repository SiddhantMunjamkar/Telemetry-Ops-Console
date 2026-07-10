import { create } from "zustand";
import type { FleetAlert } from "@/types/alerts";

type AlertsState = {
  alerts: FleetAlert[];
  setAlerts: (alerts: FleetAlert[]) => void;
  addAlert: (alert: FleetAlert) => void;
  resolveAlert: (id: string) => void;
};

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],
  setAlerts: (alerts) => set({ alerts }),
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts.filter((item) => item.id !== alert.id)],
    })),
  resolveAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === id ? { ...alert, status: "resolved" } : alert,
      ),
    })),
}));
