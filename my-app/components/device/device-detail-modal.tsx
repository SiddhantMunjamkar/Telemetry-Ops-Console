"use client";

import { ChevronDown, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { Device } from "@/types/fleet";
import { formatClockTime, type DeviceTimeRange } from "@/lib/device-modal";
import {
  DeviceModalOverview,
  TIME_RANGE_OPTIONS,
} from "@/components/device/device-modal-overview";
import { DeviceStatusBadge } from "@/components/dashboard/device-status-badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DeviceDetailModalProps = {
  device: Device | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeviceDetailModal({
  device,
  open,
  onOpenChange,
}: DeviceDetailModalProps) {
  const [timeRange, setTimeRange] = useState<DeviceTimeRange>("1h");
  const [rangeOpen, setRangeOpen] = useState(false);
  const [clock, setClock] = useState(() => formatClockTime());

  useEffect(() => {
    if (device) {
      setTimeRange("1h");
      setRangeOpen(false);
      setClock(formatClockTime());
    }
  }, [device?.id]);

  if (!device) {
    return null;
  }

  const rangeLabel =
    TIME_RANGE_OPTIONS.find((option) => option.value === timeRange)?.label ??
    "Last 1 Hour";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName="bg-black/65 backdrop-blur-[2px]"
        className="flex max-h-[min(88vh,820px)] w-[min(1080px,94vw)] max-w-none flex-col gap-0 overflow-hidden rounded-xl border-hairline bg-canvas p-0 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="border-b border-hairline px-5 py-4 pr-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <DialogTitle className="text-[20px] font-semibold leading-tight tracking-tight text-ink">
                  {device.name}
                </DialogTitle>
                <span className="text-[13px] text-mute">{device.type}</span>
                <DeviceStatusBadge status={device.status} className="text-[11px]" />
              </div>
              <DialogDescription className="sr-only">
                Device detail overview for {device.name}
              </DialogDescription>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRangeOpen((current) => !current)}
                  className="inline-flex h-7 items-center gap-1 rounded-[6px] border border-hairline bg-card px-2.5 text-[11px] font-medium text-ink transition-colors hover:bg-canvas-soft-2"
                >
                  {rangeLabel}
                  <ChevronDown className="size-3 text-mute" aria-hidden />
                </button>
                {rangeOpen ? (
                  <div className="absolute right-0 top-8 z-20 min-w-[132px] rounded-[8px] border border-hairline bg-card p-1 shadow-elevation-4">
                    {TIME_RANGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setTimeRange(option.value);
                          setRangeOpen(false);
                        }}
                        className={cn(
                          "flex w-full rounded-[4px] px-2 py-1.5 text-left text-[11px] transition-colors hover:bg-canvas-soft-2",
                          timeRange === option.value && "bg-canvas-soft-2 text-ink",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setClock(formatClockTime())}
                className="inline-flex size-7 items-center justify-center rounded-[6px] border border-hairline bg-card text-mute transition-colors hover:bg-canvas-soft-2 hover:text-ink"
                aria-label="Refresh metrics"
              >
                <RefreshCw className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-canvas-soft/40 px-5 py-4">
          <DeviceModalOverview
            device={device}
            timeRange={timeRange}
            clock={clock}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
