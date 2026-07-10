import { getPool } from "../../config/db";
import {
  getDeviceUuidBySlug,
  insertTelemetryPoint,
  upsertDeviceHealthFromTelemetry,
} from "../../db/queries";
import type { Telemetry } from "../../types/telemetry";
import { logger } from "../../utils/logger";
import { createConsumer } from "../kafka";
import { CONSUMER_GROUPS, KAFKA_TOPICS } from "../topics";

function parseTelemetryMessage(value: Buffer | null): Telemetry {
  if (!value) {
    throw new Error("Empty Kafka message value");
  }

  const parsed: unknown = JSON.parse(value.toString("utf8"));

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid telemetry message payload");
  }

  return parsed as Telemetry;
}

export async function startStorageConsumer(): Promise<void> {
  const consumer = createConsumer(CONSUMER_GROUPS.STORAGE);
  const pool = getPool();

  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_TOPICS.TELEMETRY,
    fromBeginning: false,
  });

  logger.success("Storage Consumer Started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const telemetry = parseTelemetryMessage(message.value);
        const deviceUuid = await getDeviceUuidBySlug(pool, telemetry.deviceId);

        if (!deviceUuid) {
          logger.warn("Storage worker skipped unknown device", {
            deviceId: telemetry.deviceId,
          });
          return;
        }

        const recordedAt = new Date(telemetry.timestamp);

        await insertTelemetryPoint(pool, {
          deviceUuid,
          temperature: telemetry.temperature,
          pressure: telemetry.pressure,
          power: telemetry.power,
          vibration: telemetry.vibration,
          recordedAt,
        });

        await upsertDeviceHealthFromTelemetry(pool, {
          deviceUuid,
          temperature: telemetry.temperature,
          pressure: telemetry.pressure,
          power: telemetry.power,
          vibration: telemetry.vibration,
          recordedAt,
        });

        logger.worker(
          "Storage Worker",
          "Stored telemetry",
          telemetry.deviceName,
          {
            deviceId: telemetry.deviceId,
            temperature: telemetry.temperature,
            timestamp: telemetry.timestamp,
          },
        );
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : "Unknown storage consumer error";
        logger.error("Storage consumer failed to process message", { error: messageText });
      }
    },
  });
}
