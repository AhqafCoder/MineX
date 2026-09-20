"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { Thermometer, Droplets, Wind, Gauge, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import type { DashboardState } from "@/app/dashboard/page";

const mockState: DashboardState = {
  heading: 142,
  direction: "N", mode: "autonomous", connection: "offline", roverState: "standby",
  missionElapsed: 0,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

interface EnvData {
  time: string;
  temp: number;
  humidity: number;
  gas: number;
}

function generateEnvHistory(): EnvData[] {
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (20 - i) * 30000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    temp: 30 + Math.random() * 3,
    humidity: 65 + Math.random() * 5,
    gas: 135 + Math.random() * 20,
  }));
}

export default function EnvironmentPage() {
  const [history, setHistory] = useState<EnvData[]>(generateEnvHistory());
  const [env, setEnv] = useState({ temp: 31, humidity: 68, gas: 142 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const newEntry: EnvData = {
        time: now,
        temp: Math.max(28, Math.min(45, env.temp + (Math.random() - 0.5) * 0.5)),
        humidity: Math.max(55, Math.min(80, env.humidity + (Math.random() - 0.5))),
        gas: Math.max(120, Math.min(200, env.gas + (Math.random() - 0.5) * 3)),
      };
      setEnv({ temp: newEntry.temp, humidity: newEntry.humidity, gas: newEntry.gas });
      setHistory((prev) => [...prev.slice(-19), newEntry]);
    }, 2000);
    return () => clearInterval(interval);
  }, [env]);

  const tempStatus = env.temp < 35 ? "normal" : env.temp < 45 ? "warning" : "critical";
  const gasStatus = env.gas < 150 ? "normal" : env.gas < 180 ? "warning" : "critical";

  const statusColor = { normal: "#00ff88", warning: "#ffaa00", critical: "#ff3333" };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="environment" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Environmental Monitor</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">DHT11 · MQ-135 · Real-time sensors</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                <span className="text-mono text-xs text-[#00ff88]">ALL SENSORS ONLINE</span>
              </div>
            </div>

            {/* Current readings */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white">
              {[
                { icon: Thermometer, label: "TEMPERATURE", value: `${env.temp.toFixed(1)}°C`, status: tempStatus, threshold: "Safe < 35°C" },
                { icon: Droplets, label: "HUMIDITY", value: `${env.humidity.toFixed(0)}%`, status: "normal", threshold: "Safe < 75%" },
                { icon: Wind, label: "MQ-135 GAS", value: `${env.gas.toFixed(0)} ppm`, status: gasStatus, threshold: "Safe < 150" },
                { icon: Gauge, label: "AIR QUALITY", value: "SAFE", status: "normal", threshold: "All normal" },
              ].map((reading) => (
                <div key={reading.label} className="bg-gray-50 p-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <reading.icon className="w-4 h-4 text-[#4a5568]" />
                    <span className="text-mono text-xs text-[#4a5568] tracking-widest">{reading.label}</span>
                  </div>
                  <div className="text-2xl font-bold mb-1" style={{ color: statusColor[reading.status as keyof typeof statusColor] }}>
                    {reading.value}
                  </div>
                  <div className="text-mono text-xs text-[#4a5568]">{reading.threshold}</div>
                  {reading.status !== "normal" && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3 text-[#ffaa00]" />
                      <span className="text-mono text-xs text-[#ffaa00] capitalize">{reading.status}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Temperature chart */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-mono text-xs text-[#4a5568] tracking-widest">TEMPERATURE — °C</span>
                  <span className="text-mono text-xs text-[#ffaa00]">{env.temp.toFixed(1)}°C</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={history}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[25, 50]} />
                    <ReferenceLine y={35} stroke="#ffaa00" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <ReferenceLine y={45} stroke="#ff3333" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Line type="monotone" dataKey="temp" stroke="#ffaa00" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gas chart */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-mono text-xs text-[#4a5568] tracking-widest">GAS LEVEL — ppm</span>
                  <span className="text-mono text-xs" style={{ color: statusColor[gasStatus] }}>{env.gas.toFixed(0)} ppm</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={history}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[100, 220]} />
                    <ReferenceLine y={150} stroke="#ffaa00" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <ReferenceLine y={180} stroke="#ff3333" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Line type="monotone" dataKey="gas" stroke="#00ff88" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Humidity chart */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-mono text-xs text-[#4a5568] tracking-widest">HUMIDITY — %</span>
                  <span className="text-mono text-xs text-[#00d4ff]">{env.humidity.toFixed(0)}%</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={history}>
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[50, 90]} />
                    <ReferenceLine y={75} stroke="#ffaa00" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <Line type="monotone" dataKey="humidity" stroke="#00d4ff" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Status summary */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="text-mono text-xs text-[#4a5568] tracking-widest mb-4">SAFETY STATUS</div>
                <div className="space-y-3">
                  {[
                    { label: "Temperature", status: tempStatus, value: `${env.temp.toFixed(1)}°C` },
                    { label: "Humidity", status: "normal", value: `${env.humidity.toFixed(0)}%` },
                    { label: "Gas Level", status: gasStatus, value: `${env.gas.toFixed(0)} ppm` },
                    { label: "Overall Air Quality", status: "normal", value: "SAFE" },
                    { label: "DHT11 Sensor", status: "normal", value: "ONLINE" },
                    { label: "MQ-135 Sensor", status: "normal", value: "ONLINE" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <span className="text-mono text-xs text-[#4a5568]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-mono text-xs text-gray-900">{item.value}</span>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor[item.status as keyof typeof statusColor] }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={mockState} />
      </div>
    </div>
  );
}
