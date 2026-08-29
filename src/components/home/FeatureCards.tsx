import type { ReactNode } from "react";

export type FeatureCard = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function FeatureCards({ items }: { items: FeatureCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-[var(--card-gap)] md:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
            {item.icon}
          </span>
          <h3 className="mt-6 text-xl font-bold text-[var(--color-text-primary)]">
            {item.title}
          </h3>
          <p className="mt-3 text-base text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        </article>
      ))}
    </div>
  );
}
