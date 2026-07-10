"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type UseGsapEntranceOptions = {
  delay?: number;
  duration?: number;
  y?: number;
  opacity?: number;
  disabled?: boolean;
};

export function useGsapEntrance<T extends HTMLElement>({
  delay = 0,
  duration = 0.45,
  y = 16,
  opacity = 0,
  disabled = false,
}: UseGsapEntranceOptions = {}) {
  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled || prefersReducedMotion) return;

    const tween = gsap.fromTo(
      element,
      { opacity, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power2.out",
      },
    );

    return () => {
      tween.kill();
    };
  }, [delay, duration, y, opacity, disabled, prefersReducedMotion]);

  return ref;
}
