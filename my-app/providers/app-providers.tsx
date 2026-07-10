"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { SocketProvider } from "@/providers/socket-provider";
import { ThemeProvider } from "@/providers/theme-provider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <SocketProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast:
                    "bg-card text-card-foreground border border-border shadow-elevation-4 rounded-md",
                  title: "text-body-sm font-medium",
                  description: "text-body-sm text-muted-foreground",
                },
              }}
            />
          </TooltipProvider>
        </SocketProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
