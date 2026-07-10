import { Partitioners } from "kafkajs";
import type { Telemetry } from "../types/telemetry";
import { logger } from "../utils/logger";
import { kafka } from "./kafka";
import { KAFKA_TOPICS } from "./topics";

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

export async function connectProducer(): Promise<void> {
  await producer.connect();
  logger.success("Kafka Producer Connected");
}

export async function disconnectProducer(): Promise<void> {
  await producer.disconnect();
}

export async function publishTelemetryBatch(readings: Telemetry[]): Promise<void> {
  await producer.send({
    topic: KAFKA_TOPICS.TELEMETRY,
    messages: readings.map((reading) => ({
      key: reading.deviceId,
      value: JSON.stringify(reading),
    })),
  });

  for (const reading of readings) {
    logger.kafka(
      `Produced message to ${KAFKA_TOPICS.TELEMETRY}`,
      reading.deviceName,
    );
  }
}
