export const socketConfig = {
  corsOrigin: process.env.SOCKET_CORS_ORIGIN ?? "*",
  corsMethods: ["GET", "POST"] as const,
} as const;

export const serverConfig = {
  port: Number(process.env.PORT ?? 3001),
} as const;
