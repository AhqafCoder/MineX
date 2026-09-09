"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { missionData } from "@/lib/mock-data";
import { CheckCircle, Circle, Target } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";
import { waypoints } from "@/lib/mock-data";

const mockState: DashboardState = {
  battery: 78, signal: 96, speed: 1.2, distance: 428, heading: 142,
  direction: "N", motorTemp: 42, mode: "autonomous", connection: "connected", roverState: "active",
  missionElapsed: 6138, humanDetected: true, humanConfidence: 94,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

const timelineEvents = [
  { time: "14:22:00", event: "Mission started", type: "info" },
  { time: "14:35:12", event: "WP-01 reached", type: "waypoint" },
  { time: "14:48:44", event: "WP-02 reached", type: "waypoint" },
  { time: "14:55:20", event: "Human detected — Tunnel B-04 (94%)", type: "alert" },
  { time: "15:02:18", event: "WP-03 through WP-08 completed", type: "waypoint" },
  { time: "15:04:05", event: "Battery at 78% — monitoring", type: "warning" },
  { time: "15:04:05", event: "Mission 68% complete — proceeding", type: "info" },
];

export default function MissionPage() {
  const progress = (missionData.coveredDistance / missionData.totalDistance) * 100;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="mission" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
            {/* Main mission card */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-mono text-xs text-[#00d4ff] tracking-widest mb-1">ACTIVE MISSION</div>
                    <h1 className="text-2xl font-bold">{missionData.name}</h1>
                    <div className="text-mono text-xs text-[#4a5568] mt-1">{missionData.id} · ROVER: MINEX-01</div>
                  </div>
                  <div className="text-right">
                    <div className="text-mono text-xs text-[#4a5568]">Status</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
                      <span className="text-mono text-xs font-bold text-[#00d4ff]">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-mono text-xs text-[#4a5568]">MISSION PROGRESS</span>
                    <span className="text-mono text-sm font-bold text-[#00d4ff]">{progress.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-white relative">
                    <div
                      className="h-full bg-gradient-to-r from-[#00d4ff] to-[#0080ff] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Rover position marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#00d4ff] rounded-full"
                      style={{ left: `${progress}%`, transform: "translate(-50%, -50%)" }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-mono text-xs text-[#4a5568]">
                    <span>Start</span>
                    <span>{missionData.coveredDistance}m / {missionData.totalDistance}m</span>
                    <span>End</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Elapsed", value: "01:42:18" },
                    { label: "Remaining", value: `${missionData.estimatedRemaining} min` },
                    { label: "Est. Complete", value: missionData.estimatedEnd },
                    { label: "Distance", value: `${missionData.coveredDistance} m` },
                    { label: "Waypoints", value: `${missionData.completedWaypoints} / ${missionData.totalWaypoints}` },
                    { label: "Start Time", value: missionData.startTime },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-mono text-xs text-[#4a5568]">{s.label}</div>
                      <div className="text-mono text-sm font-bold text-gray-900 mt-0.5">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="text-mono text-xs text-[#4a5568] tracking-widest mb-4">MISSION TIMELINE</div>
                <div className="space-y-3 relative">
                  <div className="absolute left-16 top-0 bottom-0 w-px bg-white" />
                  {timelineEvents.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <span className="text-mono text-xs text-[#4a5568] w-16 flex-shrink-0 mt-0.5">{event.time.slice(0, 5)}</span>
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0 mt-1 z-10"
                        style={{
                          backgroundColor: event.type === "alert" ? "#ff3333" : event.type === "warning" ? "#ffaa00" : event.type === "waypoint" ? "#00ff88" : "#00d4ff",
                        }}
                      />
                      <span className={`text-sm ${event.type === "alert" ? "text-[#ff3333]" : "text-[#8892a4]"}`}>
                        {event.event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Waypoint list */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                <div className="text-mono text-xs text-[#4a5568] tracking-widest mb-4">WAYPOINTS</div>
                <div className="space-y-2">
                  {waypoints.map((wp) => (
                    <div key={wp.id} className="flex items-center gap-3">
                      {wp.status === "completed"
                        ? <CheckCircle className="w-3.5 h-3.5 text-[#00ff88] flex-shrink-0" />
                        : wp.status === "active"
                        ? <Target className="w-3.5 h-3.5 text-[#00d4ff] flex-shrink-0" />
                        : <Circle className="w-3.5 h-3.5 text-[#1e2030] flex-shrink-0" />
                      }
                      <span className={`text-mono text-xs ${
                        wp.status === "completed" ? "text-[#4a5568] line-through" :
                        wp.status === "active" ? "text-[#00d4ff] font-bold" :
                        "text-[#4a5568]"
                      }`}>
                        {wp.id}
                      </span>
                      {wp.status === "active" && (
                        <span className="text-mono text-xs text-[#00d4ff] ml-auto">CURRENT</span>
                      )}
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
