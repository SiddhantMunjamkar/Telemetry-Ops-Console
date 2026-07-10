import { formatAnomalyStart } from "./anomaly";
import { createDeviceStates } from "./devices";
import { buildBatch } from "./generator";
import type { DeviceRuntimeState, TelemetryReading } from "./types";
import { SIMULATOR_CONFIG } from "./types";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", { hour12: false });
}

function formatReadingLine(reading: TelemetryReading): string {
  const name = reading.deviceName.padEnd(14, " ");
  const temp = `Temp: ${reading.temperature}°C`;

  if (reading.deviceType === "motor") {
    return `${name} ${temp}  Power: ${reading.power}W  Vib: ${reading.vibration} mm/s`;
  }

  return `${name} ${temp}  Press: ${reading.pressure} PSI  Power: ${reading.power}W  Vib: ${reading.vibration} mm/s`;
}

function logBatch(readings: TelemetryReading[]): void {
  console.log(`\n[${formatTime(new Date())}]`);
  console.log("Generated Batch");
  console.log("─".repeat(60));

  for (const reading of readings) {
    console.log(formatReadingLine(reading));
  }

  console.log(`\nSending ${readings.length} telemetry record${readings.length === 1 ? "" : "s"}...`);
}

function logNewAnomalies(before: DeviceRuntimeState[], after: DeviceRuntimeState[]): void {
  for (let index = 0; index < after.length; index += 1) {
    const previous = before[index]?.activeAnomaly;
    const current = after[index]?.activeAnomaly;

    if (!previous && current) {
      console.log(formatAnomalyStart(after[index]!, current));
    }
  }
}

async function sendBatch(readings: TelemetryReading[]): Promise<void> {
  if (readings.length === 0) {
    console.log("No telemetry records in this batch (devices may be offline).");
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SIMULATOR_CONFIG.REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(SIMULATOR_CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readings),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HTTP ${response.status}: ${body}`);
    }

    console.log(`✓ Batch accepted (${response.status})`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`✗ Failed to send batch: ${message}`);
  } finally {
    clearTimeout(timeout);
  }
}

export class SensorSimulator {
  private readonly states = createDeviceStates();
  private timer: NodeJS.Timeout | null = null;
  private running = false;

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;

    console.log("Sensor Simulator started");
    console.log(`Devices: ${SIMULATOR_CONFIG.DEVICE_COUNT}`);
    console.log(`Interval: ${SIMULATOR_CONFIG.INTERVAL_MS}ms`);
    console.log(`Target: POST ${SIMULATOR_CONFIG.API_URL}`);
    console.log("Press Ctrl+C to stop.\n");

    void this.tick();

    this.timer = setInterval(() => {
      void this.tick();
    }, SIMULATOR_CONFIG.INTERVAL_MS);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    this.running = false;
    console.log("\nSensor Simulator stopped.");
  }

  private async tick(): Promise<void> {
    const snapshot = this.states.map((state) => ({
      ...state,
      activeAnomaly: state.activeAnomaly ? { ...state.activeAnomaly } : null,
    }));

    const batch = buildBatch(this.states);
    logNewAnomalies(snapshot, this.states);
    logBatch(batch);
    await sendBatch(batch);
  }
}

function main(): void {
  const simulator = new SensorSimulator();

  process.on("SIGINT", () => {
    simulator.stop();
    process.exit(0);
  });

  simulator.start();
}

if (require.main === module) {
  main();
}
