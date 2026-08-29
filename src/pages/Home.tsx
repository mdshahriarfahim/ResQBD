import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import StatsStrip from "@/components/home/StatsStrip";
import WhyResQBD from "@/components/home/WhyResQBD";
import DualCTA from "@/components/home/DualCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <StatsStrip />
        <WhyResQBD />
        <DualCTA />
      </main>
      <Footer />
    </div>
  );
}
