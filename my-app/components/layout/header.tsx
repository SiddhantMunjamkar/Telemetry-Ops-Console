"use client";

import { usePathname } from "next/navigation";
import { ChevronRight, Menu, Moon, Search, Sun, Wifi } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { LAYOUT } from "@/lib/constants/layout";
import { getBreadcrumbs } from "@/lib/constants/navigation";
import { usesDeviceDetailHeader, usesPageHero } from "@/lib/constants/page-hero";
import { useLiveClock } from "@/hooks/use-live-clock";
import { useTelemetry } from "@/hooks/use-telemetry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type HeaderProps = {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  className?: string;
};

export function Header({
  onMenuClick,
  showMenuButton = false,
  className,
}: HeaderProps) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const liveClock = useLiveClock();
  const { status: socketStatus } = useTelemetry();

  if (usesPageHero(pathname) || usesDeviceDetailHeader(pathname)) {
    return null;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-20 w-full shrink-0 border-b border-hairline bg-canvas/90 backdrop-blur-md",
        className,
      )}
      style={{ height: LAYOUT.headerHeight }}
    >
      <div className="flex h-full items-center gap-4 px-8">
        {showMenuButton ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <Menu className="size-4" />
          </Button>
        ) : null}

        <nav aria-label="Breadcrumb" className="hidden min-w-0 shrink-0 md:block">
          <ol className="flex items-center gap-1.5 text-body-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight className="size-3.5 text-mute" aria-hidden />
                ) : null}
                <span
                  className={cn(
                    "font-medium",
                    index === breadcrumbs.length - 1
                      ? "text-ink"
                      : "text-mute",
                  )}
                >
                  {crumb}
                </span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="relative w-full max-w-[480px] flex-1">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search devices, alerts..."
              className="h-11 rounded-xl border-hairline bg-canvas-soft pl-10 pr-14 text-body-sm"
              aria-label="Search devices and alerts"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-hairline bg-canvas px-1.5 py-0.5 font-mono text-[10px] text-mute sm:inline">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>

          <div className="hidden items-center gap-1.5 lg:flex">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full motion-safe:animate-ping rounded-full bg-[var(--status-telemetry)] opacity-40" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--status-telemetry)]" />
            </span>
            <span className="text-caption font-medium text-ink">Live</span>
          </div>

          <div className="hidden font-mono text-caption tabular-nums text-mute lg:block">
            {liveClock}
          </div>

          <div
            className={cn(
              "flex items-center gap-1.5 text-caption font-medium",
              socketStatus === "connected"
                ? "text-[var(--status-healthy)]"
                : "text-[var(--status-warning)]",
            )}
          >
            <Wifi className="size-3.5" />
            <span className="hidden sm:inline">
              {socketStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
