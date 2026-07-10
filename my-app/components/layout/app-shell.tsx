"use client";

import { usePathname } from "next/navigation";
import { getNavItemByHref } from "@/lib/constants/navigation";
import { LAYOUT } from "@/lib/constants/layout";
import { useSidebar } from "@/hooks/use-sidebar";
import { useIsMobile } from "@/hooks/use-media-query";
import { SkipLink } from "@/components/common/SkipLink";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const {
    sidebarOpen,
    mobileNavOpen,
    toggleSidebar,
    setMobileNavOpen,
  } = useSidebar();

  const showDesktopSidebar = !isMobile;
  const sidebarCollapsed = showDesktopSidebar && !sidebarOpen;

  return (
    <div className="flex min-h-screen bg-background">
      <SkipLink />

      {showDesktopSidebar ? (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          className="hidden md:flex"
        />
      ) : null}

      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      <div
        className="flex min-h-screen min-w-0 flex-1 flex-col"
        style={{
          marginLeft: showDesktopSidebar
            ? sidebarCollapsed
              ? 72
              : LAYOUT.sidebarWidth
            : 0,
        }}
      >
        <Header
          showMenuButton={isMobile}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden"
          tabIndex={-1}
        >
          <div
            className="mx-auto w-full"
            style={{
              maxWidth: LAYOUT.contentMaxWidth,
              paddingLeft: LAYOUT.contentPaddingX,
              paddingRight: LAYOUT.contentPaddingX,
              paddingTop: LAYOUT.contentPaddingTop,
              paddingBottom: LAYOUT.contentPaddingBottom,
            }}
          >
            <PageTransition key={pathname}>{children}</PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
