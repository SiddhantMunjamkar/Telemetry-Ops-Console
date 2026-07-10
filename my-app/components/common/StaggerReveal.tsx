"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type StaggerRevealProps = {
  children: React.ReactNode;
  className?: string;
  childSelector?: string;
  stagger?: number;
  delay?: number;
  y?: number;
};

export function StaggerReveal({
  children,
  className,
  childSelector = "[data-stagger]",
  stagger = 0.06,
  delay = 0,
  y = 12,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll(childSelector);
    if (items.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: "opacity,transform" });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger,
        delay,
        ease: "power2.out",
        overwrite: "auto",
      },
    );

    return () => {
      tween.kill();
      gsap.set(items, { opacity: 1, y: 0, clearProps: "opacity,transform" });
    };
  }, [childSelector, stagger, delay, y, prefersReducedMotion]);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {children}
    </div>
  );
}
