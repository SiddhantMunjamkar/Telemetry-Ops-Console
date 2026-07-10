import { Router } from "express";
import {
  getDeviceHandler,
  getDeviceHistoryHandler,
  listDevicesHandler,
} from "../controllers/device.controller";

const router = Router();

router.get("/", listDevicesHandler);
router.get("/:id/history", getDeviceHistoryHandler);
router.get("/:id", getDeviceHandler);

export default router;
