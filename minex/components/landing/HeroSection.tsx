"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ROVER_COMMAND_CENTER_URL } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="pt-16 min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-orange-600 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
            System Online — MINEX-01 Active
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
            Intelligent Rover,{" "}
            <span className="text-orange-600">Safer Mines.</span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-md">
            An edge-intelligent mining and disaster-response rover designed to
            detect humans, monitor hazardous environments and operate reliably
            even when connectivity fails.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { icon: "🤖", label: "AI Human Detection", sub: "Real-Time" },
              { icon: "📡", label: "Offline-First", sub: "Architecture" },
              { icon: "🛡️", label: "Fault-Tolerant", sub: "System" },
              { icon: "🔬", label: "Multi-Sensor", sub: "Perception" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={ROVER_COMMAND_CENTER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-gray-900 font-semibold rounded-full transition-colors"
            >
              Launch Command Center <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/technology"
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-full border border-gray-100 transition-colors"
            >
              Explore Technology
            </Link>
          </div>
        </div>

        {/* Right: Rover */}
        <div className="relative flex items-center justify-center">
          {/* Soft green glow background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 rounded-full bg-gray-100 opacity-60" />
          </div>

          <div className="relative w-full aspect-square max-w-md">
            <Image
              src="/minex-rover.png"
              alt="MineX Rover"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* Floating badges */}
          <div className="absolute top-8 right-4 bg-white rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-gray-900 border border-gray-100">
            🔋 Battery 78%
          </div>
          <div className="absolute bottom-12 left-4 bg-gray-50 border border-gray-100 rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-red-600">
            👤 Human Detected 94%
          </div>
          <div className="absolute top-1/2 right-2 bg-gray-50 border border-gray-100 rounded-xl shadow-md px-3 py-2 text-sm font-semibold text-orange-600">
            ✅ System Online
          </div>
        </div>
      </div>
    </section>
  );
}
