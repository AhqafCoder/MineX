"use client";

const problems = [
  {
    icon: "⚠️",
    number: "01",
    title: "Dangerous Areas",
    desc: "Collapsed structures, disaster sites and mining shafts are too risky for humans to enter.",
    color: "bg-gray-50 border-gray-100",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: "⏱️",
    number: "02",
    title: "Slow Search",
    desc: "Manual searching operations are time-consuming and can fail to locate survivors in hazardous environments.",
    color: "bg-gray-50 border-gray-100",
    badge: "text-orange-500 bg-gray-100",
  },
  {
    icon: "🚨",
    number: "03",
    title: "High Risk to Life",
    desc: "Exposure to toxic gases, extreme temperatures and unstable structures puts rescue teams at risk.",
    color: "bg-gray-50 border-gray-100",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: "📡",
    number: "04",
    title: "Unreliable Connectivity",
    desc: "Network blackouts underground can lead to loss of critical telemetry and operational data.",
    color: "bg-gray-50 border-gray-100",
    badge: "text-yellow-600 bg-gray-100",
  },
  {
    icon: "💸",
    number: "05",
    title: "Expensive Solutions",
    desc: "Existing systems can be costly, bulky and difficult to deploy across large mining operations.",
    color: "bg-gray-50 border-gray-100",
    badge: "text-gray-500 bg-gray-100",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-50 text-red-500 text-sm font-semibold rounded-full mb-4">
            The Problem
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Real Risks. Real Challenges.</h2>
          <p className="text-gray-500 text-lg">Challenges that MineX was built to solve.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p) => (
            <div
              key={p.number}
              className={`rounded-2xl border p-6 ${p.color} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.badge}`}>
                  {p.number}
                </span>
                <span className="text-2xl">{p.icon}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}

          {/* CTA card */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl mb-3">🤖</span>
            <div className="font-bold text-orange-600 mb-1">MineX solves all of this</div>
            <p className="text-orange-600 text-sm">Edge AI · Offline-first · Autonomous</p>
          </div>
        </div>
      </div>
    </section>
  );
}
