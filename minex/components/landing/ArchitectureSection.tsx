"use client";

import { Radar, Cpu, Brain, Database, Radio, Monitor, RefreshCw, Flame, Camera, Wind, Compass, Activity } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const archLayers: { icon: LucideIcon; label: string; items: string; color: string }[] = [
  { icon: Radar, label: "Sensor Layer", items: "LiDAR · MPU-9250 · FLIR Thermal · Gas Sensors · NOIR Camera", color: "bg-gray-50 border-gray-100 text-orange-600" },
  { icon: Cpu, label: "Edge Processing", items: "NVIDIA Jetson / Raspberry Pi 4", color: "bg-gray-50 border-gray-100 text-blue-700" },
  { icon: Brain, label: "Intelligence", items: "YOLOv8 TensorRT · Pose Graph SLAM · ROS2 Nav2", color: "bg-gray-50 border-gray-100 text-green-700" },
  { icon: Database, label: "Data Layer", items: "Local Storage · Telemetry Pipeline", color: "bg-gray-50 border-gray-100 text-purple-700" },
  { icon: Radio, label: "Communication", items: "Wi-Fi HaLow 802.11ah Mesh · WebRTC Voice", color: "bg-gray-50 border-gray-100 text-blue-700" },
  { icon: Monitor, label: "Surface Station", items: "Command Center Dashboard · 3D Mine Map", color: "bg-gray-50 border-gray-100 text-gray-500" },
];

const threads = [
  { id: "01", name: "LiDAR + IMU", label: "SLAM Mapping" },
  { id: "02", name: "FLIR Thermal", label: "Survivor Detection" },
  { id: "03", name: "Gas Sensors", label: "CH₄ · CO · H₂S · O₃" },
  { id: "04", name: "Night Vision", label: "Low-Light Feed" },
  { id: "05", name: "YOLOv8 AI", label: "Object Detection" },
  { id: "06", name: "Wi-Fi HaLow", label: "Mesh Communication" },
];

export default function ArchitectureSection() {
  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Architecture */}
          <ScrollReveal direction="left">
            <div>
              <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
                System Design
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Inside the MineX Architecture</h2>
              <div className="flex flex-col items-start gap-0">
                {archLayers.map((layer, i) => (
                  <ScrollReveal key={layer.label} direction="left" delay={i * 0.1}>
                    <div className="flex flex-col items-start">
                      <div className={`px-5 py-3 rounded-xl border w-80 flex items-center gap-3 ${layer.color}`}>
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                          <layer.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{layer.label}</div>
                          <div className="text-xs opacity-70">{layer.items}</div>
                        </div>
                      </div>
                      {i < archLayers.length - 1 && (
                        <div className="text-gray-300 text-lg pl-6 py-0.5">↓</div>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Fault tolerance */}
          <ScrollReveal direction="right">
            <div>
              <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
                Fault Tolerance
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Built to Keep Running.</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Each subsystem runs as an independent, supervised thread. If a sensor
                fails or short-circuits, the system isolates the fault and auto-restarts
                it — without impacting any other operation. If communication is lost
                entirely, the rover auto-retraces its path to the last known mesh node.
              </p>

              <div className="space-y-2 mb-4">
                {threads.map((t, i) => (
                  <ScrollReveal key={t.id} direction="right" delay={i * 0.08}>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
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
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal direction="up" delay={0.4}>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                  <div className="font-semibold text-green-700 mb-1 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Auto-Healing + Auto-Retrace
                  </div>
                  <p className="text-orange-600 text-sm">
                    Failures are caught and restarted with zero impact on other subsystems.
                    If comms are lost, SLAM Pose Graph recovery retraces the path home.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
