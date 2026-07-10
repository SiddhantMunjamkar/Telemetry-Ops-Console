import { z } from "zod";

export const severitySchema = z.enum(["info", "warning", "error", "critical"]);

export const connectionStatusSchema = z.enum([
  "connected",
  "connecting",
  "disconnected",
]);

export const metricKeySchema = z.enum([
  "cpu",
  "memory",
  "latency",
  "throughput",
  "errorRate",
  "activeConnections",
]);

export const metricSnapshotSchema = z.object({
  cpu: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  latency: z.number().min(0),
  throughput: z.number().min(0),
  errorRate: z.number().min(0).max(100),
  activeConnections: z.number().int().min(0),
  timestamp: z.string().datetime(),
});

export const timeSeriesPointSchema = z.object({
  timestamp: z.string().datetime(),
  value: z.number(),
  metric: metricKeySchema,
});

export const telemetryEventSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  type: z.string().min(1),
  message: z.string().min(1),
  severity: severitySchema,
  timestamp: z.string().datetime(),
});

export const alertSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  severity: severitySchema,
  status: z.enum(["open", "acknowledged", "resolved"]),
  timestamp: z.string().datetime(),
});

export const telemetryStateSchema = z.object({
  connectionStatus: connectionStatusSchema,
  metrics: metricSnapshotSchema.nullable(),
  timeSeries: z.array(timeSeriesPointSchema),
  events: z.array(telemetryEventSchema),
  alerts: z.array(alertSchema),
});
