"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Menu,
  MoreHorizontal,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import type { Device } from "@/types/fleet";
import { DEVICE_STATUS_LABELS, DEVICE_STATUS_STYLES } from "@/lib/constants/device-status";
import { formatRelativeTime } from "@/lib/format";
import { useIsMobile } from "@/hooks/use-media-query";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DeviceDetailPageHeaderProps = {
  device: Device;
};

export function DeviceDetailPageHeader({ device }: DeviceDetailPageHeaderProps) {
  const styles = DEVICE_STATUS_STYLES[device.status];
  const isOffline = device.status === "offline";
  const isMobile = useIsMobile();
  const { setMobileNavOpen } = useSidebar();

  return (
    <header className="mb-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/devices"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          Back to devices
        </Link>
        {isMobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="size-4" />
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{device.name}</h1>
            <span
              className={cn(
                "inline-flex h-7 items-center rounded-md border px-2.5 text-[12px] font-medium capitalize",
                styles.badge,
              )}
            >
              {device.status}
            </span>
          </div>
          <p className="text-[14px] text-body">
            {device.type}
            <span className="mx-2 text-mute">·</span>
            <span className="font-mono text-mute">{device.id}</span>
          </p>
          <p className="text-[13px] text-mute">
            <span className={cn("font-medium", styles.accent)}>
              {isOffline ? "Offline" : "Online"} · {DEVICE_STATUS_LABELS[device.status]}
            </span>
            <span className="mx-2">·</span>
            Last update {formatRelativeTime(device.lastUpdated)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-lg">
                Actions
                <ChevronDown className="size-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Restart device</DropdownMenuItem>
              <DropdownMenuItem>Run diagnostics</DropdownMenuItem>
              <DropdownMenuItem>Schedule maintenance</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-lg">
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>

          <Button variant="outline" size="sm" className="h-9 gap-1.5 rounded-lg">
            <Download className="size-3.5" />
            Export
          </Button>

          <Button variant="outline" size="icon" className="size-9 rounded-lg">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
