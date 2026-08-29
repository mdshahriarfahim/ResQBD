import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  PersonIcon,
  BuildingIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/icons";
import { useState } from "react";

const title = "Get Involved — ResQBD";
const description =
  "Join the ResQBD response network as a volunteer or register your official emergency service to help nearby incidents faster.";

export const Route = createFileRoute("/get-involved")({
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
  component: GetInvolvedPage,
});

function GetInvolvedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>
        <PageHeader />
        <PathSelector />
        <VerificationProcess />
        <FAQ />
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
          GET INVOLVED
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl">
          Be Part of the Response Network
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] md:text-lg">
          Two ways to join: as an individual volunteer ready to help nearby, or
          as an official emergency service provider listed in the response
          directory.
        </p>
      </div>
    </section>
  );
}

const volunteerBullets = [
  "Registration and phone verification required",
  "Accept or decline assignments that match your availability",
  "Help with nearby incidents you are trained and able to handle",
];

const serviceBullets = [
  "Organization name, service type, coverage area, and contact number",
  "Admin verification required before going live",
  "Appear in nearest-responder suggestions for relevant incident types",
];

function PathSelector() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <div className="grid grid-cols-1 gap-[var(--card-gap)] md:grid-cols-2">
          <article className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
              <PersonIcon size={26} />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
              Become a Volunteer
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-secondary)]">
              For individual citizens who want to respond to nearby emergencies
              and support their community when it matters most.
            </p>
            <ul className="mt-5 space-y-2 text-base text-[var(--color-text-secondary)]">
              {volunteerBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8">
              <a
                href="/signup"
                className="inline-block rounded-md bg-[var(--color-brand)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[var(--color-brand-dark)]"
              >
                Register as a Volunteer
              </a>
            </div>
          </article>

          <article className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-dark)]">
              <BuildingIcon size={26} />
            </span>
            <h2 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">
              Register Your Emergency Service
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-secondary)]">
              For Fire, Police, Ambulance, or other official responder
              organizations that want to be listed in the response directory.
            </p>
            <ul className="mt-5 space-y-2 text-base text-[var(--color-text-secondary)]">
              {serviceBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              This directory is currently a pilot/demo feature. Full integration
              with official dispatch systems is a future goal pending
              government collaboration.
            </p>
            <div className="mt-auto pt-8">
              <a
                href="/signup"
                className="inline-block rounded-md border border-[var(--color-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-text-primary)] hover:text-white"
              >
                Register Your Service
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { label: "Submit Details", description: "Fill in your profile or organization details for review." },
  { label: "Admin Review", description: "Our team verifies your information and coverage area." },
  { label: "Approved & Active", description: "Once approved, you appear in the response network." },
];

function VerificationProcess() {
  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          Verification Process
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Both volunteer and emergency service registrations go through the same
          simple review before becoming active.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-center gap-4 md:flex-col md:gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand)] bg-[var(--color-brand-light)] text-sm font-bold text-[var(--color-brand-dark)]">
                {index + 1}
              </div>
              <div className="text-left md:text-center">
                <h3 className="text-base font-bold text-[var(--color-text-primary)]">
                  {step.label}
                </h3>
                <p className="mt-1 max-w-[220px] text-sm text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden h-px w-16 border-t-2 border-dashed border-[var(--color-brand)] md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqItems = [
  {
    question: "Is there a cost to register?",
    answer:
      "No. Registering as a volunteer or listing an emergency service is free during the pilot phase.",
  },
  {
    question: "How is my availability used?",
    answer:
      "You can mark yourself available or unavailable at any time. Only available volunteers and services are included in live matching suggestions.",
  },
  {
    question: "What happens if I can't respond to an assignment?",
    answer:
      "You can decline any assignment. The system will simply offer it to the next nearest available responder — no penalties for declining.",
  },
  {
    question: "How does an emergency service get verified?",
    answer:
      "Service registrations are reviewed against the submitted organization name, service type, coverage area, and contact number. We may follow up by phone before approval.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-[calc(var(--section-y)*0.6)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={item.question} className="px-[var(--card-pad)] py-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-base font-bold text-[var(--color-text-primary)]">
                    {item.question}
                  </span>
                  <span className="ml-4 shrink-0 text-[var(--color-text-secondary)] transition-colors duration-150 hover:text-[var(--color-brand)]">
                    {isOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
                  </span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-base text-[var(--color-text-secondary)]">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
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
          Every responder makes the network faster.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
            Join as Volunteer
          </a>
        </div>
      </div>
    </section>
  );
}