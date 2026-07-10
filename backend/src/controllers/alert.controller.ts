import type { NextFunction, Request, Response } from "express";
import { getAlerts } from "../services/alert.service";

export async function listAlertsHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const deviceId =
      typeof req.query.deviceId === "string" ? req.query.deviceId : undefined;
    const alerts = await getAlerts(deviceId);
    res.json(alerts);
  } catch (error) {
    next(error);
  }
}
