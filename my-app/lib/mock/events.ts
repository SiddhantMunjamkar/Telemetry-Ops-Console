import { getFleetData } from "@/lib/mock/fleet";
import type { EventType, TimelineEvent } from "@/types/events";

const EVENT_TEMPLATES: Record<
  EventType,
  (deviceName: string) => string[]
> = {
  status_change: (name) => [
    `${name} transitioned from healthy to warning state.`,
    `${name} health score dropped below the configured threshold.`,
    `${name} returned to healthy operating range.`,
  ],
  metric_threshold: (name) => [
    `Temperature on ${name} exceeded the upper warning limit.`,
    `Vibration on ${name} crossed the caution band for 3 consecutive readings.`,
    `Discharge pressure on ${name} spiked during load transition.`,
    `Power draw on ${name} exceeded nominal rating during peak cycle.`,
  ],
  maintenance: (name) => [
    `Scheduled maintenance window opened for ${name}.`,
    `Preventive inspection completed on ${name}.`,
    `Lubrication service recorded for ${name}.`,
  ],
  alert_triggered: (name) => [
    `New alert raised for ${name} due to elevated temperature.`,
    `Critical alert triggered on ${name} — abnormal vibration detected.`,
    `Warning alert opened for ${name} — pressure variance detected.`,
  ],
  alert_resolved: (name) => [
    `Alert on ${name} marked as resolved by operator.`,
    `Incident on ${name} auto-resolved after metrics normalized.`,
  ],
  device_online: (name) => [
    `${name} reconnected and resumed telemetry reporting.`,
    `${name} came online after scheduled reboot.`,
  ],
  device_offline: (name) => [
    `${name} stopped reporting telemetry.`,
    `Heartbeat lost from ${name} — device marked offline.`,
  ],
  configuration: (name) => [
    `Sampling interval updated on ${name}.`,
    `Threshold profile v2.1 applied to ${name}.`,
    `Alert ruleset synchronized to ${name}.`,
  ],
  system: (name) => [
    `Fleet policy sync completed — includes ${name}.`,
    `Telemetry batch ingested for ${name} and 8 peer nodes.`,
    `Mock data refresh cycle completed for ${name}.`,
  ],
};

const EVENT_TYPES = Object.keys(EVENT_TEMPLATES) as EventType[];

function pseudoRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export function getMockEvents(): TimelineEvent[] {
  const devices = getFleetData().devices;
  const events: TimelineEvent[] = [];
  const baseTime = new Date("2026-07-10T05:00:00.000Z").getTime();

  for (let index = 0; index < 72; index += 1) {
    const device = devices[index % devices.length];
    const type = EVENT_TYPES[Math.floor(pseudoRandom(index) * EVENT_TYPES.length)];
    const descriptions = EVENT_TEMPLATES[type](device.name);
    const description =
      descriptions[Math.floor(pseudoRandom(index + 100) * descriptions.length)];

    events.push({
      id: `evt-${String(index + 1).padStart(3, "0")}`,
      timestamp: new Date(
        baseTime - index * 45 * 60 * 1000 - Math.floor(pseudoRandom(index + 200) * 600000),
      ).toISOString(),
      deviceId: device.id,
      deviceName: device.name,
      eventType: type,
      description,
    });
  }

  return events.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function getUniqueDevices(
  events: TimelineEvent[],
): { id: string; name: string }[] {
  const map = new Map<string, string>();
  for (const event of events) {
    map.set(event.deviceId, event.deviceName);
  }
  return Array.from(map.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
