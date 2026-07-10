import type { NextFunction, Request, Response } from "express";
import { getDevice, getDeviceHistory, getFleet, listDevices } from "../services/device.service";
import { AppError } from "../utils/errors";

export async function getFleetHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const fleet = await getFleet();
    res.json(fleet);
  } catch (error) {
    next(error);
  }
}

export async function listDevicesHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const devices = await listDevices();
    res.json(devices);
  } catch (error) {
    next(error);
  }
}

export async function getDeviceHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const device = await getDevice(id);

    if (!device) {
      next(new AppError(404, "Device not found"));
      return;
    }

    res.json(device);
  } catch (error) {
    next(error);
  }
}

export async function getDeviceHistoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = String(req.params.id);
    const limit = Number(req.query.limit ?? 100);
    const history = await getDeviceHistory(id, limit);

    if (!history) {
      next(new AppError(404, "Device not found"));
      return;
    }

    res.json(history);
  } catch (error) {
    next(error);
  }
}
