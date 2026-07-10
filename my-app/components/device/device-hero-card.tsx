import { Server } from "lucide-react";
import type { Device } from "@/types/fleet";
import type { DeviceMetadata } from "@/lib/mock/device-metadata";
import { DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { DEVICE_METRIC_COLORS } from "@/lib/constants/device-detail";
import { deviceSurfaceClass } from "@/lib/constants/device-detail";
import { formatRelativeTime } from "@/lib/format";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { cn } from "@/lib/utils";

type DeviceHeroCardProps = {
  device: Device;
  metadata: DeviceMetadata;
};

function HealthRing({ score, color }: { score: number; color: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex size-24 shrink-0 items-center justify-center">
      <svg className="size-24 -rotate-90" viewBox="0 0 88 88" aria-hidden>
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-canvas-soft-2"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-xl font-bold tabular-nums text-ink">
        <AnimatedCounter value={score} />%
      </span>
    </div>
  );
}

export function DeviceHeroCard({ device, metadata }: DeviceHeroCardProps) {
  const styles = DEVICE_STATUS_STYLES[device.status];
  const isOffline = device.status === "offline";
  const healthColor = DEVICE_METRIC_COLORS.health;

  const stats = [
    { label: "Telemetry Rate", value: `${metadata.telemetryRate}/s` },
    { label: "Runtime Hours", value: metadata.runtimeHours.toLocaleString() },
    { label: "Uptime", value: `${metadata.uptimePercent}%` },
    { label: "Last Heartbeat", value: formatRelativeTime(device.lastUpdated) },
    { label: "Response Latency", value: `${metadata.responseLatencyMs} ms` },
  ];

  const details = [
    { label: "Location", value: metadata.location },
    { label: "Model", value: metadata.model },
    { label: "Serial", value: metadata.serialNumber },
    { label: "Firmware", value: metadata.firmware },
    { label: "Installed", value: metadata.installedDate },
  ];

  return (
    <section className={cn(deviceSurfaceClass, "mb-8 min-h-[220px] py-5")}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-w-0 gap-4">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-xl border border-hairline bg-canvas-soft",
              styles.accent,
            )}
          >
            <Server className="size-6" aria-hidden />
          </div>
          <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-2 text-[13px]">
            {details.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-[11px] text-mute">{item.label}</dt>
                <dd className="truncate font-medium text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-hairline pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
                Health Score
              </p>
              <p className="mt-1 text-[13px] text-body">
                Connection:{" "}
                <span className={cn("font-medium", styles.accent)}>
                  {isOffline ? "Disconnected" : "Connected"}
                </span>
              </p>
            </div>
            <HealthRing
              score={isOffline ? 0 : device.healthScore}
              color={healthColor}
            />
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[11px] text-mute">{stat.label}</dt>
                <dd className="text-[13px] font-semibold tabular-nums text-ink">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
