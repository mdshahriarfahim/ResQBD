import FeatureCards from "./FeatureCards";
import { ReportIcon, ScoreIcon, MatchIcon } from "@/components/icons";

export default function HowItWorks() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
          How It Works
        </h2>
        <div className="mt-10">
          <FeatureCards
            items={[
              {
                icon: <ReportIcon size={26} />,
                title: "Report",
                description:
                  "Citizen submits incident with location and details.",
              },
              {
                icon: <ScoreIcon size={26} />,
                title: "Score",
                description:
                  "System calculates priority instantly and transparently.",
              },
              {
                icon: <MatchIcon size={26} />,
                title: "Match",
                description:
                  "Nearest available volunteer or emergency service is notified automatically.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
