import { DashboardAlertsPanel } from "@/components/dashboard/dashboard-alerts-panel";
import { DashboardEventsPanel } from "@/components/dashboard/dashboard-events-panel";
import { cn } from "@/lib/utils";

type DashboardActivityGridProps = {
  className?: string;
  alertLimit?: number;
  eventLimit?: number;
};

export function DashboardActivityGrid({
  className,
  alertLimit = 4,
  eventLimit = 4,
}: DashboardActivityGridProps) {
  return (
    <section className={cn("mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-stretch", className)}>
      <div className="h-full min-h-0">
        <DashboardAlertsPanel limit={alertLimit} />
      </div>
      <div className="h-full min-h-0">
        <DashboardEventsPanel limit={eventLimit} />
      </div>
    </section>
  );
}
