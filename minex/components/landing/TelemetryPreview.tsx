"use client";

import { Battery, Signal, Gauge, Thermometer, MapPin, Navigation, Wind, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { telemetryHistory } from "@/lib/mock-data";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const metrics: { icon: LucideIcon; label: string; value: string; color: string }[] = [
  { icon: Battery, label: "Battery", value: "78%", color: "text-orange-600" },
  { icon: Signal, label: "Mesh Signal", value: "96%", color: "text-orange-600" },
  { icon: Thermometer, label: "Temperature", value: "31°C", color: "text-orange-600" },
  { icon: Flame, label: "Thermal", value: "Active", color: "text-red-600" },
  { icon: Wind, label: "CH₄ Level", value: "0.3%", color: "text-green-600" },
  { icon: Navigation, label: "Heading", value: "142°", color: "text-gray-500" },
];

export default function TelemetryPreview() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" scale blur>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              Demo Preview
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Everything the Rover Knows. <span className="text-orange-600">In Real Time.</span>
            </h2>
            <p className="text-gray-500">Sample telemetry data — connect to the rover via Wi-Fi HaLow mesh for live streaming</p>
          </div>
        </ScrollReveal>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {metrics.map((m, i) => (
            <ScrollReveal key={m.label} direction="up" delay={i * 0.06}>
              <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-100 mx-auto mb-2">
                  <m.icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Charts */}
        <ScrollReveal direction="up" delay={0.3}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-sm">Speed (m/s)</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  DEMO
                </span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={telemetryHistory.speed}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[0, 2.5]} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900 text-sm">Battery (%)</span>
                <span className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  DEMO
                </span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={telemetryHistory.battery}>
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{ background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: 12 }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
