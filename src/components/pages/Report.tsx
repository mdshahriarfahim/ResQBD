import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ReportForm from "@/components/report/ReportForm";

export default function Report() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="px-6 py-[var(--section-y)]">
        <ReportForm />
      </main>
      <Footer />
    </div>
  );
}