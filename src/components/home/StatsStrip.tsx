const stats = [
  { value: "0", label: "Incidents Resolved" },
  { value: "0", label: "Active Volunteers" },
  { value: "0", label: "Avg. Response Time" },
];

export default function StatsStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--section-y)]">
      <div className="mx-auto grid max-w-[var(--content-max)] grid-cols-1 gap-[var(--card-gap)] px-6 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {s.value}
            </div>
            <div className="mt-3 text-xs font-bold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
