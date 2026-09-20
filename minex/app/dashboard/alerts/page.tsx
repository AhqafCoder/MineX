"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { AlertTriangle } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";

const offlineState: DashboardState = {
  heading: 0, direction: "--", mode: "manual", connection: "offline", roverState: "standby",
  temperature: 0, humidity: 0, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
  sessionActive: false, sessionStartTime: null, sessionElapsed: 0,
};

export default function AlertsPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="alerts" onNavigate={() => {}} roverState="standby" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={offlineState} onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alert Center</h1>
                <p className="text-xs text-gray-500 mt-1">Real-time alerts from rover sensors</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-300" />
              </div>
              <span className="text-sm font-medium text-gray-500">No alerts</span>
              <span className="text-xs text-gray-400 mt-1">
                Alerts will appear here when the rover detects hazardous conditions
              </span>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={offlineState} />
      </div>
    </div>
  );
}
