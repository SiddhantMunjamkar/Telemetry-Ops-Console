import { getPool } from "../config/db";
import { kafka } from "../kafka/kafka";
import { isSocketReady } from "../socket/socket";

export type SystemHealthStatus = {
  kafka: "connected" | "disconnected";
  timescaledb: "healthy" | "down";
  websocketServer: "ready" | "down";
};

async function checkDatabase(): Promise<"healthy" | "down"> {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    return "healthy";
  } catch {
    return "down";
  }
}

async function checkKafka(): Promise<"connected" | "disconnected"> {
  const admin = kafka.admin();

  try {
    await admin.connect();
    await admin.describeCluster();
    return "connected";
  } catch {
    return "disconnected";
  } finally {
    await admin.disconnect().catch(() => undefined);
  }
}

export async function getSystemHealth(): Promise<SystemHealthStatus> {
  const [timescaledb, kafkaStatus] = await Promise.all([
    checkDatabase(),
    checkKafka(),
  ]);

  return {
    kafka: kafkaStatus,
    timescaledb,
    websocketServer: isSocketReady() ? "ready" : "down",
  };
}
