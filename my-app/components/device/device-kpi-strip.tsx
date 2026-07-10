"use client";

import {
  Activity,
  Gauge,
  HeartPulse,
  RotateCw,
  Thermometer,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Device } from "@/types/fleet";
import type { DeviceMetadata } from "@/lib/mock/device-metadata";
import {
  DEVICE_METRIC_COLORS,
  deviceSurfaceClass,
  deviceSurfaceHoverClass,
} from "@/lib/constants/device-detail";
import { generateSparkline } from "@/lib/mock/telemetry-throughput";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { SparklineChart } from "@/components/charts/sparkline-chart";
import { cn } from "@/lib/utils";

type DeviceKpiStripProps = {
  device: Device;
  metadata: DeviceMetadata;
};

type KpiCard = {
  key: string;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  color: string;
  seed: string;
};

export function DeviceKpiStrip({ device, metadata }: DeviceKpiStripProps) {
  const isOffline = device.status === "offline";

  const cards: KpiCard[] = [
    {
      key: "health",
      label: "Health",
      value: device.healthScore,
      suffix: "%",
      decimals: 0,
      icon: HeartPulse,
      color: DEVICE_METRIC_COLORS.health,
      seed: `${device.id}-health`,
    },
    {
      key: "temperature",
      label: "Temperature",
      value: device.temperature,
      suffix: "°C",
      decimals: 1,
      icon: Thermometer,
      color: DEVICE_METRIC_COLORS.temperature,
      seed: `${device.id}-temp`,
    },
    {
      key: "pressure",
      label: "Pressure",
      value: device.pressure,
      suffix: " PSI",
      decimals: 1,
      icon: Gauge,
      color: DEVICE_METRIC_COLORS.pressure,
      seed: `${device.id}-pressure`,
    },
    {
      key: "power",
      label: "Power",
      value: device.power,
      suffix: " kW",
      decimals: 1,
      icon: Zap,
      color: DEVICE_METRIC_COLORS.power,
      seed: `${device.id}-power`,
    },
    {
      key: "vibration",
      label: "Vibration",
      value: device.vibration,
      suffix: " mm/s",
      decimals: 2,
      icon: Activity,
      color: DEVICE_METRIC_COLORS.vibration,
      seed: `${device.id}-vibration`,
    },
    {
      key: "rpm",
      label: "RPM",
      value: metadata.rpm,
      decimals: 0,
      icon: RotateCw,
      color: DEVICE_METRIC_COLORS.rpm,
      seed: `${device.id}-rpm`,
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-ink">Live Telemetry</h2>
        <p className="mt-1 text-[14px] text-body">
          Real-time operational metrics from the connected device.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.key}
              className={cn(
                deviceSurfaceClass,
                deviceSurfaceHoverClass,
                "flex h-[120px] flex-col justify-between p-5",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-mute">
                  {card.label}
                </p>
                <div className="flex size-8 items-center justify-center rounded-full border border-hairline bg-canvas-soft">
                  <Icon className="size-4 text-mute" aria-hidden />
                </div>
              </div>

              <div>
                <p className="text-[32px] font-bold leading-none tabular-nums text-ink">
                  {isOffline ? (
                    "—"
                  ) : (
                    <>
                      <AnimatedCounter value={card.value} decimals={card.decimals} />
                      {card.suffix ? (
                        <span className="text-sm font-medium text-mute">{card.suffix}</span>
                      ) : null}
                    </>
                  )}
                </p>
                <SparklineChart
                  data={generateSparkline(card.seed)}
                  color={card.color}
                  className="mt-2 h-6"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
