import { SectionTitle } from "@/components/common/SectionTitle";
import { cn } from "@/lib/utils";

type PageSectionProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function PageSection({
  title,
  description,
  eyebrow,
  action,
  children,
  className,
  contentClassName,
}: PageSectionProps) {
  return (
    <section className={cn("w-full space-y-4", className)}>
      <SectionTitle
        eyebrow={eyebrow}
        title={title}
        description={description}
        action={action}
      />
      <div className={cn("w-full", contentClassName)}>{children}</div>
    </section>
  );
}
