import type { NextFunction, Request, Response } from "express";
import { publishTelemetryBatch } from "../kafka/producer";
import { parseTelemetryBatch } from "../types/telemetry";
import { AppError } from "../utils/errors";
import { logger } from "../utils/logger";

export async function ingestTelemetryBatch(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const readings = parseTelemetryBatch(req.body);

    await publishTelemetryBatch(readings);

    logger.info("Accepted telemetry batch", { count: readings.length });

    res.status(202).json({
      accepted: readings.length,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error && !(error instanceof AppError)) {
      next(new AppError(400, error.message));
      return;
    }

    next(error);
  }
}
