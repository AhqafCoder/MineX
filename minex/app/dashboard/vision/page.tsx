"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import RoverVisionPanel from "@/components/dashboard/RoverVisionPanel";
import type { DashboardState } from "@/app/dashboard/page";

const mockState: DashboardState = {
  battery: 78, signal: 96, speed: 1.2, distance: 428, heading: 142,
  direction: "N", motorTemp: 42, mode: "autonomous", connection: "connected", roverState: "active",
  missionElapsed: 6138, humanDetected: true, humanConfidence: 94,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

export default function VisionPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="vision" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Vision — YOLOv8 Nano</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">ESP32-CAM · Real-time inference · Edge processing</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <RoverVisionPanel state={mockState} />
              </div>

              {/* Detection stats */}
              <div className="space-y-4">
                {/* Human detection */}
                <div className="bg-white border border-gray-100 border border-[#ff3333]/30 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-mono text-xs text-[#ff3333] font-bold tracking-widest">HUMAN DETECTION</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff3333] animate-pulse" />
                      <span className="text-mono text-xs text-[#ff3333] font-bold">DETECTED</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Confidence</div>
                      <div className="text-2xl font-bold text-[#ff3333]">{mockState.humanConfidence}%</div>
                    </div>
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Distance</div>
                      <div className="text-2xl font-bold text-gray-900">8.4m</div>
                    </div>
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Class ID</div>
                      <div className="text-mono text-sm font-bold text-[#ff3333]">Class 0</div>
                    </div>
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Zone</div>
                      <div className="text-mono text-sm text-gray-900">Tunnel B-04</div>
                    </div>
                  </div>
                  <div className="h-1 bg-white mt-3">
                    <div className="h-full bg-[#ff3333]" style={{ width: `${mockState.humanConfidence}%` }} />
                  </div>
                </div>

                {/* Cell phone */}
                <div className="bg-white border border-gray-100 border border-[#ffaa00]/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-mono text-xs text-[#ffaa00] font-bold tracking-widest">CELL PHONE (SECONDARY)</span>
                    <span className="text-mono text-xs text-[#ffaa00]">DETECTED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Confidence</div>
                      <div className="text-xl font-bold text-[#ffaa00]">67%</div>
                    </div>
                    <div>
                      <div className="text-mono text-xs text-[#4a5568]">Class ID</div>
                      <div className="text-mono text-sm font-bold text-[#ffaa00]">Class 67</div>
                    </div>
                  </div>
                </div>

                {/* Pipeline */}
                <div className="bg-white border border-gray-100 border border-[#1e2030] p-4">
                  <div className="text-mono text-xs text-[#4a5568] tracking-widest mb-3">INFERENCE PIPELINE</div>
                  <div className="space-y-1">
                    {[
                      { label: "Input", value: "ESP32-CAM" },
                      { label: "Model", value: "YOLOv8 Nano" },
                      { label: "Resolution", value: "1280×960" },
                      { label: "Framerate", value: "15 fps" },
                      { label: "Inference", value: "On-device (RPi)" },
                      { label: "Latency", value: "<100ms" },
                      { label: "Detections", value: "2 objects" },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-mono text-xs text-[#4a5568]">{item.label}</span>
                        <span className="text-mono text-xs text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
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
