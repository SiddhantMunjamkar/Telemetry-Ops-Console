"use client";

import { usePathname } from "next/navigation";
import { Activity, Menu, Moon, Sun, Wifi } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { getPageHeroConfig } from "@/lib/constants/page-hero";
import { useIsMobile } from "@/hooks/use-media-query";
import { useLiveClock } from "@/hooks/use-live-clock";
import { useSidebar } from "@/hooks/use-sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type PageHeroProps = {
  className?: string;
};

export function PageHero({ className }: PageHeroProps) {
  const pathname = usePathname();
  const { section, title, description } = getPageHeroConfig(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const liveClock = useLiveClock();
  const isDark = mounted && resolvedTheme === "dark";
  const isMobile = useIsMobile();
  const { setMobileNavOpen } = useSidebar();

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          {isMobile ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-2 -ml-2 md:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="size-4" />
            </Button>
          ) : null}
          <p className="text-body-sm text-mute">{section}</p>
          <h1 className="mt-0.5 text-[28px] font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-1.5 text-body-sm leading-snug text-body">{description}</p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 lg:w-auto lg:items-end">
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-hairline bg-canvas-soft px-3 text-body-sm"
              onClick={() => setTheme(isDark ? "light" : "dark")}
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {isDark ? "Dark mode" : "Light mode"}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-hairline bg-canvas-soft px-3 text-body-sm"
            >
              <span className="relative flex size-2" aria-hidden>
                <span className="absolute inline-flex size-full motion-safe:animate-ping rounded-full bg-[#3b82f6] opacity-40" />
                <span className="relative inline-flex size-2 rounded-full bg-[#3b82f6]" />
              </span>
              Live
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-caption text-mute lg:justify-end">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="size-3.5" aria-hidden />
              Last updated {liveClock}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(34,197,94,0.12)] px-2.5 py-1 text-caption font-medium text-[#22c55e]">
              <Wifi className="size-3" aria-hidden />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
