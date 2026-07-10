export type Severity = "info" | "warning" | "error" | "critical";

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

export type MetricKey =
  | "cpu"
  | "memory"
  | "latency"
  | "throughput"
  | "errorRate"
  | "activeConnections";

export type MetricSnapshot = {
  cpu: number;
  memory: number;
  latency: number;
  throughput: number;
  errorRate: number;
  activeConnections: number;
  timestamp: string;
};

export type TimeSeriesPoint = {
  timestamp: string;
  value: number;
  metric: MetricKey;
};

export type TelemetryEvent = {
  id: string;
  source: string;
  type: string;
  message: string;
  severity: Severity;
  timestamp: string;
};

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: "open" | "acknowledged" | "resolved";
  timestamp: string;
};

export type TelemetryState = {
  connectionStatus: ConnectionStatus;
  metrics: MetricSnapshot | null;
  timeSeries: TimeSeriesPoint[];
  events: TelemetryEvent[];
  alerts: Alert[];
};

export type Unsubscribe = () => void;

export interface TelemetryAdapter {
  connect(): void;
  disconnect(): void;
  onStateChange(handler: (state: Partial<TelemetryState>) => void): Unsubscribe;
}
