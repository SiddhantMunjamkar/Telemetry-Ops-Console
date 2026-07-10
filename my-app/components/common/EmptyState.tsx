import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-border bg-canvas-soft px-6 py-12 text-center shadow-elevation-1 sm:px-12 sm:py-16",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-md border border-border bg-canvas shadow-elevation-1">
        <Icon className="size-5 text-mute" aria-hidden />
      </div>
      <h3 className="mt-4 text-display-sm font-semibold tracking-display-sm text-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-body-md text-body">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
