import { useState } from "react";
import {
  ShieldIcon,
  FireIcon,
  GeoIcon,
  NavigationIcon,
  CheckIcon,
} from "@/components/icons";

type AssignmentState = "incoming" | "active" | "none";

const historyItems = [
  { type: "Road Accident", location: "Mirpur Rd", status: "Resolved" },
  { type: "Flood", location: "Jatrabari", status: "Resolved" },
  { type: "Medical", location: "Dhanmondi 27", status: "Resolved" },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-xs font-bold text-[var(--color-brand-dark)]">
      {initials}
    </span>
  );
}

function TopBar({
  available,
  onToggle,
}: {
  available: boolean;
  onToggle: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-[var(--navbar-h)] max-w-[900px] items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-[var(--color-text-primary)]">
          <span className="text-[var(--color-brand)]">
            <ShieldIcon size={26} />
          </span>
          <span className="text-base font-bold tracking-tight">ResQBD</span>
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm font-medium text-[var(--color-text-secondary)] sm:inline">
            Rahim Uddin
          </span>
          <Avatar name="Rahim Uddin" />
        </div>
      </div>
      <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 pb-4 pt-1">
        <h1 className="text-lg font-bold tracking-tight">Volunteer dashboard</h1>
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={available}
          className={`flex items-center gap-2 rounded-full border px-1 py-1 pl-3 text-xs font-bold transition-colors duration-150 ${
            available
              ? "border-[var(--color-success)] text-[var(--color-success)]"
              : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
          }`}
        >
          {available ? "Available" : "Offline"}
          <span
            className={`flex h-[18px] w-8 items-center rounded-full transition-colors duration-150 ${
              available ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
            }`}
          >
            <span
              className={`h-3.5 w-3.5 rounded-full bg-[var(--color-bg)] shadow transition-transform duration-150 ${
                available ? "translate-x-[17px]" : "translate-x-[2px]"
              }`}
            />
          </span>
        </button>
      </div>
    </header>
  );
}

function MapPreview() {
  return (
    <div className="relative mt-4 h-[130px] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 300 130">
        <path d="M0 40 L300 60" stroke="var(--color-border)" strokeWidth="2" fill="none" />
        <path d="M40 0 L80 130" stroke="var(--color-border)" strokeWidth="2" fill="none" />
        <path d="M0 100 L300 85" stroke="var(--color-border)" strokeWidth="1.5" fill="none" />
      </svg>
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-[var(--color-priority-high)]">
        <GeoIcon size={26} />
      </span>
    </div>
  );
}

function IncomingAssignment({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div className="rounded-xl border-[1.5px] border-[var(--color-priority-high)] bg-[var(--color-bg)] p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-brand-dark)]">
          New Assignment
        </span>
        <span className="text-xs font-bold text-[var(--color-text-secondary)]">
          0.8 km away
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[var(--color-brand)]">
          <FireIcon size={20} />
        </span>
        <h2 className="text-base font-bold">Fire — Sheikh Rd area</h2>
      </div>
      <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
        Reported 2 min ago &middot; Priority: High
      </p>

      <MapPreview />

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="h-11 flex-1 rounded-lg bg-[var(--color-brand)] text-sm font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)]"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="h-11 flex-1 rounded-lg border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-secondary)] transition-colors duration-150 hover:bg-[var(--color-surface)]"
        >
          Decline
        </button>
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 text-sm font-bold text-[var(--color-info)] transition-colors duration-150 hover:bg-[var(--color-surface)]"
        >
          <NavigationIcon size={15} />
        </button>
      </div>
    </div>
  );
}

function ActiveAssignment({ onResolve }: { onResolve: () => void }) {
  const statuses = ["En route", "On scene", "Resolved"] as const;
  const [status, setStatus] = useState<(typeof statuses)[number]>("En route");

  return (
    <div className="rounded-xl border-[1.5px] border-[var(--color-brand)] bg-[var(--color-bg)] p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[var(--color-success)]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-success)]">
          Active Assignment
        </span>
        <span className="text-xs font-bold text-[var(--color-text-secondary)]">
          0.8 km away
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[var(--color-brand)]">
          <FireIcon size={20} />
        </span>
        <h2 className="text-base font-bold">Fire — Sheikh Rd area</h2>
      </div>

      <MapPreview />

      <p className="mt-4 text-xs font-bold text-[var(--color-text-secondary)]">
        Update status
      </p>
      <div className="mt-2 flex gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStatus(s);
              if (s === "Resolved") onResolve();
            }}
            className={`h-10 flex-1 rounded-lg border text-xs font-bold transition-colors duration-150 ${
              status === s
                ? "border-[var(--color-brand)] bg-[var(--color-brand)] text-[var(--color-bg)]"
                : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-brand)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]">
        <CheckIcon size={22} />
      </span>
      <p className="mt-3 text-sm font-bold">No active assignments right now</p>
      <p className="mt-1 max-w-[280px] text-xs text-[var(--color-text-secondary)]">
        You&apos;ll be notified here when one comes in nearby.
      </p>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-center">
      <p className="text-lg font-extrabold">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-text-secondary)]">
        {label}
      </p>
    </div>
  );
}

export default function VolunteerDashboard() {
  const [available, setAvailable] = useState(true);
  const [assignment, setAssignment] = useState<AssignmentState>("incoming");

  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      <TopBar available={available} onToggle={() => setAvailable((v) => !v)} />

      <main className="mx-auto max-w-[900px] px-6 py-6">
        <div className="mb-6">
          {assignment === "incoming" ? (
            <IncomingAssignment
              onAccept={() => setAssignment("active")}
              onDecline={() => setAssignment("none")}
            />
          ) : assignment === "active" ? (
            <ActiveAssignment onResolve={() => setAssignment("none")} />
          ) : (
            <EmptyState />
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatCard value="14" label="Accepted" />
          <StatCard value="12" label="Resolved" />
          <StatCard value="4.6" label="Reliability" />
        </div>

        <p className="mb-3 mt-8 text-sm font-bold text-[var(--color-text-secondary)]">
          Recent responses
        </p>
        <div className="flex flex-col gap-2">
          {historyItems.map((item) => (
            <div
              key={item.location}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3"
            >
              <span className="text-sm font-medium">
                {item.type} — {item.location}
              </span>
              <span className="rounded-full bg-[var(--color-success)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--color-success)]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}