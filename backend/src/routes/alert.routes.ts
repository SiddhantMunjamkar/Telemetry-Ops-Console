import { Router } from "express";
import { listAlertsHandler } from "../controllers/alert.controller";
import { getFleetHandler } from "../controllers/device.controller";

const router = Router();

router.get("/", listAlertsHandler);

export default router;
