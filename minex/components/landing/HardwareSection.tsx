"use client";

import Image from "next/image";

const hardware = [
  { id: "DHT11", emoji: "🌡️", name: "Temperature + Humidity", desc: "Environmental monitoring", color: "bg-gray-50 border-gray-100" },
  { id: "MPU-6050", emoji: "📐", name: "Accelerometer / Gyroscope", desc: "Motion and kinematics", color: "bg-gray-50 border-gray-100" },
  { id: "QMC6310", emoji: "🧭", name: "Compass", desc: "Orientation & heading", color: "bg-gray-50 border-gray-100" },
  { id: "ESP32-CAM", emoji: "📷", name: "Camera Feed", desc: "Vision input for AI", color: "bg-gray-50 border-gray-100" },
  { id: "MQ-135", emoji: "💨", name: "Gas / Air Quality", desc: "Hazardous gas detection", color: "bg-gray-50 border-gray-100" },
  { id: "Raspberry Pi", emoji: "💻", name: "Edge Node", desc: "Local AI processing", color: "bg-gray-50 border-gray-100", featured: true },
];

export default function HardwareSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Hardware
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Hardware Intelligence</h2>
          <p className="text-gray-500">Low-Cost Hardware. High-Impact Intelligence.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Left sensors */}
          <div className="space-y-3">
            {hardware.slice(0, 3).map((hw) => (
              <div key={hw.id} className={`rounded-2xl border p-4 ${hw.color} hover:shadow-sm transition-shadow`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hw.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">{hw.id}</div>
                    <div className="font-semibold text-gray-900 text-sm">{hw.name}</div>
                    <div className="text-xs text-gray-500">{hw.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Center rover */}
          <div className="relative">
            <div className="absolute inset-4 rounded-full bg-gray-100 opacity-40" />
            <div className="relative w-full aspect-square">
              <Image
                src="/minex-rover.png"
                alt="MineX Hardware"
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>

          {/* Right sensors */}
          <div className="space-y-3">
            {hardware.slice(3).map((hw) => (
              <div key={hw.id} className={`rounded-2xl border p-4 ${hw.color} ${hw.featured ? "ring-2 ring-orange-300" : ""} hover:shadow-sm transition-shadow`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{hw.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase">{hw.id}</div>
                    <div className="font-semibold text-gray-900 text-sm">{hw.name}</div>
                    <div className="text-xs text-gray-500">{hw.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
