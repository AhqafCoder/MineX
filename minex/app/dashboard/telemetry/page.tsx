"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import TelemetryCharts from "@/components/dashboard/TelemetryCharts";
import type { DashboardState } from "@/app/dashboard/page";

const initialState: DashboardState = {
  battery: 78, signal: 96, speed: 1.2, distance: 428, heading: 142,
  direction: "N", motorTemp: 42, mode: "autonomous", connection: "connected", roverState: "active",
  missionElapsed: 6138, humanDetected: true, humanConfidence: 94,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

export default function TelemetryPage() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        battery: Math.max(70, prev.battery - 0.005),
        signal: Math.max(70, Math.min(99, prev.signal + (Math.random() - 0.5))),
        speed: Math.max(0.5, Math.min(2, prev.speed + (Math.random() - 0.5) * 0.2)),
        distance: prev.distance + prev.speed * 0.5,
        motorTemp: Math.max(35, Math.min(65, prev.motorTemp + (Math.random() - 0.5) * 0.3)),
        missionElapsed: prev.missionElapsed + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="telemetry" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={state} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Telemetry</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">TCP streaming · Real-time data from MINEX-01</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                <span className="text-mono text-xs text-[#00d4ff]">TCP STREAMING</span>
              </div>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white">
              {[
                { label: "BATTERY", value: `${state.battery.toFixed(0)}%`, color: "#00ff88" },
                { label: "SPEED", value: `${state.speed.toFixed(1)} m/s`, color: "#00d4ff" },
                { label: "DISTANCE", value: `${state.distance.toFixed(0)} m`, color: "#8892a4" },
                { label: "HEADING", value: `${state.heading.toFixed(0)}°`, color: "#8892a4" },
                { label: "SIGNAL", value: `${state.signal.toFixed(0)}%`, color: "#00d4ff" },
                { label: "MOTOR", value: `${state.motorTemp.toFixed(0)}°C`, color: "#ffaa00" },
              ].map((m) => (
                <div key={m.label} className="bg-gray-50 p-4">
                  <div className="text-mono text-xs text-[#4a5568] mb-2">{m.label}</div>
                  <div className="text-xl font-bold" style={{ color: m.color }}>{m.value}</div>
                </div>
              ))}
            </div>

            <TelemetryCharts state={state} />
          </div>
        </div>
        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
