import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import Image from "next/image";

export const metadata = {
  title: "Safety — MineX",
};

const safetyFeatures = [
  { title: "Human Detection Priority", desc: "AI human detection is the highest-priority safety task. Alerts are broadcast instantly.", icon: "👤" },
  { title: "Hazardous Gas Monitoring", desc: "MQ-135 continuously monitors air quality and escalates alert severity automatically.", icon: "💨" },
  { title: "Environmental Thresholds", desc: "Temperature and humidity out-of-range conditions trigger automatic warnings.", icon: "🌡️" },
  { title: "Emergency Stop", desc: "A single command immediately halts all rover movement safely.", icon: "🛑" },
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
                Turn data into safe decisions.
              </h1>
              <p className="text-lg text-gray-500 mb-8">
                MineX transforms raw sensor readings into clear, actionable safety intelligence — protecting human life in real time.
              </p>
            </div>
            <div className="relative aspect-square max-w-sm mx-auto bg-white rounded-full shadow-xl p-8 border border-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gray-100 opacity-50 blur-xl" />
              <Image src="/minex-rover.png" alt="MineX Rover" fill className="object-contain p-8 relative z-10" />
              
              {/* Floating tags */}
              <div className="absolute top-10 left-0 bg-red-500 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Human Detected (94%)
              </div>
              <div className="absolute bottom-10 right-0 bg-orange-600 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                Air Quality Safe
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Safety Lifecycle</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {['Detect', 'Classify', 'Evaluate', 'Alert', 'Respond'].map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 text-red-500 flex items-center justify-center font-bold text-lg mb-3 border border-gray-100">
                    {i + 1}
                  </div>
                  <div className="font-semibold text-gray-900">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {safetyFeatures.map(f => (
                <div key={f.title} className="bg-white p-8 rounded-3xl border border-gray-100 flex gap-4">
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
