import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import FeatureCard from "@/components/features/FeatureCard";
export const metadata = {
  title: "Features — MineX",
};

const features = [
  { icon: "👁️", title: "AI Human Detection", desc: "YOLOv8 Nano detects humans in real-time with high confidence.", tag: "Primary Safety", theme: "red" },
  { icon: "📱", title: "Cell Phone Detection", desc: "Secondary detection of cell phones as a rescue assistance signal.", tag: "Rescue Aid", theme: "orange" },
  { icon: "🌡️", title: "Env Sensors", desc: "Continuous monitoring of temperature, humidity and air quality.", tag: "Safety", theme: "green" },
  { icon: "📡", title: "LiDAR Perception", desc: "Spatial perception for tunnel mapping and obstacle detection.", tag: "Navigation", theme: "blue" },
  { icon: "⚡", title: "Live Telemetry", desc: "Live streaming of all sensor data via TCP socket to operators.", tag: "Communication", theme: "purple" },
  { icon: "🎮", title: "Remote Control", desc: "Manual, assisted and autonomous operation modes.", tag: "Control", theme: "red" },
  { icon: "💾", title: "Offline Data", desc: "Telemetry is stored locally on SQLite. No data is lost offline.", tag: "Resilience", theme: "orange" },
  { icon: "🛡️", title: "Fault-Tolerant", desc: "Multi-threaded design ensures individual failures don't cascade.", tag: "Reliability", theme: "green" },
  { icon: "🔄", title: "Auto-Healing", desc: "Failed sensor threads restart automatically to maintain coverage.", tag: "Resilience", theme: "blue" },
  { icon: "🎯", title: "Mission Monitor", desc: "Track progress, waypoints, and real-time rover position.", tag: "Operations", theme: "purple" },
  { icon: "🗄️", title: "Local Storage", desc: "Edge node stores all operational data locally for immediate access.", tag: "Data", theme: "red" },
  { icon: "☁️", title: "Cloud Sync", desc: "Automatic synchronization to MongoDB Atlas when connected.", tag: "Data", theme: "green" },
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
