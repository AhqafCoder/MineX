"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";

import type { DashboardState } from "@/app/dashboard/page";
import { useState, useEffect } from "react";

const initialState: DashboardState = {
  heading: 142,
  direction: "N", mode: "autonomous", connection: "offline", roverState: "standby",
  missionElapsed: 0,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

export default function MapPage() {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        heading: (prev.heading + (Math.random() - 0.5) * 0.5 + 360) % 360,
        missionElapsed: prev.missionElapsed + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="map" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={state} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Map & LiDAR</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">Live spatial map · Point cloud visualization</p>
              </div>
            </div>
            <div className="h-[520px] flex items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl border-dashed">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-400">📡</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">LiDAR Not Connected</h3>
                <p className="text-sm text-gray-500 mt-1">master_rover.py does not provide SLAM telemetry.</p>
              </div>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
