import type {
  ActiveAnomaly,
  AnomalyType,
  DeviceProfile,
  DeviceRuntimeState,
} from "./types";
import { ANOMALY_LABELS, SIMULATOR_CONFIG } from "./types";

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pickAnomalyType(profile: DeviceProfile): AnomalyType {
  const candidates: AnomalyType[] = ["overheating", "bearing_failure", "sensor_offline", "duplicate_reading", "noise_spike"];

  if (profile.type === "pump" || profile.type === "cooling") {
    candidates.push("pressure_loss");
  }

  return candidates[Math.floor(Math.random() * candidates.length)]!;
}

function anomalyDuration(type: AnomalyType): number {
  switch (type) {
    case "sensor_offline":
      return Math.ceil(SIMULATOR_CONFIG.OFFLINE_DURATION_MS / SIMULATOR_CONFIG.INTERVAL_MS);
    case "duplicate_reading":
      return 1;
    case "noise_spike":
      return 1;
    case "overheating":
      return Math.floor(randomBetween(8, 14));
    case "pressure_loss":
      return Math.floor(randomBetween(7, 12));
    case "bearing_failure":
      return Math.floor(randomBetween(6, 10));
    default:
      return 5;
  }
}

export function tryStartAnomaly(state: DeviceRuntimeState): ActiveAnomaly | null {
  if (state.activeAnomaly || state.offlineUntil) {
    return null;
  }

  if (Math.random() > SIMULATOR_CONFIG.ANOMALY_PROBABILITY) {
    return null;
  }

  const type = pickAnomalyType(state.profile);

  if (type === "sensor_offline") {
    state.offlineUntil = Date.now() + SIMULATOR_CONFIG.OFFLINE_DURATION_MS;
  }

  if (type === "duplicate_reading") {
    state.duplicateNextBatch = true;
  }

  return {
    type,
    startedAt: new Date().toISOString(),
    tick: 0,
    durationTicks: anomalyDuration(type),
    metric:
      type === "noise_spike"
        ? (["temperature", "pressure", "vibration", "power"] as const)[
            Math.floor(Math.random() * 4)
          ]
        : undefined,
  };
}

export function applyAnomalyEffects(state: DeviceRuntimeState): void {
  const anomaly = state.activeAnomaly;
  if (!anomaly) {
    return;
  }

  const progress = anomaly.tick / Math.max(anomaly.durationTicks, 1);

  switch (anomaly.type) {
    case "overheating":
      state.temperature += randomBetween(1.5, 3.5) + progress * 1.2;
      state.power += randomBetween(2, 6);
      break;

    case "pressure_loss":
      if (state.pressure !== null) {
        state.pressure -= randomBetween(1.5, 3.5) + progress * 0.8;
        state.pressure = Math.max(0, state.pressure);
      }
      break;

    case "bearing_failure":
      state.vibration += randomBetween(0.2, 0.6) + progress * 0.4;
      state.power += randomBetween(1, 4);
      break;

    case "noise_spike": {
      const spike = randomBetween(25, 45);
      switch (anomaly.metric) {
        case "temperature":
          state.temperature += spike;
          break;
        case "pressure":
          if (state.pressure !== null) {
            state.pressure += spike;
          }
          break;
        case "vibration":
          state.vibration += spike / 10;
          break;
        case "power":
          state.power += spike;
          break;
        default:
          state.temperature += spike;
      }
      break;
    }

    case "sensor_offline":
    case "duplicate_reading":
      break;
  }

  anomaly.tick += 1;

  if (anomaly.tick >= anomaly.durationTicks) {
    state.activeAnomaly = null;
    if (anomaly.type !== "duplicate_reading") {
      state.duplicateNextBatch = false;
    }
  }
}

export function isDeviceOffline(state: DeviceRuntimeState, now = Date.now()): boolean {
  if (!state.offlineUntil) {
    return false;
  }

  if (now >= state.offlineUntil) {
    state.offlineUntil = null;
    return false;
  }

  return true;
}

export function formatAnomalyStart(state: DeviceRuntimeState, anomaly: ActiveAnomaly): string {
  return `⚠️  ${ANOMALY_LABELS[anomaly.type]} started on ${state.profile.name}`;
}
