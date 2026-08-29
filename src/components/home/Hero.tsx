import HeroGraphic from "./HeroGraphic";

export default function Hero() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-[var(--color-brand-light)] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--color-brand-dark)]">
            REPORT. RESPOND. RESOLVE.
          </span>

          <h1 className="mt-6 text-[36px] leading-[1.08] font-bold tracking-tight text-[var(--color-text-primary)] md:text-[56px]">
            Smart Emergency
            <br />
            <span className="text-[var(--color-brand)]">Response.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-[var(--color-text-secondary)] md:text-lg">
            Report emergencies instantly, get automatically matched with the
            nearest available volunteer or emergency service — transparently and
            fast.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#"
              className="rounded-md bg-[var(--color-brand)] px-6 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
            >
              Report an Emergency
            </a>
            <a
              href="#"
              className="rounded-md border border-[var(--color-text-primary)] px-6 py-3 text-center text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
            >
              Join as Volunteer
            </a>
          </div>
        </div>

        <HeroGraphic />
      </div>
    </section>
  );
}
