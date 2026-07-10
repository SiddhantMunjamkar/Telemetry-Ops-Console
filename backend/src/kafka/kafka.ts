import { Kafka, type Consumer } from "kafkajs";
import { kafkaConfig } from "../config/kafka";

export const kafka = new Kafka({
  clientId: kafkaConfig.clientId,
  brokers: [kafkaConfig.broker],
});

export function createConsumer(groupId: string): Consumer {
  return kafka.consumer({ groupId });
}
