import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MailIcon, CheckIcon } from "@/components/icons";

const title = "Contact — ResQBD";
const description =
  "Get in touch with the ResQBD team for general inquiries or emergency-service partnership requests.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>
        <section className="pt-[var(--section-y)] pb-[calc(var(--section-y)*0.6)]">
          <div className="mx-auto max-w-[var(--content-max)] px-6 text-center">
            <span className="inline-block rounded-full bg-[var(--color-brand-light)] px-4 py-2 text-xs font-bold tracking-[0.12em] text-[var(--color-brand-dark)]">
              CONTACT
            </span>
            <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[var(--color-text-secondary)] md:text-lg">
              Questions, feedback, or partnership inquiries — we&apos;d love to
              hear from you.
            </p>
          </div>
        </section>

        <section className="pb-[var(--section-y)]">
          <div className="mx-auto grid max-w-[var(--content-max)] gap-[var(--card-gap)] px-6 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-[var(--card-pad)]">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand)]">
                    <CheckIcon size={26} />
                  </span>
                  <p className="mt-4 text-lg font-bold">Message sent</p>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    We&apos;ll get back to you as soon as we can.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-primary)]">
                      Your name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-primary)]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2 h-12 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-text-primary)]">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-base text-[var(--color-text-primary)] outline-none transition-colors duration-150 focus:border-[var(--color-brand)] focus:ring-2 focus:ring-[var(--color-brand)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-12 w-full rounded-lg bg-[var(--color-brand)] text-base font-bold text-[var(--color-bg)] transition-colors duration-150 hover:bg-[var(--color-brand-dark)]"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--card-pad)]">
              <p className="text-sm font-bold uppercase tracking-wide text-[var(--color-danger)]">
                Not an emergency line
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                For life-threatening emergencies, call 999 directly. This
                contact form is for general inquiries only.
              </p>

              <div className="mt-6 flex items-start gap-3">
                <span className="mt-0.5 text-[var(--color-brand)]">
                  <MailIcon size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold">General inquiries</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    hello@resqbd.org
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <span className="mt-0.5 text-[var(--color-brand)]">
                  <MailIcon size={20} />
                </span>
                <div>
                  <p className="text-sm font-bold">Partnerships</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    For Fire/Police/Ambulance collaboration inquiries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}