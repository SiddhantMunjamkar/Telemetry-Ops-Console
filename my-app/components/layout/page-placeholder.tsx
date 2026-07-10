type PagePlaceholderProps = {
  title: string;
  description: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-8 shadow-elevation-2">
      <p className="font-mono text-caption uppercase tracking-wide text-mute">
        Phase 1 complete
      </p>
      <h2 className="mt-2 text-display-md font-semibold tracking-display-md text-ink">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-body-md text-body">{description}</p>
    </section>
  );
}
