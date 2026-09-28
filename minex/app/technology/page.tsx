import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import RoverExplodedViewWrapper from "@/components/technology/RoverExplodedViewWrapper";

export const metadata = {
  title: "Technology — MineX",
};

const techSections = [
  {
    id: "01",
    title: "Edge Computing",
    subtitle: "On-Device Intelligence",
    desc: "MineX runs all critical AI inference, sensor fusion and data management locally on a Raspberry Pi edge node. This ensures low-latency responses and full operational continuity even without network connectivity.",
    specs: ["Raspberry Pi 4B", "Local SQLite storage", "<100ms inference latency"],
  },
  {
    id: "02",
    title: "Computer Vision",
    subtitle: "YOLOv8 Nano Inference",
    desc: "YOLOv8 Nano runs directly on the edge node, processing frames from the ESP32-CAM to detect humans and cell phones in real time — even in low-light, dusty conditions.",
    specs: ["YOLOv8 Nano model", "ESP32-CAM input", "Class 0 & 67 detection"],
  },
  {
    id: "03",
    title: "Sensor Fusion",
    subtitle: "Multi-Stream Data Integration",
    desc: "MineX continuously fuses data from five independent sensor streams — motion, orientation, environmental, gas and visual — into a unified situational awareness picture.",
    specs: ["DHT22", "MPU-6050", "QMC6310", "MQ-135", "ESP32-CAM"],
  },
  {
    id: "04",
    title: "Offline-First Architecture",
    subtitle: "Connectivity-Independent Operation",
    desc: "Every piece of telemetry is written to a local SQLite database first. MongoDB Atlas sync runs as a background process whenever connectivity is available.",
    specs: ["SQLite primary", "MongoDB Atlas sync", "Zero data loss guarantee"],
  },
  {
    id: "05",
    title: "Fault Tolerance",
    subtitle: "Self-Healing Concurrent Threads",
    desc: "Each sensor thread is independently supervised. A try/except wrapper catches all errors at the thread level and triggers an automatic restart.",
    specs: ["5 sensor threads", "Isolated error handling", "Auto-restarts"],
  },
  {
    id: "06",
    title: "Telemetry & Remote Ops",
    subtitle: "TCP Socket Streaming",
    desc: "A persistent TCP socket broadcasts live telemetry from the rover edge node to the operator's command center at sub-second intervals.",
    specs: ["TCP socket protocol", "Sub-second broadcast", "Remote control"],
  },
];

export default function TechnologyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-white">
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white text-orange-600 text-sm font-semibold rounded-full mb-4 border border-gray-100">
              Deep Tech
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Engine Inside
            </h1>
            <p className="text-lg text-gray-500">
              Six core technology pillars enable MineX to operate reliably in the world&apos;s most demanding environments.
            </p>
          </div>
        </section>

        {/* 3D Exploded View Section */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <RoverExplodedViewWrapper />
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {techSections.map((tech) => (
              <div key={tech.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
                <div className="text-5xl font-bold text-gray-100">{tech.id}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-orange-600 mb-1">{tech.subtitle}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{tech.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-4">{tech.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.specs.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-full border border-gray-100">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
