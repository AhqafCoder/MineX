import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import WhyMineXSection from "@/components/landing/WhyMineXSection";
import RoverShowcase from "@/components/landing/RoverShowcase";
import TelemetryPreview from "@/components/landing/TelemetryPreview";
import HardwareSection from "@/components/landing/HardwareSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import FleetSection from "@/components/landing/FleetSection";
import CTASection from "@/components/landing/CTASection";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <WhyMineXSection />
        <RoverShowcase />
        <HardwareSection />
        <ArchitectureSection />
        <TelemetryPreview />
        <FleetSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
