"use client";

import Image from "next/image";
import { Thermometer, Compass, Radar, Camera, Wind, Cpu, Flame, Radio, Activity, Cog } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const hardware: { id: string; icon: LucideIcon; name: string; desc: string; featured?: boolean }[] = [
  { id: "2D RPI LiDAR", icon: Radar, name: "LiDAR Perception", desc: "3D mapping & obstacle detection" },
  { id: "MPU-9250 (9-DOF)", icon: Compass, name: "IMU + Magnetometer", desc: "Motion tracking & orientation" },
  { id: "MEMS Gas Sensors", icon: Wind, name: "CH₄ · CO · H₂S · O₃", desc: "Multi-gas hazard monitoring" },
  { id: "FLIR Lepton 3.5", icon: Flame, name: "Thermal Camera", desc: "Heatmap survivor detection" },
  { id: "Arducam 8MP NOIR", icon: Camera, name: "Night Vision Camera", desc: "Low-light visual feed" },
  { id: "Wi-Fi HaLow", icon: Radio, name: "802.11ah Mesh Comms", desc: "Long-range underground network" },
  { id: "BLDC Motors", icon: Cog, name: "Tank Chassis Drive", desc: "Rugged all-terrain mobility" },
  { id: "Jetson / RPi 4", icon: Cpu, name: "Edge AI Processor", desc: "Onboard vision, SLAM & decisions", featured: true },
];

export default function HardwareSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" scale blur>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              Hardware
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Purpose-Built Hardware</h2>
            <p className="text-gray-500">Ruggedized, modular components selected for underground mine environments.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 items-center">
          {/* Left sensors */}
          <div className="space-y-3">
            {hardware.slice(0, 4).map((hw, i) => (
              <ScrollReveal key={hw.id} direction="left" delay={i * 0.1}>
                <div className="rounded-2xl border p-4 bg-gray-50 border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <hw.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase">{hw.id}</div>
                      <div className="font-semibold text-gray-900 text-sm">{hw.name}</div>
                      <div className="text-xs text-gray-500">{hw.desc}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Center rover */}
          <ScrollReveal direction="up" scale>
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
          </ScrollReveal>

          {/* Right sensors */}
          <div className="space-y-3">
            {hardware.slice(4).map((hw, i) => (
              <ScrollReveal key={hw.id} direction="right" delay={i * 0.1}>
                <div className={`rounded-2xl border p-4 bg-gray-50 border-gray-100 ${hw.featured ? "ring-2 ring-orange-300" : ""} hover:shadow-sm transition-shadow`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <hw.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-500 uppercase">{hw.id}</div>
                      <div className="font-semibold text-gray-900 text-sm">{hw.name}</div>
                      <div className="text-xs text-gray-500">{hw.desc}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
