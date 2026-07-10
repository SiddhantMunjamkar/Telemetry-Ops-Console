import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DeviceModalPanelProps = {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  flush?: boolean;
};

export function DeviceModalPanel({
  title,
  action,
  children,
  className,
  bodyClassName,
  noPadding = false,
  flush = false,
}: DeviceModalPanelProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[10px] border border-hairline bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {title ? (
        <header
          className={cn(
            "flex items-center justify-between gap-2 px-3.5 py-2.5",
            flush && "border-b border-hairline",
          )}
        >
          <h3 className="text-[13px] font-semibold tracking-tight text-ink">
            {title}
          </h3>
          {action}
        </header>
      ) : null}
      <div
        className={cn(
          !noPadding && !flush && "px-3.5 pb-3.5",
          title && !flush && "pt-0",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
