type LogLevel = "info" | "warn" | "error" | "debug";

const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
};

function formatMeta(meta?: unknown): string {
  return meta === undefined ? "" : ` ${colors.gray}${JSON.stringify(meta)}${colors.reset}`;
}

function log(level: LogLevel, message: string, meta?: unknown): void {
  const timestamp = new Date().toISOString();
  const line = `${colors.gray}[${timestamp}]${colors.reset} [${level.toUpperCase()}] ${message}${formatMeta(meta)}`;

  if (level === "error") {
    console.error(line);
    return;
  }

  if (level === "warn") {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
  success: (message: string, meta?: unknown) =>
    log("info", `${colors.green}✓ ${message}${colors.reset}`, meta),
  kafka: (message: string, deviceName: string, meta?: unknown) =>
    log(
      "info",
      `${colors.magenta}${message}${colors.reset} ${colors.cyan}device ${deviceName}${colors.reset}`,
      meta,
    ),
  worker: (
    workerName: string,
    action: string,
    deviceName: string,
    meta?: unknown,
  ) =>
    log(
      "info",
      `${colors.blue}[${workerName}]${colors.reset} ${action} ${colors.cyan}${deviceName}${colors.reset}`,
      meta,
    ),
  socket: (message: string, deviceId: string, meta?: unknown) =>
    log(
      "info",
      `${colors.yellow}${message}${colors.reset} ${colors.cyan}${deviceId}${colors.reset}`,
      meta,
    ),
};
