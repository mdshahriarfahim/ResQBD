import { SpinnerIcon } from "@/components/icons";

type Props = {
  label: string;
  loading: boolean;
  variant?: "solid" | "outline";
};

export function SubmitButton({ label, loading, variant = "solid" }: Props) {
  const base =
    "flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-bold transition-colors duration-150 disabled:cursor-not-allowed";
  const styles =
    variant === "solid"
      ? "bg-[var(--color-brand)] text-[var(--color-bg)] hover:bg-[var(--color-brand-dark)] disabled:bg-[var(--color-brand-light)] disabled:text-[var(--color-brand-dark)]"
      : "border border-[var(--color-text-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] disabled:border-[var(--color-border)] disabled:text-[var(--color-text-secondary)]";

  return (
    <button type="submit" disabled={loading} className={`${base} ${styles}`}>
      {loading ? <SpinnerIcon size={20} /> : null}
      {loading ? "Please wait..." : label}
    </button>
  );
}
