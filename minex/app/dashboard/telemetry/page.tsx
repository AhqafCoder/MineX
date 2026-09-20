"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import TelemetryCharts from "@/components/dashboard/TelemetryCharts";
import type { DashboardState } from "@/app/dashboard/page";

const offlineState: DashboardState = {
  heading: 0, direction: "--", mode: "manual", connection: "offline", roverState: "standby",
  temperature: 0, humidity: 0, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
  sessionActive: false, sessionStartTime: null, sessionElapsed: 0,
};

export default function TelemetryPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="telemetry" onNavigate={() => {}} roverState="standby" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={offlineState} onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Live Telemetry</h1>
                <p className="text-xs text-gray-500 mt-1">TCP streaming · Real-time data from MINEX-01</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-400 font-bold">OFFLINE</span>
              </div>
            </div>

            {/* Quick metrics - showing offline state */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: "Temp", value: "--", color: "text-gray-300" },
                { label: "Humidity", value: "--", color: "text-gray-300" },
                { label: "Gas Level", value: "--", color: "text-gray-300" },
                { label: "Pitch", value: "--", color: "text-gray-300" },
                { label: "Roll", value: "--", color: "text-gray-300" },
                { label: "Heading", value: "--", color: "text-gray-300" },
              ].map((m) => (
                <div key={m.label} className="bg-white p-4 rounded-xl border border-gray-100">
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{m.label}</div>
                  <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                </div>
              ))}
            </div>

            <TelemetryCharts state={offlineState} />
          </div>
        </div>
        <DashboardBottomBar state={offlineState} />
      </div>
    </div>
  );
}
