"use client";

import { Search, ShieldCheck, Database, Settings, TrendingUp, Radar, Radio } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const features: {
  icon: LucideIcon;
  title: string;
  highlight: string;
  highlightColor: string;
  desc: string;
  stat: string;
  statLabel: string;
}[] = [
  {
    icon: Search,
    title: "Thermal + AI Survivor Detection",
    highlight: "Faster Rescue",
    highlightColor: "bg-gray-100 text-red-600",
    desc: "FLIR Lepton 3.5 thermal camera combined with YOLOv8 (TensorRT) detects trapped workers through heat signatures — even in smoke, dust, and total darkness.",
    stat: "2×",
    statLabel: "Detection Modes (Thermal + Visual)",
  },
  {
    icon: Radar,
    title: "GPS-Free 3D SLAM Mapping",
    highlight: "Autonomous Navigation",
    highlightColor: "bg-gray-100 text-blue-600",
    desc: "2D RPI LiDAR and MPU-9250 IMU feed into a Pose Graph SLAM pipeline via ROS2 Nav2, enabling real-time 3D tunnel mapping without GPS.",
    stat: "3D",
    statLabel: "Multi-Level Mapping",
  },
  {
    icon: Radio,
    title: "Wi-Fi HaLow Underground Mesh",
    highlight: "Always Connected",
    highlightColor: "bg-gray-100 text-purple-600",
    desc: "IEEE 802.11ah Wi-Fi HaLow creates a self-healing mesh network with relay nodes for long-range, low-power underground communication.",
    stat: "1km+",
    statLabel: "Underground Range",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Gas Hazard Monitoring",
    highlight: "Continuous Safety",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "Industrial-grade MEMS sensors continuously monitor CH₄, CO, H₂S, and O₃ levels, classifying hazard zones and triggering real-time alerts.",
    stat: "4",
    statLabel: "Gas Types Monitored",
  },
  {
    icon: Settings,
    title: "Auto-Retrace & Smart Docking",
    highlight: "Mission Resilience",
    highlightColor: "bg-gray-100 text-orange-600",
    desc: "When communication is lost, the rover autonomously retraces its path back to the last mesh node. Smart docking enables auto-charging and data transfer.",
    stat: "100%",
    statLabel: "Safe Return Rate",
  },
  {
    icon: TrendingUp,
    title: "Dual Platform Mobility",
    highlight: "Rover + Drone",
    highlightColor: "bg-gray-100 text-green-600",
    desc: "All-terrain tank chassis with BLDC motors navigates rough terrain, while a deployable micro drone extends reach into areas the rover can't access.",
    stat: "2",
    statLabel: "Mobility Platforms",
  },
];

export default function WhyMineXSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" scale blur>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              Why MineX
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Innovation & Key Features</h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} direction="up" delay={i * 0.08}>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6">
                {/* Number + Icon */}
                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-2xl text-gray-500 font-bold w-8">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <f.icon className="w-5 h-5 text-orange-600" />
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
