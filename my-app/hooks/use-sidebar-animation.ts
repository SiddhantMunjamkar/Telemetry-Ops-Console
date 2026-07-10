"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { LAYOUT } from "@/lib/constants/layout";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const COLLAPSED_WIDTH = 72;

export function useSidebarAnimation(collapsed: boolean) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targetWidth = collapsed ? COLLAPSED_WIDTH : LAYOUT.sidebarWidth;

    if (prefersReducedMotion) {
      element.style.width = `${targetWidth}px`;
      return;
    }

    const tween = gsap.to(element, {
      width: targetWidth,
      duration: 0.35,
      ease: "power2.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [collapsed, prefersReducedMotion]);

  return ref;
}
