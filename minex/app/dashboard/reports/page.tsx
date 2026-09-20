"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { FileText } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";

const offlineState: DashboardState = {
  heading: 0, direction: "--", mode: "manual", connection: "offline", roverState: "standby",
  temperature: 0, humidity: 0, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
  sessionActive: false, sessionStartTime: null, sessionElapsed: 0,
};

export default function ReportsPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="reports" onNavigate={() => {}} roverState="standby" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={offlineState} onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-center h-[60vh]">
            <div className="text-center bg-white p-12 rounded-3xl border shadow-sm max-w-md">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Session Reports</h3>
              <p className="text-gray-500 text-sm">
                Start a session from the main dashboard to begin recording telemetry data. 
                Reports will be generated from your recorded sessions with timestamped sensor readings, 
                environmental data, and route information.
              </p>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={offlineState} />
      </div>
    </div>
  );
}
