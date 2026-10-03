"use client";

import { Bot, Radar, Cpu, Brain, Database, Monitor, Check, Radio, Flame } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const flow: { icon: LucideIcon; label: string; sub: string }[] = [
  { icon: Bot, label: "MineX Rover", sub: "All-Terrain Tank Chassis + Micro Drone" },
  { icon: Radar, label: "Sensing Suite", sub: "LiDAR · IMU · Thermal · Gas Sensors · Night Vision" },
  { icon: Cpu, label: "Edge AI Processing", sub: "NVIDIA Jetson / Raspberry Pi 4" },
  { icon: Brain, label: "Intelligence Layer", sub: "YOLOv8 (TensorRT) · Pose Graph SLAM · ROS2 Nav2" },
  { icon: Radio, label: "Communication", sub: "Wi-Fi HaLow 802.11ah Mesh · WebRTC Voice" },
  { icon: Database, label: "Data Management", sub: "Local Storage · Telemetry Streaming" },
  { icon: Monitor, label: "Surface Control Station", sub: "Real-Time Dashboard · 3D Mine Map" },
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
                Autonomous Reconnaissance Before Human Entry
              </h2>
              <p className="text-gray-500 leading-relaxed mb-4">
                MineX is a ruggedized, autonomous rover designed to perform remote
                reconnaissance in GPS-denied underground mine environments. Equipped
                with thermal imaging, LiDAR-based 3D SLAM, and edge AI detection,
                it provides real-time situational awareness to surface operators —
                before any human enters the hazardous zone.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6">
                Supported by a Wi-Fi HaLow mesh network for reliable underground
                communication, smart auto-docking for recharging, and auto-retrace
                capabilities when connectivity is lost — MineX is built for
                continuous, fault-tolerant operation.
              </p>
              <div className="space-y-2">
                {[
                  "Thermal + Night Vision survivor detection (FLIR Lepton 3.5 + Arducam NOIR)",
                  "GPS-free 3D mapping via LiDAR + IMU Pose Graph SLAM",
                  "Multi-gas monitoring — CH₄, CO, H₂S, O₃ with hazard classification",
                  "Wi-Fi HaLow (802.11ah) self-healing mesh communication",
                  "Auto-retrace and safe return when communication is lost",
                  "Dual platform mobility — rover + deployable micro drone",
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
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-3 flex items-center gap-3 w-80">
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
