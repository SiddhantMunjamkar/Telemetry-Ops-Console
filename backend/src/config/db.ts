import { Pool, type PoolConfig } from "pg";

export const dbConfig = {
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5433),
  database: process.env.DB_NAME ?? "telemetry",
  user: process.env.DB_USER ?? "telemetry",
  password: process.env.DB_PASSWORD ?? "telemetry123",
  poolMax: Number(process.env.DB_POOL_MAX ?? 10),
  idleTimeoutMs: Number(process.env.DB_IDLE_TIMEOUT_MS ?? 30_000),
  connectionTimeoutMs: Number(process.env.DB_CONNECTION_TIMEOUT_MS ?? 5_000),
} as const;

export function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;
}

function toPoolConfig(): PoolConfig {
  return {
    connectionString: getDatabaseUrl(),
    max: dbConfig.poolMax,
    idleTimeoutMillis: dbConfig.idleTimeoutMs,
    connectionTimeoutMillis: dbConfig.connectionTimeoutMs,
  };
}

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool(toPoolConfig());
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
