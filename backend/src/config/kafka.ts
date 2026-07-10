export const kafkaConfig = {
  broker: process.env.KAFKA_BROKER ?? "localhost:9092",
  clientId: process.env.KAFKA_CLIENT_ID ?? "telemetry-backend",
} as const;

export const kafkaTopics = {
  TELEMETRY: "telemetry-topic",
} as const;

export const kafkaConsumerGroups = {
  STORAGE: "storage-group",
  ANALYTICS: "analytics-group",
} as const;
