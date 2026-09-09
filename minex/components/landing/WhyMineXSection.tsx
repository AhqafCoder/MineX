"use client";

const features = [
  {
    icon: "🔍",
    title: "Rapid Survivor Location",
    highlight: "Faster Rescue",
    highlightColor: "bg-gray-100 text-red-600",
    desc: "Edge-AI powered human detection actively searches for humans and cell phones, reducing search time in disaster zones.",
    stat: "94%",
    statLabel: "Detection Confidence",
  },
  {
    icon: "🛡️",
    title: "Proactive Hazard Prevention",
    highlight: "Safer Operations",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "Continuous real-time monitoring of temperature, humidity and hazardous gas levels keeps responders safe.",
    stat: "5+",
    statLabel: "Live Sensor Streams",
  },
  {
    icon: "💾",
    title: "Zero Data Loss",
    highlight: "Reliable Data",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "Offline-first, dual-database architecture ensures critical telemetry is never lost even in network blackouts.",
    stat: "0%",
    statLabel: "Data Loss Rate",
  },
  {
    icon: "⚙️",
    title: "Mission-Critical Durability",
    highlight: "Always Running",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "Multi-threaded architecture isolates sensor failures so the rest of the rover continues operating.",
    stat: "5",
    statLabel: "Independent Threads",
  },
  {
    icon: "📈",
    title: "Cost-Effective Scalability",
    highlight: "Affordable",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "Built on Raspberry Pi and ESP32 — affordable hardware with open-source software for large-scale deployment.",
    stat: "4×",
    statLabel: "Fleet Ready",
  },
];

export default function WhyMineXSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Why MineX
          </div>
          <h2 className="text-4xl font-bold text-gray-900">What makes it special?</h2>
        </div>

        <div className="space-y-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6"
            >
              {/* Number + Icon */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-2xl text-gray-500 font-bold w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                  {f.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{f.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${f.highlightColor}`}>
                    {f.highlight}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>

              {/* Stat */}
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-bold text-orange-600">{f.stat}</div>
                <div className="text-xs text-gray-500">{f.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
