"use client";

import { useUiStore } from "@/stores/ui-store";

export function useSidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const mobileNavOpen = useUiStore((state) => state.mobileNavOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const toggleMobileNav = useUiStore((state) => state.toggleMobileNav);

  return {
    sidebarOpen,
    mobileNavOpen,
    setSidebarOpen,
    setMobileNavOpen,
    toggleSidebar,
    toggleMobileNav,
  };
}
