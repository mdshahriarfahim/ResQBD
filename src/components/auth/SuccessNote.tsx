import { CheckIcon } from "@/components/icons";

export function SuccessNote({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <span className="text-[var(--color-success)]">
        <CheckIcon size={20} />
      </span>
      <p className="text-sm font-bold text-[var(--color-text-primary)]">{message}</p>
    </div>
  );
}
