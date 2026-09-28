"use client";

import Image from "next/image";

export default function RoverShowcase() {
  const callouts = [
    { emoji: "👁️", label: "AI Vision", sub: "YOLOv8 Nano", pos: "top-8 left-0" },
    { emoji: "📡", label: "LiDAR", sub: "Spatial mapping", pos: "top-8 right-0" },
    { emoji: "💻", label: "Edge Node", sub: "Raspberry Pi", pos: "bottom-20 left-0" },
    { emoji: "🌡️", label: "Env Sensors", sub: "DHT22 · MQ-135", pos: "bottom-20 right-0" },
  ];

  const specs = [
    { label: "Processor", value: "Raspberry Pi" },
    { label: "AI Model", value: "YOLOv8 Nano" },
    { label: "Camera", value: "ESP32-CAM" },
    { label: "Storage", value: "SQLite + Atlas" },
    { label: "Protocol", value: "TCP Socket" },
    { label: "Mode", value: "Autonomous" },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Product Overview
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Meet MineX</h2>
          <p className="text-gray-500">Engineering intelligence for hazardous environments</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Rover */}
          <div className="relative aspect-square max-w-sm mx-auto">
            {/* Soft background */}
            <div className="absolute inset-4 rounded-full bg-gray-100 opacity-40" />

            <Image
              src="/minex-rover.png"
              alt="MineX Rover"
              fill
              className="object-contain drop-shadow-xl relative z-10"
            />

            {/* Callout badges */}
            {callouts.map((c) => (
              <div
                key={c.label}
                className={`absolute ${c.pos} bg-white rounded-xl shadow-md border border-gray-100 px-3 py-2 z-20`}
              >
                <div className="flex items-center gap-2">
                  <span>{c.emoji}</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{c.label}</div>
                    <div className="text-xs text-gray-500">{c.sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-8">
            {specs.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className="text-xs font-semibold text-orange-600">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
