import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const title = "Dashboard — ResQBD";
const description =
  "Your ResQBD dashboard will show your reports, assignments and live incident status.";

export const Route = createFileRoute("/dashboard")({
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
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="py-[var(--section-y)]">
        <div className="mx-auto max-w-[var(--content-max)] px-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--color-text-secondary)]">
            Your reports, assignments and live incident status will appear here.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
