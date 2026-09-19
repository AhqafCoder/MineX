"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";

import { CheckCircle, Circle, Target } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";


const mockState: DashboardState = {
  heading: 142,
  direction: "N", mode: "autonomous", connection: "offline", roverState: "standby",
  missionElapsed: 0,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};



export default function MissionPage() {


  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="mission" onNavigate={() => {}} roverState="active" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-center h-[60vh]">
            <div className="text-center bg-white p-12 rounded-3xl border shadow-sm max-w-md">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Missions Not Supported</h3>
              <p className="text-gray-500 text-sm">
                The current hardware configuration (master_rover.py) operates in direct manual control mode and does not support autonomous waypoint missions.
              </p>
            </div>
          </div>
        </div>
        <DashboardBottomBar state={mockState} />
      </div>
    </div>
  );
}
