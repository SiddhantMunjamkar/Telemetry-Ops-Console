"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Device, DeviceStatus } from "@/types/fleet";
import { DEVICE_STATUS_LABELS } from "@/lib/constants/device-status";
import { DeviceStripCard } from "@/components/dashboard/device-strip-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const STATUS_ORDER: Record<DeviceStatus, number> = {
  critical: 0,
  warning: 1,
  offline: 2,
  healthy: 3,
};

const FILTER_OPTIONS: Array<{ value: DeviceStatus | null; label: string }> = [
  { value: null, label: "All" },
  { value: "healthy", label: DEVICE_STATUS_LABELS.healthy },
  { value: "warning", label: DEVICE_STATUS_LABELS.warning },
  { value: "critical", label: DEVICE_STATUS_LABELS.critical },
  { value: "offline", label: DEVICE_STATUS_LABELS.offline },
];

type DeviceStripProps = {
  devices: Device[];
  filter?: DeviceStatus | null;
  onFilterChange?: (filter: DeviceStatus | null) => void;
  onDeviceSelect?: (device: Device) => void;
  className?: string;
};

export function DeviceStrip({
  devices,
  filter = null,
  onFilterChange,
  onDeviceSelect,
  className,
}: DeviceStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const visible = (filter ? devices.filter((d) => d.status === filter) : devices).sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );

  const activeFilterLabel =
    FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? "All";

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 420, behavior: "smooth" });
  };

  return (
    <section className={cn("mt-8", className)}>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-semibold text-ink">Device Status</h2>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1 rounded-md border border-hairline bg-canvas-soft px-2.5 text-[12px] text-mute outline-none transition-colors hover:border-hairline-strong hover:text-ink focus-visible:ring-2 focus-visible:ring-ring">
              Filter: {activeFilterLabel}
              <ChevronDown className="size-3 opacity-70" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[140px]">
              {FILTER_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.label}
                  onClick={() => onFilterChange?.(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Link
          href="/devices"
          className="shrink-0 text-[13px] font-medium text-link transition-colors hover:text-link-deep"
        >
          View all devices →
        </Link>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-body-sm text-mute">
          No devices match the current filter.
        </p>
      ) : (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-1 pr-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {visible.map((device) => (
              <DeviceStripCard
                key={device.id}
                device={device}
                onSelect={onDeviceSelect}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollRight}
            className="absolute -right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-card text-mute shadow-sm transition-colors hover:border-hairline-strong hover:text-ink"
            aria-label="Scroll devices right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </section>
  );
}
