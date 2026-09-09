"use client";

export default function SolutionSection() {
  const flow = [
    { icon: "🤖", label: "Rover", sub: "MINEX-01" },
    { icon: "🔬", label: "Sensors", sub: "DHT11 · MPU-6050 · MQ-135" },
    { icon: "💻", label: "Edge Node", sub: "Raspberry Pi" },
    { icon: "🧠", label: "AI + Fusion", sub: "YOLOv8 Nano" },
    { icon: "💾", label: "Local Storage", sub: "SQLite · Offline-first" },
    { icon: "🖥️", label: "Command Center", sub: "TCP · MongoDB Atlas" },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-gray-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
              Our Solution
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              A Resilient Edge System for Real-World Impact
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              An autonomous, AI-enabled rover powered by a Raspberry Pi based Edge Node
              that can explore, detect and monitor hazardous environments in real time.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              MineX integrates multi-sensor data, computer vision and dual-layer data
              management to ensure safe, reliable and continuous operation even with no
              network connectivity.
            </p>
            <div className="space-y-2">
              {[
                "Edge AI inference with YOLOv8 Nano",
                "Offline-first SQLite + MongoDB dual storage",
                "Multi-threaded fault-tolerant architecture",
                "Real-time TCP telemetry streaming",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-gray-900">
                  <span className="text-orange-600 font-bold">✓</span>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flow */}
          <div className="flex flex-col items-center gap-0">
            {flow.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3 flex items-center gap-3 w-72">
                  <span className="text-2xl">{step.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{step.label}</div>
                    <div className="text-xs text-gray-500">{step.sub}</div>
                  </div>
                </div>
                {i < flow.length - 1 && (
                  <div className="text-gray-500 text-lg leading-tight py-0.5">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
