import { Router } from "express";
import { ingestTelemetryBatch } from "../controllers/telemetry.controller";

const router = Router();

router.post("/", ingestTelemetryBatch);

export default router;
