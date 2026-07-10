import type { DeviceProfile, DeviceRuntimeState } from "./types";

export const DEVICE_PROFILES: DeviceProfile[] = [
  {
    id: "motor-1",
    name: "Motor-1",
    type: "motor",
    baseline: { temperature: 70, pressure: null, vibration: 3.0, power: 300 },
    range: {
      temperature: { min: 60, max: 80, noise: 0.8 },
      pressure: null,
      vibration: { min: 2.2, max: 3.8, noise: 0.15 },
      power: { min: 285, max: 315, noise: 4 },
    },
  },
  {
    id: "motor-2",
    name: "Motor-2",
    type: "motor",
    baseline: { temperature: 72, pressure: null, vibration: 2.9, power: 298 },
    range: {
      temperature: { min: 62, max: 82, noise: 0.9 },
      pressure: null,
      vibration: { min: 2.1, max: 3.7, noise: 0.14 },
      power: { min: 282, max: 312, noise: 4.5 },
    },
  },
  {
    id: "pump-1",
    name: "Pump-1",
    type: "pump",
    baseline: { temperature: 42, pressure: 100, vibration: 1.5, power: 200 },
    range: {
      temperature: { min: 35, max: 55, noise: 0.6 },
      pressure: { min: 92, max: 108, noise: 1.2 },
      vibration: { min: 1.0, max: 2.0, noise: 0.1 },
      power: { min: 188, max: 212, noise: 3 },
    },
  },
  {
    id: "pump-2",
    name: "Pump-2",
    type: "pump",
    baseline: { temperature: 44, pressure: 98, vibration: 1.4, power: 198 },
    range: {
      temperature: { min: 36, max: 54, noise: 0.55 },
      pressure: { min: 90, max: 106, noise: 1.1 },
      vibration: { min: 0.9, max: 1.9, noise: 0.09 },
      power: { min: 186, max: 210, noise: 2.8 },
    },
  },
  {
    id: "cooling-unit-1",
    name: "Cooling-Unit-1",
    type: "cooling",
    baseline: { temperature: 25, pressure: 70, vibration: 0.8, power: 150 },
    range: {
      temperature: { min: 20, max: 30, noise: 0.4 },
      pressure: { min: 64, max: 76, noise: 0.8 },
      vibration: { min: 0.5, max: 1.2, noise: 0.08 },
      power: { min: 140, max: 160, noise: 2.5 },
    },
  },
];

export function createDeviceStates(): DeviceRuntimeState[] {
  return DEVICE_PROFILES.map((profile) => ({
    profile,
    temperature: profile.baseline.temperature,
    pressure: profile.baseline.pressure,
    vibration: profile.baseline.vibration,
    power: profile.baseline.power,
    activeAnomaly: null,
    offlineUntil: null,
    duplicateNextBatch: false,
    lastReading: null,
  }));
}
