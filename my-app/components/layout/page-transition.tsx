"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { usesDeviceDetailHeader } from "@/lib/constants/page-hero";
import { cn } from "@/lib/utils";

type PageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const skipAnimation = usesDeviceDetailHeader(pathname);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || skipAnimation) return;

    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" },
    );

    return () => {
      tween.kill();
      gsap.set(element, { opacity: 1, y: 0, clearProps: "opacity,transform" });
    };
  }, [pathname, prefersReducedMotion, skipAnimation]);

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {children}
    </div>
  );
}
