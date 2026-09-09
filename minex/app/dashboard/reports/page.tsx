"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { missionData, missionReports } from "@/lib/mock-data";
import { Download, Target, Clock, MapPin, CheckCircle, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardState } from "@/app/dashboard/page";

const mockState: DashboardState = {
  battery: 78, signal: 96, speed: 1.2, distance: 428, heading: 142,
  direction: "N", motorTemp: 42, mode: "autonomous", connection: "connected", roverState: "active",
  missionElapsed: 6138, humanDetected: true, humanConfidence: 94,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

const reportData = [
  { name: "Speed", value: 1.2 },
  { name: "Battery", value: 78 },
  { name: "Signal", value: 96 },
  { name: "Temp", value: 31 },
];

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="reports" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Mission Reports</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">Analytics & performance data</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/40 text-[#00d4ff] text-sm font-bold tracking-widest uppercase hover:bg-[#00d4ff]/5 transition-colors">
                <Download className="w-4 h-4" />
                EXPORT REPORT
              </button>
            </div>

            {/* Current mission summary */}
            <div className="bg-white border border-gray-100 border border-[#1e2030] p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-mono text-xs text-[#00d4ff] tracking-widest mb-1">ACTIVE MISSION</div>
                  <h2 className="text-lg font-bold">{missionData.name}</h2>
                  <div className="text-mono text-xs text-[#4a5568]">{missionData.id}</div>
                </div>
                <div className="px-3 py-1 border border-[#00d4ff]/40 bg-[#00d4ff]/5">
                  <span className="text-mono text-xs text-[#00d4ff] font-bold">ACTIVE</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white">
                {[
                  { icon: MapPin, label: "Distance Covered", value: "428 m" },
                  { icon: Clock, label: "Mission Duration", value: "01:42:18" },
                  { icon: Target, label: "Human Detections", value: "3" },
                  { icon: Activity, label: "Hazards Detected", value: "2" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-gray-50 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <stat.icon className="w-3.5 h-3.5 text-[#4a5568]" />
                      <span className="text-mono text-xs text-[#4a5568]">{stat.label}</span>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Telemetry chart */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="text-mono text-xs text-[#4a5568] mb-4 tracking-widest">CURRENT TELEMETRY SUMMARY</div>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={reportData}>
                    <XAxis dataKey="name" tick={{ fill: "#4a5568", fontSize: 10, fontFamily: "monospace" }} />
                    <YAxis tick={{ fill: "#4a5568", fontSize: 10, fontFamily: "monospace" }} />
                    <Tooltip
                      contentStyle={{ background: "#0d0d17", border: "1px solid #1e2030", borderRadius: 0 }}
                      labelStyle={{ color: "#8892a4", fontFamily: "monospace", fontSize: 10 }}
                      itemStyle={{ color: "#00d4ff", fontFamily: "monospace", fontSize: 10 }}
                    />
                    <Bar dataKey="value" fill="#00d4ff" opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mission progress */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="text-mono text-xs text-[#4a5568] mb-4 tracking-widest">MISSION PROGRESS</div>
                <div className="space-y-3">
                  {[
                    { label: "Distance", current: 428, total: 620, color: "#00d4ff" },
                    { label: "Waypoints", current: 8, total: 12, color: "#00ff88" },
                    { label: "Battery", current: 78, total: 100, color: "#ffaa00" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-mono text-xs text-[#4a5568]">{item.label}</span>
                        <span className="text-mono text-xs text-gray-900">{item.current} / {item.total}</span>
                      </div>
                      <div className="h-1 bg-white">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${(item.current / item.total) * 100}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Historical reports */}
            <div className="bg-white border border-gray-100 border border-[#1e2030]">
              <div className="px-4 py-3 border-b border-[#1e2030]">
                <span className="text-mono text-xs text-[#4a5568] tracking-widest">HISTORICAL MISSIONS</span>
              </div>
              <div className="divide-y divide-[#1e2030]">
                {missionReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{report.name}</div>
                      <div className="text-mono text-xs text-[#4a5568] mt-0.5">{report.id} · {report.date}</div>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-mono text-xs text-[#4a5568]">Duration</div>
                        <div className="text-mono text-xs text-gray-900">{report.duration}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-mono text-xs text-[#4a5568]">Distance</div>
                        <div className="text-mono text-xs text-gray-900">{report.distance}m</div>
                      </div>
                      <div className="text-center">
                        <div className="text-mono text-xs text-[#4a5568]">Humans</div>
                        <div className="text-mono text-xs text-[#ff3333]">{report.humanDetections}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-mono text-xs text-[#4a5568]">Hazards</div>
                        <div className="text-mono text-xs text-[#ffaa00]">{report.hazards}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#00ff88]" />
                      <span className="text-mono text-xs text-[#00ff88]">COMPLETED</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={mockState} />
      </div>
    </div>
  );
}
