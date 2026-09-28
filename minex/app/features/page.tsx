import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import FeatureCard from "@/components/features/FeatureCard";
export const metadata = {
  title: "Features — MineX",
};

const features = [
  { icon: "👁️", title: "Edge AI Detection", desc: "YOLOv8 (TensorRT Quantized) with Thermal AI locates trapped workers in zero-visibility.", tag: "Primary Safety", theme: "red" },
  { icon: "📡", title: "Advanced SLAM", desc: "2D LiDAR & 9-DOF IMU enable GPS-free 3D mapping and autonomous navigation.", tag: "Navigation", theme: "blue" },
  { icon: "💨", title: "Multi-Level Gas Mapping", desc: "MEMS CH4, CO, H2S, and O2 sensors continuously monitor and map hazardous gases.", tag: "Safety", theme: "green" },
  { icon: "📶", title: "Wi-Fi HaLow Mesh", desc: "Heltec 802.11ah enables long-range, self-healing subsurface mesh communication.", tag: "Communication", theme: "purple" },
  { icon: "🔄", title: "Auto Retrace", desc: "Rover automatically returns to the last connected mesh node if communication is lost.", tag: "Resilience", theme: "orange" },
  { icon: "🚁", title: "Dual Platform Mobility", desc: "Rugged all-terrain tracked rover paired with a deployable micro drone.", tag: "Mobility", theme: "red" },
  { icon: "🔋", title: "Smart Docking", desc: "Automated docking stations for auto-charging, data transfer, and continuous monitoring.", tag: "Infrastructure", theme: "green" },
  { icon: "🛡️", title: "DGMS-Compliant", desc: "Safety-focused sealed electronics with BLDC motors designed for explosion risk areas.", tag: "Reliability", theme: "blue" },
  { icon: "💻", title: "Onboard Compute", desc: "NVIDIA Jetson / Raspberry Pi 4 handles vision, SLAM, and decision engines locally.", tag: "Processing", theme: "purple" },
  { icon: "🎙️", title: "Two-Way Audio", desc: "WebRTC streaming provides live two-way voice communication for rescue coordination.", tag: "Rescue Aid", theme: "orange" },
  { icon: "🗺️", title: "Surface Dashboard", desc: "React-based UI for real-time 3D maps, telemetry, and automated hazard alerts.", tag: "Operations", theme: "blue" },
  { icon: "🎥", title: "Thermal & Night Vision", desc: "FLIR Lepton 3.5 & Arducam NOIR provide clear visuals through dust and smoke.", tag: "Vision", theme: "red" },
];

export default function FeaturesPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-white">
        {/* HERO SECTION */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white text-orange-600 text-sm font-semibold rounded-full mb-4 border border-orange-100 shadow-sm">
              Capabilities
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need in one smart rover.
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Designed for real underground scenarios where reliability, safety, and data integrity matter most. Explore our comprehensive feature set.
            </p>
          </div>
        </section>



        {/* FEATURES GRID SECTION */}
        <section className="py-24 px-6 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Capabilities</h2>
              <p className="text-gray-500">Every feature is designed to ensure maximum safety and reliability.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pl-4">
              {features.map((feature) => (
                <FeatureCard 
                  key={feature.title}
                  theme={feature.theme as any}
                  title={feature.title}
                  desc={feature.desc}
                  tag={feature.tag}
                  icon={feature.icon}
                />
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
