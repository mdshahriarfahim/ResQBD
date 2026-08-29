import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureCards from "@/components/home/FeatureCards";
import StoryGraphic from "@/components/about/StoryGraphic";
import {
  FormulaIcon,
  AutomationIcon,
  DeployIcon,
} from "@/components/icons";

const title = "About Us — ResQBD";
const description =
  "Learn why ResQBD was built to close the emergency coordination gap in Bangladesh — transparent scoring, automatic matching, and community-first deployment.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const approachItems = [
  {
    icon: <FormulaIcon size={26} />,
    title: "Transparent, Not Black-Box",
    description:
      "Every priority score uses a documented formula, never a hidden AI model.",
  },
  {
    icon: <AutomationIcon size={26} />,
    title: "Automatic Coordination",
    description:
      "Reports are scored and matched to the nearest available volunteer or emergency service without manual dispatching.",
  },
  {
    icon: <DeployIcon size={26} />,
    title: "Built for Local Deployment",
    description:
      "Lightweight enough to run at a community or campus level.",
  },
];

const teamMembers = [
  {
    initials: "MF",
    name: "M. Fahim",
    role: "Developer & Researcher",
    bio: "Designed and built the ResQBD platform with a focus on transparent scoring and local deployment.",
  },
  {
    initials: "SA",
    name: "Supervisor / Advisor",
    role: "Project Supervisor (TBD)",
    bio: "Academic guidance and mentorship placeholder — to be confirmed.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>
        <PageHeader />
        <OurStory />
        <Mission />
        <Approach />
        <PilotStatus />
        <Team />
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
          ABOUT US
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          About ResQBD
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] md:text-lg">
          ResQBD is a community-driven emergency response platform built to close
          the coordination gap during floods, fires, road accidents, and cyclones
          in Bangladesh.
        </p>
      </div>
    </section>
  );
}

function OurStory() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto grid max-w-[var(--content-max)] items-center gap-12 px-6 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-base text-[var(--color-text-secondary)]">
            <p>
              Bangladesh faces recurring emergencies — floods, fires, road
              accidents, cyclones — yet coordination often depends on informal
              phone calls, social media posts, and word of mouth. Precious minutes
              are lost while the right help is tracked down manually.
            </p>
            <p>
              Existing warning systems are good at broadcasting alerts, but they
              stop short of automatic coordination. Most tools do not score
              incoming reports by urgency, match them to the nearest responder,
              or track resolution in real time.
            </p>
            <p>
              ResQBD was started to close that gap: a lightweight platform that
              turns a citizen report into a prioritized, matched, and trackable
              response — starting at the community and campus level.
            </p>
          </div>
        </div>
        <div>
          <StoryGraphic />
        </div>
      </div>
    </section>
  );
}


function Mission() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
        <blockquote className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          “Ensure every emergency report reaches the right helper — fast, and
          transparently.”
        </blockquote>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-text-secondary)]">
          We believe coordination should be open, accountable, and fast enough to
          matter when it counts.
        </p>
      </div>
    </section>
  );
}

function Approach() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          Our Approach
        </h2>
        <div className="mt-10">
          <FeatureCards items={approachItems} />
        </div>
      </div>
    </section>
  );
}

function PilotStatus() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-pad)] md:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
            Where We Stand Today
          </h2>
          <p className="mt-4 max-w-3xl text-base text-[var(--color-text-secondary)]">
            ResQBD is currently a pilot and academic project designed for
            community-level deployment. It is not a replacement for national
            emergency services such as 999.
          </p>
          <ul className="mt-6 space-y-2 text-base text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
              It does not yet integrate with nationwide official emergency control
              rooms.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
              It cannot guarantee fixed response times.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
              It does not yet send large-scale SMS or app-based alert broadcasts.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          The Team
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-[var(--card-gap)] sm:grid-cols-2">
          {teamMembers.map((member) => (
            <article
              key={member.initials}
              className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-xl font-bold text-[var(--color-brand-dark)]">
                {member.initials}
              </div>
              <h3 className="mt-5 text-lg font-bold text-[var(--color-text-primary)]">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-[var(--color-brand)]">
                {member.role}
              </p>
              <p className="mt-3 max-w-xs text-sm text-[var(--color-text-secondary)]">
                {member.bio}
              </p>
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
          Want to know more about how it works?
        </p>
        <a
          href="/how-it-works"
          className="mt-5 inline-block rounded-md bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
        >
          See How It Works
        </a>
      </div>
    </section>
  );
}
