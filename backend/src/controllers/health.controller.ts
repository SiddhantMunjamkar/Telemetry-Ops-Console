import type { NextFunction, Request, Response } from "express";
import { getSystemHealth } from "../services/system-health.service";

export async function getSystemStatusHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const status = await getSystemHealth();
    res.json(status);
  } catch (error) {
    next(error);
  }
}
