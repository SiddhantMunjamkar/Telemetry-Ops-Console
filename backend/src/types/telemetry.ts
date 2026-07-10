export type Telemetry = {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  temperature: number;
  pressure: number | null;
  vibration: number;
  power: number;
  timestamp: string;
};

export type TelemetryUpdatePayload = {
  deviceId: string;
  deviceName: string;
  temperature: number;
  pressure: number | null;
  power: number;
  vibration: number;
  timestamp: string;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isTelemetry(value: unknown): value is Telemetry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as Record<string, unknown>;

  return (
    typeof reading.deviceId === "string" &&
    reading.deviceId.length > 0 &&
    typeof reading.deviceName === "string" &&
    reading.deviceName.length > 0 &&
    typeof reading.deviceType === "string" &&
    reading.deviceType.length > 0 &&
    isFiniteNumber(reading.temperature) &&
    (reading.pressure === null || isFiniteNumber(reading.pressure)) &&
    isFiniteNumber(reading.vibration) &&
    isFiniteNumber(reading.power) &&
    typeof reading.timestamp === "string" &&
    reading.timestamp.length > 0
  );
}

export function parseTelemetryBatch(body: unknown): Telemetry[] {
  if (!Array.isArray(body)) {
    throw new Error("Expected an array of telemetry readings");
  }

  if (body.length === 0) {
    throw new Error("Telemetry batch cannot be empty");
  }

  const invalidIndex = body.findIndex((item) => !isTelemetry(item));
  if (invalidIndex !== -1) {
    throw new Error(`Invalid telemetry reading at index ${invalidIndex}`);
  }

  return body;
}

export function toTelemetryUpdatePayload(reading: Telemetry): TelemetryUpdatePayload {
  return {
    deviceId: reading.deviceId,
    deviceName: reading.deviceName,
    temperature: reading.temperature,
    pressure: reading.pressure,
    power: reading.power,
    vibration: reading.vibration,
    timestamp: reading.timestamp,
  };
}
