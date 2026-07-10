import Link from "next/link";
import { cn } from "@/lib/utils";

type DashboardFeedPanelProps = {
  title: string;
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function DashboardFeedPanel({
  title,
  href,
  children,
  className,
}: DashboardFeedPanelProps) {
  return (
    <section
      className={cn(
        "flex h-full min-h-[420px] flex-col rounded-2xl border border-hairline bg-card p-6",
        className,
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
        <Link
          href={href}
          className="shrink-0 text-[13px] font-medium text-link transition-colors hover:text-link-deep"
        >
          View all →
        </Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}
