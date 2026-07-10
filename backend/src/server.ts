import http from "http";
import app from "./app";
import { ensureKafkaTopics, startConsumerWithRetry } from "./kafka/admin";
import { startAnalyticsConsumer } from "./kafka/consumers/analytics.consumer";
import { startStorageConsumer } from "./kafka/consumers/storage.consumer";
import { connectProducer } from "./kafka/producer";
import { serverConfig } from "./config/socket";
import { initializeSocket } from "./socket/socket";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  const server = http.createServer(app);

  initializeSocket(server);

  await connectProducer();
  await ensureKafkaTopics();

  void startConsumerWithRetry("Storage consumer", startStorageConsumer).catch((error) => {
    logger.error("Storage consumer crashed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  });

  void startConsumerWithRetry("Analytics consumer", startAnalyticsConsumer).catch((error) => {
    logger.error("Analytics consumer crashed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
  });

  server.listen(serverConfig.port, () => {
    logger.success(`API listening on http://localhost:${serverConfig.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error("Failed to start server", {
    error: error instanceof Error ? error.message : "Unknown error",
  });
  process.exit(1);
});
