import type { ReactNode } from "react";
import { ShieldIcon } from "@/components/icons";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6 py-[var(--section-y)]">
      <div className="w-full max-w-[520px]">{children}</div>
    </div>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)] shadow-sm md:p-[var(--card-pad)]">
      {children}
    </div>
  );
}

export function AuthBrand() {
  return (
    <a
      href="/"
      className="mx-auto flex w-fit items-center gap-2 text-[var(--color-text-primary)] transition-colors duration-150 hover:text-[var(--color-brand)]"
    >
      <span className="text-[var(--color-brand)]">
        <ShieldIcon size={28} />
      </span>
      <span className="text-lg font-bold tracking-tight">ResQBD</span>
    </a>
  );
}

export function FieldError({ message }: { message?: string | undefined }) {
  if (!message) return null;
  return (
    <p className="mt-2 text-sm font-medium text-[var(--color-danger)]">{message}</p>
  );
}

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  error?: string | undefined;
  autoComplete?: string;
  onChange: (value: string) => void;
};

export function Field({
  id,
  label,
  type = "text",
  value,
  error,
  autoComplete,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-[var(--color-text-primary)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={`mt-2 h-12 w-full rounded-lg border bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)] ${
          error
            ? "border-[var(--color-danger)]"
            : "border-[var(--color-border)] hover:border-[var(--color-text-secondary)]"
        }`}
      />
      <FieldError message={error} />
    </div>
  );
}
