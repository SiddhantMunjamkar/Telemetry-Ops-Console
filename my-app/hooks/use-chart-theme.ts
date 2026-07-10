"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return {
    mounted,
    isDark,
    grid: isDark ? "#262626" : "#ebebeb",
    axis: isDark ? "#888888" : "#4d4d4d",
    cursor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    tooltipBg: isDark ? "#141414" : "#ffffff",
    tooltipBorder: isDark ? "#262626" : "#ebebeb",
    tooltipText: isDark ? "#ededed" : "#171717",
    tooltipMuted: isDark ? "#888888" : "#4d4d4d",
  };
}
