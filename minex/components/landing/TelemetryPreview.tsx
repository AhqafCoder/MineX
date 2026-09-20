"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { telemetryHistory } from "@/lib/mock-data";

export default function TelemetryPreview() {
  const [values, setValues] = useState({ battery: 78, signal: 96, speed: 1.2, temp: 31 });

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((p) => ({
        battery: Math.max(70, Math.min(85, p.battery + (Math.random() - 0.5) * 0.5)),
        signal: Math.max(85, Math.min(99, p.signal + (Math.random() - 0.5) * 1)),
        speed: Math.max(0.5, Math.min(2, p.speed + (Math.random() - 0.5) * 0.2)),
        temp: Math.max(28, Math.min(36, p.temp + (Math.random() - 0.5) * 0.3)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { emoji: "🔋", label: "Battery", value: `${values.battery.toFixed(0)}%`, color: "text-orange-600", bg: "bg-gray-50" },
    { emoji: "📶", label: "Signal", value: `${values.signal.toFixed(0)}%`, color: "text-orange-600", bg: "bg-gray-50" },
    { emoji: "🚗", label: "Speed", value: `${values.speed.toFixed(1)} m/s`, color: "text-purple-600", bg: "bg-gray-50" },
    { emoji: "🌡️", label: "Temperature", value: `${values.temp.toFixed(0)}°C`, color: "text-orange-600", bg: "bg-gray-50" },
    { emoji: "📍", label: "Distance", value: "428 m", color: "text-gray-500", bg: "bg-gray-50" },
    { emoji: "🧭", label: "Heading", value: "142°", color: "text-gray-500", bg: "bg-gray-50" },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
            Live Data
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Everything the Rover Knows. <span className="text-orange-600">In Real Time.</span>
          </h2>
          <p className="text-gray-500">Live telemetry streaming via TCP socket</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {metrics.map((m) => (
            <div key={m.label} className={`rounded-2xl ${m.bg} p-4 text-center border border-gray-100`}>
              <div className="text-2xl mb-1">{m.emoji}</div>
              <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
              <div className="text-xs text-gray-500 mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900 text-sm">Speed (m/s)</span>
              <span className="flex items-center gap-1 text-xs text-orange-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                LIVE
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
              <span className="flex items-center gap-1 text-xs text-orange-600">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                HEALTHY
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
      </div>
    </section>
  );
}
