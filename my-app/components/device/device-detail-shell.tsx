import { DEVICE_DETAIL_MAX_WIDTH } from "@/lib/constants/device-detail";
import { cn } from "@/lib/utils";

type DeviceDetailShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function DeviceDetailShell({ children, className }: DeviceDetailShellProps) {
  return (
    <div
      className={cn("mx-auto w-full pb-12", className)}
      style={{ maxWidth: DEVICE_DETAIL_MAX_WIDTH }}
    >
      {children}
    </div>
  );
}
