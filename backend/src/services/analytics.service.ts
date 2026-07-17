import type { Pool } from "pg";
import {
  findActiveAlertTypes,
  getDeviceUuidBySlug,
  insertAlert,
  resolveActiveAlerts,
  updateDeviceHealth,
} from "../db/queries";
import type { Telemetry } from "../types/telemetry";
import { logger } from "../utils/logger";
import { toAlertTitle } from "./alert.service";
import { realtimeService } from "./realtime.service";

type AlertSeverity = "warning" | "critical";

type Violation = {
  type: string;
  severity: AlertSeverity;
  message: string;
};

type Band = { warning: number; critical: number };

type DeviceThresholds = {
  temperature: Band;
  vibration: Band;
  power: Band;
  // Pressure bands only apply to devices that report pressure (pumps, cooling).
  pressureLow?: Band;
  pressureHigh?: Band;
};

// Bands sit above the simulator's normal operating ranges so alerts only
// fire during anomalies (overheating, pressure loss, bearing failure, spikes).
const THRESHOLDS: Record<string, DeviceThresholds> = {
  motor: {
    temperature: { warning: 85, critical: 95 },
    vibration: { warning: 4.2, critical: 5.5 },
    power: { warning: 330, critical: 360 },
  },
  pump: {
    temperature: { warning: 60, critical: 70 },
    vibration: { warning: 2.5, critical: 3.5 },
    power: { warning: 225, critical: 250 },
    pressureLow: { warning: 85, critical: 70 },
    pressureHigh: { warning: 115, critical: 130 },
  },
  cooling: {
    temperature: { warning: 33, critical: 42 },
    vibration: { warning: 1.6, critical: 2.4 },
    power: { warning: 172, critical: 190 },
    pressureLow: { warning: 58, critical: 45 },
    pressureHigh: { warning: 82, critical: 95 },
  },
};

export const ALERT_TYPES = {
  OVERHEATING: "overheating",
  EXCESSIVE_VIBRATION: "excessive_vibration",
  POWER_SURGE: "power_surge",
  PRESSURE_LOSS: "pressure_loss",
  PRESSURE_SPIKE: "pressure_spike",
} as const;

const MANAGED_ALERT_TYPES: string[] = Object.values(ALERT_TYPES);

function checkHigh(
  value: number,
  band: Band,
  type: string,
  label: string,
  unit: string,
  deviceName: string,
): Violation | null {
  if (value >= band.critical) {
    return {
      type,
      severity: "critical",
      message: `${deviceName} ${label} at ${value.toFixed(1)}${unit} exceeded critical threshold (${band.critical}${unit}).`,
    };
  }

  if (value >= band.warning) {
    return {
      type,
      severity: "warning",
      message: `${deviceName} ${label} at ${value.toFixed(1)}${unit} exceeded warning threshold (${band.warning}${unit}).`,
    };
  }

  return null;
}

function checkLow(
  value: number,
  band: Band,
  type: string,
  label: string,
  unit: string,
  deviceName: string,
): Violation | null {
  if (value <= band.critical) {
    return {
      type,
      severity: "critical",
      message: `${deviceName} ${label} dropped to ${value.toFixed(1)}${unit}, below critical threshold (${band.critical}${unit}).`,
    };
  }

  if (value <= band.warning) {
    return {
      type,
      severity: "warning",
      message: `${deviceName} ${label} dropped to ${value.toFixed(1)}${unit}, below warning threshold (${band.warning}${unit}).`,
    };
  }

  return null;
}

export function evaluateTelemetry(reading: Telemetry): Violation[] {
  const thresholds = THRESHOLDS[reading.deviceType];
  if (!thresholds) {
    return [];
  }

  const violations: Violation[] = [];
  const name = reading.deviceName;

  const temp = checkHigh(
    reading.temperature,
    thresholds.temperature,
    ALERT_TYPES.OVERHEATING,
    "temperature",
    "°C",
    name,
  );
  if (temp) violations.push(temp);

  const vibration = checkHigh(
    reading.vibration,
    thresholds.vibration,
    ALERT_TYPES.EXCESSIVE_VIBRATION,
    "vibration",
    " mm/s",
    name,
  );
  if (vibration) violations.push(vibration);

  const power = checkHigh(
    reading.power,
    thresholds.power,
    ALERT_TYPES.POWER_SURGE,
    "power draw",
    "W",
    name,
  );
  if (power) violations.push(power);

  if (reading.pressure !== null) {
    if (thresholds.pressureLow) {
      const low = checkLow(
        reading.pressure,
        thresholds.pressureLow,
        ALERT_TYPES.PRESSURE_LOSS,
        "pressure",
        " PSI",
        name,
      );
      if (low) violations.push(low);
    }

    if (thresholds.pressureHigh) {
      const high = checkHigh(
        reading.pressure,
        thresholds.pressureHigh,
        ALERT_TYPES.PRESSURE_SPIKE,
        "pressure",
        " PSI",
        name,
      );
      if (high) violations.push(high);
    }
  }

  return violations;
}

function computeHealth(violations: Violation[]): {
  healthScore: number;
  status: "healthy" | "warning" | "critical";
} {
  if (violations.some((violation) => violation.severity === "critical")) {
    return { healthScore: 30, status: "critical" };
  }

  if (violations.length > 0) {
    return { healthScore: 65, status: "warning" };
  }

  return { healthScore: 100, status: "healthy" };
}

export async function processTelemetryAnalytics(
  pool: Pool,
  reading: Telemetry,
): Promise<void> {
  const deviceUuid = await getDeviceUuidBySlug(pool, reading.deviceId);

  if (!deviceUuid) {
    logger.warn("Analytics worker skipped unknown device", {
      deviceId: reading.deviceId,
    });
    return;
  }

  const violations = evaluateTelemetry(reading);
  const { healthScore, status } = computeHealth(violations);

  await updateDeviceHealth(pool, { deviceUuid, healthScore, status });

  const violatedTypes = violations.map((violation) => violation.type);
  const clearedTypes = MANAGED_ALERT_TYPES.filter(
    (type) => !violatedTypes.includes(type),
  );
  await resolveActiveAlerts(pool, deviceUuid, clearedTypes);

  if (violations.length === 0) {
    return;
  }

  const activeTypes = await findActiveAlertTypes(pool, deviceUuid);

  for (const violation of violations) {
    if (activeTypes.includes(violation.type)) {
      continue;
    }

    const row = await insertAlert(pool, {
      deviceUuid,
      severity: violation.severity,
      type: violation.type,
      message: violation.message,
    });

    logger.info("Alert created", {
      device: reading.deviceName,
      type: violation.type,
      severity: violation.severity,
    });

    realtimeService.broadcastAlertNew({
      id: row.id,
      severity: violation.severity,
      deviceId: reading.deviceId,
      deviceName: reading.deviceName,
      title: toAlertTitle(violation.type),
      description: violation.message,
      timestamp: row.created_at.toISOString(),
      status: "active",
    });
  }
}
