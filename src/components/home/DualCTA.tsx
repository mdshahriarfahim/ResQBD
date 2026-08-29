export default function DualCTA() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <div className="grid grid-cols-1 divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] md:grid-cols-2 md:divide-x md:divide-y-0">
          <div className="flex flex-col items-start p-[var(--card-pad)] md:p-12">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Need Help?
            </h3>
            <a
              href="/report"
              className="mt-6 rounded-md bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
            >
              Report an Emergency
            </a>
          </div>
          <div className="flex flex-col items-start p-[var(--card-pad)] md:p-12">
            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Want to Help?
            </h3>
            <a
              href="/signup"
              className="mt-6 rounded-md border border-[var(--color-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
            >
              Join as Volunteer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}