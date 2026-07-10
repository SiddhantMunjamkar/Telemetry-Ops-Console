import cors from "cors";
import express from "express";
import alertRoutes from "./routes/alert.routes";
import deviceRoutes from "./routes/device.routes";
import telemetryRoutes from "./routes/telemetry.routes";
import { getSystemStatusHandler } from "./controllers/health.controller";
import { getFleetHandler } from "./controllers/device.controller";
import { errorHandler, notFoundHandler } from "./utils/errors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/system/status", getSystemStatusHandler);

app.get("/fleet", getFleetHandler);
app.use("/telemetry", telemetryRoutes);
app.use("/devices", deviceRoutes);
app.use("/alerts", alertRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
