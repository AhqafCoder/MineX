"use client";

const archLayers = [
  { emoji: "🔬", label: "Sensor Layer", items: "DHT11 · MPU-6050 · QMC6310 · MQ-135 · ESP32-CAM", color: "bg-gray-50 border-gray-100 text-orange-600" },
  { emoji: "💻", label: "Edge Processing", items: "Raspberry Pi", color: "bg-gray-50 border-gray-100 text-blue-700" },
  { emoji: "🧠", label: "Intelligence", items: "YOLOv8 Nano · Sensor Fusion · Safety Logic", color: "bg-gray-50 border-gray-100 text-green-700" },
  { emoji: "💾", label: "Data Layer", items: "SQLite · MongoDB Atlas", color: "bg-gray-50 border-gray-100 text-purple-700" },
  { emoji: "📡", label: "Communication", items: "TCP Telemetry", color: "bg-gray-50 border-gray-100 text-blue-700" },
  { emoji: "🖥️", label: "Command Center", items: "Operator Interface", color: "bg-gray-50 border-gray-100 text-gray-500" },
];

const threads = [
  { id: "01", name: "MPU-6050", label: "Motion / IMU" },
  { id: "02", name: "QMC6310", label: "Compass" },
  { id: "03", name: "DHT11", label: "Env Monitor" },
  { id: "04", name: "MQ-135", label: "Gas Sensor" },
  { id: "05", name: "ESP32-CAM", label: "Vision Feed" },
];

export default function ArchitectureSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Architecture */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              System Design
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Inside the MineX Edge Node</h2>
            <div className="flex flex-col items-start gap-0">
              {archLayers.map((layer, i) => (
                <div key={layer.label} className="flex flex-col items-start">
                  <div className={`px-5 py-3 rounded-xl border w-72 flex items-center gap-3 ${layer.color}`}>
                    <span className="text-xl">{layer.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm">{layer.label}</div>
                      <div className="text-xs opacity-70">{layer.items}</div>
                    </div>
                  </div>
                  {i < archLayers.length - 1 && (
                    <div className="text-gray-500 text-lg pl-6 py-0.5">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fault tolerance */}
          <div>
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              Fault Tolerance
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Built to Keep Running.</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              If a sensor fails, the corresponding task catches the error and restarts
              independently — without affecting the rest of the system.
            </p>

            <div className="space-y-2 mb-4">
              {threads.map((t) => (
                <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <span className="text-xs font-bold text-gray-500">T{t.id}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.label}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-semibold text-orange-600">Running</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
              <div className="font-semibold text-green-700 mb-1">🔄 Auto-Healing Fault Tolerance</div>
              <p className="text-orange-600 text-sm">
                Each thread is supervised independently. Failures are caught and
                restarted with zero impact on other sensors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
