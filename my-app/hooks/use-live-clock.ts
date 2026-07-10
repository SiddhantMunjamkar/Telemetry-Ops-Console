"use client";

import { useEffect, useState } from "react";
import { formatLiveClock } from "@/lib/format";

export function useLiveClock(): string {
  const [time, setTime] = useState(() => formatLiveClock(new Date()));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(formatLiveClock(new Date()));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return time;
}
