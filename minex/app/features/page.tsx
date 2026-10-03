import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import FeatureCard from "@/components/features/FeatureCard";
export const metadata = {
  title: "Features — MineX",
};

const features = [
  { icon: "🔥", title: "Thermal Survivor Detection", desc: "FLIR Lepton 3.5 thermal camera detects human heat signatures through smoke, dust, and darkness — even when visual detection fails.", tag: "Primary Safety", theme: "red" },
  { icon: "🤖", title: "AI Object Detection", desc: "YOLOv8 with TensorRT quantization runs on-device for real-time detection of humans and objects at the edge.", tag: "Edge AI", theme: "orange" },
  { icon: "🌙", title: "Night Vision", desc: "Arducam 8MP NOIR camera provides clear visual feed in low-light and zero-visibility underground environments.", tag: "Vision", theme: "purple" },
  { icon: "📡", title: "LiDAR 3D SLAM", desc: "2D RPI LiDAR combined with Pose Graph SLAM creates real-time 3D maps of multi-level tunnel structures — without GPS.", tag: "Navigation", theme: "blue" },
  { icon: "💨", title: "Multi-Gas Monitoring", desc: "Industrial-grade MEMS sensors detect CH₄, CO, H₂S, and O₃ continuously, with automated hazard classification and alert escalation.", tag: "Safety", theme: "red" },
  { icon: "📶", title: "Wi-Fi HaLow Mesh", desc: "IEEE 802.11ah mesh protocol with relay nodes enables long-range, low-power underground communication with self-healing capability.", tag: "Communication", theme: "green" },
  { icon: "🗣️", title: "Two-Way Voice (WebRTC)", desc: "Real-time voice communication between surface operators and subsurface via WebRTC, even through the mesh network.", tag: "Communication", theme: "blue" },
  { icon: "🔄", title: "Auto-Retrace", desc: "When communication is lost, the rover autonomously retraces its SLAM path back to the last known mesh relay node.", tag: "Resilience", theme: "orange" },
  { icon: "🔋", title: "Smart Docking", desc: "Auto-docking station for autonomous recharging, data transfer, and continuous monitoring without manual intervention.", tag: "Autonomy", theme: "green" },
  { icon: "🚁", title: "Micro Drone Deployment", desc: "Deployable micro drone extends reach into narrow passages and vertical shafts that the rover chassis cannot access.", tag: "Dual Platform", theme: "purple" },
  { icon: "🛡️", title: "Fault-Tolerant Architecture", desc: "Multi-threaded design with independent subsystem supervision — individual failures are isolated and auto-restarted.", tag: "Reliability", theme: "green" },
  { icon: "🗺️", title: "Multi-Level Gas Mapping", desc: "Gas concentration data is mapped onto the 3D SLAM model, creating visual hazard zone overlays for rescue planning.", tag: "Mapping", theme: "red" },
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
              Engineered for real underground mine scenarios — combining thermal imaging, LiDAR SLAM, multi-gas detection, 
              and autonomous navigation in a single ruggedized platform.
            </p>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-24 px-6 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Capabilities</h2>
              <p className="text-gray-500">Every feature is designed for maximum safety and operational reliability in hazardous environments.</p>
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
