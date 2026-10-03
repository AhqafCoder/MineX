import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import Image from "next/image";

export const metadata = {
  title: "Safety — MineX",
};

const safetyFeatures = [
  { title: "Thermal Survivor Detection", desc: "FLIR Lepton 3.5 thermal camera detects human heat signatures through smoke, dust, and total darkness — alerting operators instantly.", icon: "🔥" },
  { title: "Multi-Gas Hazard Monitoring", desc: "Industrial MEMS sensors continuously monitor CH₄, CO, H₂S, and O₃ levels, with automated hazard zone classification and alert escalation.", icon: "💨" },
  { title: "GPS-Free 3D Hazard Mapping", desc: "LiDAR + IMU SLAM creates real-time 3D tunnel maps with gas concentration overlays, enabling visual hazard zone identification.", icon: "🗺️" },
  { title: "Auto-Retrace Safe Return", desc: "When communication is lost, the rover autonomously retraces its SLAM path back to the last known relay node — ensuring it never gets lost.", icon: "🔄" },
  { title: "Emergency Stop", desc: "A single command immediately halts all rover movement and motor activity for safety.", icon: "🛑" },
  { title: "Continuous Atmospheric Monitoring", desc: "Real-time atmospheric data stream enables operators to make informed entry decisions before any human approaches the hazard zone.", icon: "📊" },
];

const comparisonData = [
  { aspect: "Rescue Approach", current: "Human enters hazardous zone first", minex: "Autonomous rover performs reconnaissance first" },
  { aspect: "Visibility", current: "Limited in smoke, dust, and darkness", minex: "Thermal imaging + Night vision + 3D mapping" },
  { aspect: "Communication", current: "Communication blackouts underground", minex: "Wi-Fi HaLow self-healing mesh network" },
  { aspect: "Hazard Assessment", current: "Manual, slow, and uncertain", minex: "Real-time multi-gas mapping and hazard classification" },
  { aspect: "Survivor Search", current: "Time-consuming and risky", minex: "AI-assisted thermal survivor localization" },
];

export default function SafetyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-white">
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-white text-red-500 text-sm font-semibold rounded-full mb-4 border border-gray-100">
                Safety First
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Autonomous reconnaissance before human entry.
              </h1>
              <p className="text-lg text-gray-500 mb-8">
                MineX transforms underground mine rescue by performing autonomous reconnaissance first — 
                mapping hazards, detecting survivors, and monitoring atmospheric conditions so that
                rescue teams can make informed, safer decisions.
              </p>
            </div>
            <div className="relative aspect-square max-w-sm mx-auto bg-white rounded-full shadow-xl p-8 border border-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gray-100 opacity-50 blur-xl" />
              <Image src="/minex-rover.png" alt="MineX Rover" fill className="object-contain p-8 relative z-10" />
              
              {/* Floating tags */}
              <div className="absolute top-10 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                🔥 Thermal Detection Active
              </div>
              <div className="absolute bottom-16 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                💨 Gas: Safe Zone
              </div>
              <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                📡 LiDAR Mapping
              </div>
            </div>
          </div>
        </section>

        {/* Safety Lifecycle */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Decision Workflow</h2>
            <p className="text-gray-500 text-center mb-12">SENSE → UNDERSTAND → DECIDE → ACT</p>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {[
                { step: 'Sense', desc: 'LiDAR, Thermal, Gas, IMU' },
                { step: 'Understand', desc: 'AI Analysis & Fusion' },
                { step: 'Decide', desc: 'Risk Assessment & Path Planning' },
                { step: 'Act', desc: 'Map, Alert, Navigate, Report' },
              ].map((item, i) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 text-red-500 flex items-center justify-center font-bold text-lg mb-3 border border-gray-100">
                    {i + 1}
                  </div>
                  <div className="font-semibold text-gray-900">{item.step}</div>
                  <div className="text-xs text-gray-500 mt-1 max-w-[120px]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">The Difference We Make</h2>
            <p className="text-gray-500 text-center mb-12">How MineX changes the approach to underground mine safety and rescue.</p>
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100 p-4">
                <div className="font-bold text-gray-900 text-sm">Aspect</div>
                <div className="font-bold text-gray-400 text-sm">Current System</div>
                <div className="font-bold text-orange-600 text-sm">With MineX</div>
              </div>
              {comparisonData.map((row) => (
                <div key={row.aspect} className="grid grid-cols-3 p-4 border-b border-gray-50 last:border-b-0">
                  <div className="font-semibold text-gray-900 text-sm">{row.aspect}</div>
                  <div className="text-gray-400 text-sm">{row.current}</div>
                  <div className="text-gray-700 text-sm font-medium">{row.minex}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Safety Systems</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {safetyFeatures.map(f => (
                <div key={f.title} className="bg-white p-8 rounded-3xl border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
                  <div className="text-3xl">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
