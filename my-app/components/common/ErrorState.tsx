import type { LucideIcon } from "lucide-react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
};

export function ErrorState({
  icon: Icon = AlertCircle,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-error/20 bg-error-soft/30 px-6 py-12 text-center shadow-elevation-1 sm:px-12 sm:py-16",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-md border border-error/20 bg-canvas shadow-elevation-1">
        <Icon className="size-5 text-error" aria-hidden />
      </div>
      <h3 className="mt-4 text-display-sm font-semibold tracking-display-sm text-ink">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-body-md text-body">{description}</p>
      {actionLabel && actionHref ? (
        <Button className="mt-6" variant="outline" asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
