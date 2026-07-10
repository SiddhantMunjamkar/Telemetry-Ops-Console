import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { socketConfig } from "../config/socket";
import { logger } from "../utils/logger";

let io: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: socketConfig.corsOrigin,
      methods: [...socketConfig.corsMethods],
    },
  });

  io.on("connection", (socket) => {
    logger.info("Socket client connected", { socketId: socket.id });
  });

  logger.success("Socket.IO Ready");
  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}

export function isSocketReady(): boolean {
  return io !== null;
}
