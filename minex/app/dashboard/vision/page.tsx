"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import RoverVisionPanel from "@/components/dashboard/RoverVisionPanel";
import type { DashboardState } from "@/app/dashboard/page";

const mockState: DashboardState = {
  heading: 142,
  direction: "N", mode: "autonomous", connection: "offline", roverState: "standby",
  missionElapsed: 0,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
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
                {/* AI Detection Notice */}
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-mono text-xs text-gray-500 font-bold tracking-widest">AI DETECTION</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                      <span className="text-mono text-xs text-gray-400 font-bold">NOT ACTIVE</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    YOLOv8 inference is not currently running. Connect the AI pipeline to enable real-time object detection on the camera feed.
                  </p>
                </div>

                {/* Pipeline */}
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                  <div className="text-mono text-xs text-gray-500 tracking-widest mb-3">CAMERA PIPELINE</div>
                  <div className="space-y-1">
                    {[
                      { label: "Input", value: "ESP32-CAM" },
                      { label: "Resolution", value: "1280×960" },
                      { label: "Framerate", value: "~15 fps" },
                      { label: "Backend", value: "master_rover.py" },
                      { label: "Protocol", value: "MJPEG over HTTP" },
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
