import FeatureCards from "./FeatureCards";
import {
  TransparencyIcon,
  GeoIcon,
  CommunityIcon,
} from "@/components/icons";

export default function WhyResQBD() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="mx-auto max-w-[var(--content-max)] px-6">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
          Why ResQBD
        </h2>
        <div className="mt-10">
          <FeatureCards
            items={[
              {
                icon: <TransparencyIcon size={26} />,
                title: "Transparent Scoring",
                description: "Open algorithm, not black-box AI.",
              },
              {
                icon: <GeoIcon size={26} />,
                title: "Automatic Matching",
                description:
                  "Intelligent geo-fencing connects helpers instantly.",
              },
              {
                icon: <CommunityIcon size={26} />,
                title: "Community-Deployable",
                description:
                  "Lightweight infrastructure built for Bangladesh's needs.",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
