export type SystemServiceStatus =
  | "connected"
  | "healthy"
  | "connecting"
  | "disconnected"
  | "down";

export type SystemService = {
  id: string;
  label: string;
  status: SystemServiceStatus;
};

export const SYSTEM_STATUS_LABELS: Record<SystemServiceStatus, string> = {
  connected: "Connected",
  healthy: "Healthy",
  connecting: "Connecting",
  disconnected: "Disconnected",
  down: "Down",
};

export function isSystemServiceUp(status: SystemServiceStatus): boolean {
  return status === "connected" || status === "healthy";
}

export function getSystemStatusDotClass(status: SystemServiceStatus): string {
  if (status === "connected" || status === "healthy") {
    return "bg-[var(--status-healthy)]";
  }

  if (status === "connecting") {
    return "bg-[var(--status-warning)]";
  }

  return "bg-[var(--status-critical)]";
}

export function getSystemStatusBadgeClass(status: SystemServiceStatus): string {
  if (status === "connected" || status === "healthy") {
    return "bg-[rgba(16,185,129,0.12)] text-[#059669] dark:bg-[rgba(52,211,153,0.14)] dark:text-[#34d399]";
  }

  if (status === "connecting") {
    return "bg-[rgba(245,158,11,0.12)] text-[#d97706] dark:bg-[rgba(251,191,36,0.14)] dark:text-[#fbbf24]";
  }

  return "bg-[rgba(239,68,68,0.12)] text-[#dc2626] dark:bg-[rgba(248,113,113,0.14)] dark:text-[#f87171]";
}
