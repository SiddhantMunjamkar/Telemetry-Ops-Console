import { applyAnomalyEffects, isDeviceOffline, tryStartAnomaly } from "./anomaly";
import type { DeviceRuntimeState, TelemetryReading } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function driftTowardBaseline(
  current: number,
  baseline: number,
  noise: number,
  min: number,
  max: number,
): number {
  const pull = (baseline - current) * 0.18;
  const jitter = (Math.random() - 0.5) * noise;
  return clamp(current + pull + jitter, min, max);
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function toReading(state: DeviceRuntimeState): TelemetryReading {
  return {
    deviceId: state.profile.id,
    deviceName: state.profile.name,
    deviceType: state.profile.type,
    temperature: round(state.temperature),
    pressure: state.pressure === null ? null : round(state.pressure),
    vibration: round(state.vibration, 2),
    power: round(state.power),
    timestamp: new Date().toISOString(),
  };
}

export function advanceDeviceState(state: DeviceRuntimeState): TelemetryReading | null {
  if (isDeviceOffline(state)) {
    return null;
  }

  const { profile } = state;
  const { baseline, range } = profile;

  state.temperature = driftTowardBaseline(
    state.temperature,
    baseline.temperature,
    range.temperature.noise,
    range.temperature.min,
    range.temperature.max,
  );

  if (state.pressure !== null && range.pressure) {
    state.pressure = driftTowardBaseline(
      state.pressure,
      baseline.pressure ?? state.pressure,
      range.pressure.noise,
      range.pressure.min,
      range.pressure.max,
    );
  }

  state.vibration = driftTowardBaseline(
    state.vibration,
    baseline.vibration,
    range.vibration.noise,
    range.vibration.min,
    range.vibration.max,
  );

  state.power = driftTowardBaseline(
    state.power,
    baseline.power,
    range.power.noise,
    range.power.min,
    range.power.max,
  );

  if (!state.activeAnomaly) {
    const anomaly = tryStartAnomaly(state);
    if (anomaly) {
      state.activeAnomaly = anomaly;
    }
  }

  if (state.activeAnomaly) {
    applyAnomalyEffects(state);
  }

  const reading = toReading(state);
  state.lastReading = reading;
  return reading;
}

export function buildBatch(states: DeviceRuntimeState[]): TelemetryReading[] {
  const batch: TelemetryReading[] = [];

  for (const state of states) {
    const reading = advanceDeviceState(state);
    if (!reading) {
      continue;
    }

    batch.push(reading);

    if (state.duplicateNextBatch && state.lastReading) {
      batch.push({ ...state.lastReading });
      state.duplicateNextBatch = false;
    }
  }

  return batch;
}
