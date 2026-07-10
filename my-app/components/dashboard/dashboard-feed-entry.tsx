import { cn } from "@/lib/utils";

type DashboardFeedEntryProps = {
  dotColor: string;
  title: string;
  time: string;
  description: string;
  footer?: {
    label: string;
    color?: string;
    muted?: boolean;
  };
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  className?: string;
};

export function DashboardFeedEntry({
  dotColor,
  title,
  time,
  description,
  footer,
  onClick,
  onKeyDown,
  className,
}: DashboardFeedEntryProps) {
  const Wrapper = onClick ? "button" : "article";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        "flex h-full min-h-[92px] flex-col text-left",
        onClick && "cursor-pointer rounded-lg transition-colors hover:bg-white/[0.02] focus-ring",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: dotColor }}
            aria-hidden
          />
          <p className="truncate text-[14px] font-semibold leading-none text-ink">
            {title}
          </p>
        </div>
        <span className="shrink-0 text-[12px] tabular-nums text-mute">{time}</span>
      </div>

      <p className="mt-2.5 line-clamp-2 min-h-[40px] text-[13px] leading-5 text-body">
        {description}
      </p>

      <p
        className={cn(
          "mt-auto min-h-[18px] pt-2 text-[12px] font-medium",
          footer?.muted && "font-normal text-mute",
          !footer && "invisible",
        )}
        style={footer?.color ? { color: footer.color } : undefined}
      >
        {footer?.label ?? "—"}
      </p>
    </Wrapper>
  );
}
