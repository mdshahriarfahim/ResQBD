import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  ReportIcon,
  ScoreIcon,
  MatchIcon,
  ResolveIcon,
  CommunityIcon,
  FireIcon,
  PoliceIcon,
  AmbulanceIcon,
  DashboardIcon,
} from "@/components/icons";

const title = "How It Works — ResQBD";
const description =
  "See how every emergency report moves through ResQBD's automatic, transparent pipeline — scored, matched to volunteers and emergency services, and tracked to resolution.";

export const Route = createFileRoute("/how-it-works")({
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
  component: HowItWorksPage,
});

const pipelineSteps = [
  {
    icon: <ReportIcon size={26} />,
    title: "Report",
    description:
      "A citizen submits an incident with its type, location, description, and an optional photo.",
  },
  {
    icon: <ScoreIcon size={26} />,
    title: "Score",
    description:
      "The system instantly calculates a transparent priority score using incident type, severity, time elapsed, and area density.",
  },
  {
    icon: <MatchIcon size={26} />,
    title: "Match",
    description:
      "The nearest available volunteer and/or the relevant emergency service is identified automatically.",
  },
  {
    icon: <ResolveIcon size={26} />,
    title: "Resolve",
    description:
      "The incident status is tracked live until it is marked resolved.",
  },
];

const scoreFactors = [
  { label: "Incident Type Weight", value: 30, note: "Fire = high base weight" },
  { label: "Severity (4/5)", value: 32, note: "4 out of 5 severity" },
  { label: "Time Elapsed (3 min)", value: 15, note: "Fresh report" },
  { label: "Area Density", value: 13, note: "Densely populated area" },
];

const TOTAL_SCORE = scoreFactors.reduce((sum, f) => sum + f.value, 0);

const notifiedGroups = [
  {
    icon: <CommunityIcon size={26} />,
    title: "Citizen Volunteers",
    description: "Nearby available volunteers are alerted instantly.",
  },
  {
    icon: <FireIcon size={26} />,
    title: "Fire Service",
    description: "Fire and rescue contacts for fires and hazards.",
  },
  {
    icon: <PoliceIcon size={26} />,
    title: "Police",
    description: "Law enforcement contacts for crimes and accidents.",
  },
  {
    icon: <AmbulanceIcon size={26} />,
    title: "Ambulance",
    description: "Medical responders for injuries and health emergencies.",
  },
];

const roles = [
  {
    title: "For Citizens",
    points: [
      "Report an incident in under a minute",
      "Track status live, no account needed",
    ],
  },
  {
    title: "For Volunteers",
    points: [
      "Toggle availability on or off anytime",
      "Accept or decline matched incidents",
      "Update response status in real time",
    ],
  },
  {
    title: "For Coordinators",
    points: [
      "Live dashboard of all incidents",
      "Manage responders and assignments",
      "View response analytics",
    ],
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>
        <PageHeader />
        <Pipeline />
        <ScoreBreakdown />
        <WhoGetsNotified />
        <RoleBreakdown />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}

function PageHeader() {
  return (
    <section className="pt-[var(--section-y)] pb-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
        <span className="inline-block rounded-full bg-[var(--color-brand-light)] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--color-brand-dark)]">
          HOW IT WORKS
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          From Report to Resolution
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] md:text-lg">
          Every report goes through an automatic, transparent pipeline — no
          manual dispatching, no black-box decisions.
        </p>
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          The Full Pipeline
        </h2>
        <ol className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-[var(--card-gap)]">
          {/* connector line (desktop) */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-[var(--color-border)] md:block"
          />
          {/* connector line (mobile) */}
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-7 top-0 border-l-2 border-dashed border-[var(--color-border)] md:hidden"
          />
          {pipelineSteps.map((step, i) => (
            <li key={step.title} className="relative flex gap-5 md:flex-col md:gap-0">
              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
                {step.icon}
              </div>
              <div className="md:mt-6">
                <p className="text-xs font-bold tracking-[0.12em] text-[var(--color-brand)]">
                  STEP {i + 1}
                </p>
                <h3 className="mt-1 text-xl font-bold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-base text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ScoreBreakdown() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-pad)] md:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
            Example Priority Score Breakdown
          </h2>
          <p className="mt-3 text-base text-[var(--color-text-secondary)]">
            See exactly how a score is calculated — nothing is hidden.
          </p>
          <p className="mt-6 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">
            Incident: Fire, Severity 4/5, reported 3 minutes ago
          </p>

          <div className="mt-8 space-y-5">
            {scoreFactors.map((factor) => (
              <div key={factor.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {factor.label}
                  </p>
                  <p className="text-sm font-bold text-[var(--color-brand-dark)]">
                    +{factor.value}
                  </p>
                </div>
                <div
                  className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[var(--color-border)]"
                  role="img"
                  aria-label={`${factor.label}: ${factor.value} points — ${factor.note}`}
                >
                  <div
                    className="h-full rounded-full bg-[var(--color-brand)]"
                    style={{ width: `${(factor.value / 40) * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {factor.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
            <p className="text-base font-bold text-[var(--color-text-primary)]">
              Final Score: {TOTAL_SCORE} / 100
            </p>
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-priority-critical)] px-4 py-2 text-xs font-bold tracking-[0.08em] text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              CRITICAL PRIORITY
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhoGetsNotified() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          Who Gets Notified
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-[var(--color-text-secondary)]">
          Depending on the incident type, the system can notify both nearby
          volunteers and the relevant official emergency service.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-[var(--card-gap)] sm:grid-cols-2 lg:grid-cols-4">
          {notifiedGroups.map((group) => (
            <article
              key={group.title}
              className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
                {group.icon}
              </span>
              <h3 className="mt-6 text-lg font-bold text-[var(--color-text-primary)]">
                {group.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {group.description}
              </p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-[var(--color-text-secondary)]">
          Emergency service contacts are currently a demo directory for pilot
          testing, with the goal of full integration through future
          collaboration with official services.
        </p>
      </div>
    </section>
  );
}

function RoleBreakdown() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <div className="grid grid-cols-1 gap-[var(--card-gap)] md:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.title}
              className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
                <DashboardIcon size={26} />
              </span>
              <h3 className="mt-6 text-xl font-bold text-[var(--color-text-primary)]">
                {role.title}
              </h3>
              <ul className="mt-4 space-y-2 text-base text-[var(--color-text-secondary)]">
                {role.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingCTA() {
  return (
    <section className="pb-[var(--section-y)] pt-[calc(var(--section-y)*0.4)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
        <p className="text-lg font-medium text-[var(--color-text-primary)]">
          Ready to see it in action?
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/report"
            className="rounded-md bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
          >
            Report an Emergency
          </a>
          <a
            href="/signup"
            className="rounded-md border border-[var(--color-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
          >
            Become a Volunteer
          </a>
        </div>
      </div>
    </section>
  );
}