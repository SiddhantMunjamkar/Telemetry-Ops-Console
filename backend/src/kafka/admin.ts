import { logger } from "../utils/logger";
import { kafka } from "./kafka";
import { KAFKA_TOPICS } from "./topics";

const admin = kafka.admin();

export async function ensureKafkaTopics(): Promise<void> {
  await admin.connect();

  try {
    const existingTopics = await admin.listTopics();

    if (existingTopics.includes(KAFKA_TOPICS.TELEMETRY)) {
      logger.info(`Kafka topic ready: ${KAFKA_TOPICS.TELEMETRY}`);
      return;
    }

    await admin.createTopics({
      topics: [
        {
          topic: KAFKA_TOPICS.TELEMETRY,
          numPartitions: 3,
          replicationFactor: 1,
        },
      ],
    });

    logger.success(`Kafka topic created: ${KAFKA_TOPICS.TELEMETRY}`);
  } finally {
    await admin.disconnect();
  }
}

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function startConsumerWithRetry(
  name: string,
  startFn: () => Promise<void>,
  maxAttempts = 6,
): Promise<void> {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await startFn();
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      if (attempt === maxAttempts) {
        throw error;
      }

      const delayMs = attempt * 2_000;
      logger.warn(`${name} startup failed (attempt ${attempt}/${maxAttempts})`, {
        error: message,
        retryInMs: delayMs,
      });
      await wait(delayMs);
    }
  }
}
