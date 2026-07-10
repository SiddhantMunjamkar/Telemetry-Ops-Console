"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type UseAnimatedCounterOptions = {
  duration?: number;
  decimals?: number;
  ease?: string;
};

export function useAnimatedCounter(
  value: number,
  {
    duration = 0.6,
    decimals = 0,
    ease = "power2.out",
  }: UseAnimatedCounterOptions = {},
): string {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef({ current: value });

  useEffect(() => {
    const tween = gsap.to(valueRef.current, {
      current: value,
      duration,
      ease,
      onUpdate: () => {
        setDisplayValue(valueRef.current.current);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, ease]);

  return displayValue.toFixed(decimals);
}
