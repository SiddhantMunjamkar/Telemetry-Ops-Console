import { cn } from "@/lib/utils";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        {eyebrow ? (
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-mute">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-display-sm font-semibold tracking-display-sm text-ink">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-body-md leading-relaxed text-body">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
