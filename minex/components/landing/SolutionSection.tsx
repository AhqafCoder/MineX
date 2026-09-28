"use client";

import { Bot, Microscope, Cpu, Brain, Database, Monitor, Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const flow: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Bot, label: "Rover", sub: "MINEX-01 / Micro Drone" },
  { icon: Microscope, label: "Sensors", sub: "LiDAR · Thermal · Gas" },
  { icon: Cpu, label: "Edge Node", sub: "NVIDIA Jetson / RPi 4" },
  { icon: Brain, label: "AI + Fusion", sub: "YOLOv8 TensorRT" },
  { icon: Database, label: "Mesh Comms", sub: "Wi-Fi HaLow · Auto-Retrace" },
  { icon: Monitor, label: "Dashboard", sub: "React · FastAPI · WebRTC" },
];

export default function SolutionSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left text — slides from left */}
          <ScrollReveal direction="left">
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
                  "Edge AI inference with YOLOv8 TensorRT + Thermal",
                  "GPS-free 3D SLAM mapping and autonomous navigation",
                  "Auto-Retrace capability over Wi-Fi HaLow mesh",
                  "Real-time Dashboard with WebRTC two-way audio",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm text-gray-900">
                    <Check className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Flow — slides from right */}
          <ScrollReveal direction="right">
            <div className="flex flex-col items-center gap-0">
              {flow.map((step, i) => (
                <ScrollReveal key={step.label} direction="right" delay={i * 0.1}>
                  <div className="flex flex-col items-center">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3 flex items-center gap-3 w-72">
                      <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                        <step.icon className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{step.label}</div>
                        <div className="text-xs text-gray-500">{step.sub}</div>
                      </div>
                    </div>
                    {i < flow.length - 1 && (
                      <div className="text-gray-300 text-lg leading-tight py-0.5">↓</div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
