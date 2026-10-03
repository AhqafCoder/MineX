"use client";

import Link from "next/link";
import Image from "next/image";
import { Bot, Radio, ShieldCheck, Radar, Flame, Map } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function HeroSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const stats = [
    { icon: Bot, label: "AI Survivor Detection", sub: "Thermal + Vision" },
    { icon: Map, label: "GPS-Free 3D SLAM", sub: "LiDAR + IMU Mapping" },
    { icon: Radio, label: "Wi-Fi HaLow Mesh", sub: "Underground Comms" },
    { icon: ShieldCheck, label: "Fault-Tolerant", sub: "Auto-Healing System" },
  ];

  return (
    <section ref={sectionRef} className="pt-16 min-h-screen bg-white flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left */}
        <div>
          <ScrollReveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-orange-600 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              System Online — MINEX-01 Active
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Intelligent Rover,{" "}
              <span className="text-orange-600">Safer Mines.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
              An autonomous, AI-powered rover with thermal imaging, LiDAR-based
              3D SLAM, and Wi-Fi HaLow mesh communication — built to navigate
              GPS-denied underground mines, detect trapped workers, and map
              hazardous environments in real time.
            </p>
          </ScrollReveal>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} direction="up" delay={0.3 + i * 0.08}>
                <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{s.label}</div>
                    <div className="text-xs text-gray-500">{s.sub}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.6}>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/technology"
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors"
              >
                Explore Technology
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Right: Rover with parallax */}
        <motion.div 
          className="relative flex items-center justify-center"
          style={{ y: imageY, scale: imageScale }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-gray-100 opacity-60" />
          </div>

          <div className="relative w-full aspect-square max-w-md">
            <Image
              src="/minex-rover.png"
              alt="MineX Rover"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              priority
              className="object-contain drop-shadow-xl"
            />
          </div>

          {/* Floating badges */}
          <ScrollReveal direction="right" delay={0.5}>
            <div className="absolute top-8 right-4 bg-white rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" /> System Online
            </div>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={0.6}>
            <div className="absolute bottom-16 left-4 bg-gray-50 border border-gray-100 rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-red-600 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" /> Thermal Detection Active
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.7}>
            <div className="absolute bottom-4 right-8 bg-gray-50 border border-gray-100 rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-blue-600 flex items-center gap-2">
              <Radar className="w-3.5 h-3.5" /> LiDAR Mapping
            </div>
          </ScrollReveal>
        </motion.div>
      </div>
    </section>
  );
}
