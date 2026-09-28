import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import WhyMineXSection from "@/components/landing/WhyMineXSection";
import TelemetryPreview from "@/components/landing/TelemetryPreview";
import HardwareSection from "@/components/landing/HardwareSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import CTASection from "@/components/landing/CTASection";
import ScrollProgress from "@/components/landing/ScrollProgress";
import ScrollToTop from "@/components/landing/ScrollToTop";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <ScrollToTop />
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <WhyMineXSection />
        <HardwareSection />
        <ArchitectureSection />
        <TelemetryPreview />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
