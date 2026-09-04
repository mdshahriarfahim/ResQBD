import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckIcon, FireIcon } from "@/components/icons";

const title = "Track Report — ResQBD";
const description =
  "Track the live status of your emergency report using your tracking code.";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>) => ({
    code: typeof search["code"] === "string" ? (search["code"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackPage,
});

type StepState = "done" | "current" | "pending";

const steps: { label: string; note: string }[] = [
  { label: "Reported", note: "0:00" },
  { label: "Acknowledged", note: "Priority scored" },
  { label: "Volunteer assigned", note: "Rahim U., 0.8 km away" },
  { label: "In progress", note: "En route" },
  { label: "Resolved", note: "Pending" },
];

// demo: how many steps are complete for any tracking code, for preview purposes
const DEMO_COMPLETED_STEPS = 3;

function TrackPage() {
  const search = useSearch({ from: "/track" });
  const [inputCode, setInputCode] = useState(search.code ?? "");
  const [activeCode, setActiveCode] = useState(search.code ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setActiveCode(inputCode.trim().toUpperCase());
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="px-6 py-[var(--section-y)]">
        <div className="mx-auto max-w-[560px]">
          <span className="inline-block rounded-full bg-[var(--color-brand-light)] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--color-brand-dark)]">
            TRACK REPORT
          </span>
          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-4xl">
            Track your report
          </h1>
          <p className="mt-3 text-base text-[var(--color-text-secondary)]">
            Enter the tracking code you received when you submitted your
            report.
          </p>

          <form onSubmit={onSubmit} className="mt-6 flex gap-3">
            <input
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. RQ-2041"
              className="h-12 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-lg bg-[var(--color-brand)] px-6 text-sm font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)]"
            >
              Track
            </button>
          </form>

          {activeCode ? (
            <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 text-xs font-bold text-[var(--color-brand-dark)]">
                  {activeCode}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-brand-dark)]">
                  <FireIcon size={16} />
                  Fire &middot; Priority: High
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold">Sheikh Rd area</h2>

              <div className="mt-6 flex flex-col">
                {steps.map((s, i) => {
                  const state: StepState =
                    i < DEMO_COMPLETED_STEPS
                      ? "done"
                      : i === DEMO_COMPLETED_STEPS
                        ? "current"
                        : "pending";
                  const isLast = i === steps.length - 1;
                  return (
                    <div key={s.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                            state === "done"
                              ? "bg-[var(--color-success)] text-[var(--color-bg)]"
                              : state === "current"
                                ? "border-2 border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]"
                                : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {state === "done" ? <CheckIcon size={13} /> : i + 1}
                        </span>
                        {!isLast ? (
                          <span
                            className={`w-[1.5px] flex-1 ${
                              state === "done"
                                ? "bg-[var(--color-success)]"
                                : "bg-[var(--color-border)]"
                            }`}
                            style={{ minHeight: "28px" }}
                          />
                        ) : null}
                      </div>
                      <div className="pb-6">
                        <p
                          className={`text-sm font-bold ${
                            state === "pending"
                              ? "text-[var(--color-text-secondary)]"
                              : "text-[var(--color-text-primary)]"
                          }`}
                        >
                          {s.label}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          {s.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}