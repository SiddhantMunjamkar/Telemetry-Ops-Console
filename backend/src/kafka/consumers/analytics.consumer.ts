import { getPool } from "../../config/db";
import { processTelemetryAnalytics } from "../../services/analytics.service";
import { getFleet } from "../../services/device.service";
import { realtimeService } from "../../services/realtime.service";
import type { Telemetry } from "../../types/telemetry";
import { toTelemetryUpdatePayload } from "../../types/telemetry";
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

export async function startAnalyticsConsumer(): Promise<void> {
  const consumer = createConsumer(CONSUMER_GROUPS.ANALYTICS);
  const pool = getPool();

  await consumer.connect();
  await consumer.subscribe({
    topic: KAFKA_TOPICS.TELEMETRY,
    fromBeginning: false,
  });

  logger.success("Analytics Consumer Started");

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const telemetry = parseTelemetryMessage(message.value);

        logger.worker(
          "Analytics Worker",
          "Received telemetry",
          telemetry.deviceName,
          {
            deviceId: telemetry.deviceId,
            temperature: telemetry.temperature,
            timestamp: telemetry.timestamp,
          },
        );

        realtimeService.broadcastTelemetryUpdate(toTelemetryUpdatePayload(telemetry));

        // Detect threshold violations, write alerts, update device health.
        await processTelemetryAnalytics(pool, telemetry);

        const fleet = await getFleet();
        realtimeService.broadcastFleetUpdate(fleet.summary);
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : "Unknown analytics consumer error";
        logger.error("Analytics consumer failed to process message", { error: messageText });
      }
    },
  });
}
