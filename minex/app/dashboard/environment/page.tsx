"use client";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";

const offlineState: DashboardState = {
  heading: 0, direction: "--", mode: "manual", connection: "offline", roverState: "standby",
  temperature: 0, humidity: 0, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
  sessionActive: false, sessionStartTime: null, sessionElapsed: 0,
};

export default function EnvironmentPage() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar collapsed={false} onToggle={() => {}} activeView="environment" onNavigate={() => {}} roverState="standby" />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={offlineState} onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Environmental Monitor</h1>
                <p className="text-xs text-gray-500 mt-1">DHT11 · MQ-135 · Real-time sensors</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-400 font-bold">SENSORS OFFLINE</span>
              </div>
            </div>

            {/* Current readings - all showing offline */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Thermometer, label: "Temperature", value: "--", unit: "°C", threshold: "Safe < 35°C" },
                { icon: Droplets, label: "Humidity", value: "--", unit: "%", threshold: "Safe < 75%" },
                { icon: Wind, label: "MQ-135 Gas", value: "--", unit: "ppm", threshold: "Safe < 150" },
                { icon: Gauge, label: "Air Quality", value: "--", unit: "", threshold: "Connect for data" },
              ].map((reading) => (
                <div key={reading.label} className="bg-white p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-3">
                    <reading.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{reading.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-300 mb-1">
                    {reading.value}<span className="text-sm">{reading.unit}</span>
                  </div>
                  <div className="text-xs text-gray-400">{reading.threshold}</div>
                </div>
              ))}
            </div>

            {/* Empty charts placeholder */}
            <div className="grid md:grid-cols-2 gap-4">
              {["Temperature — °C", "Gas Level — ppm", "Humidity — %", "Safety Status"].map((title) => (
                <div key={title} className="bg-white border border-gray-100 p-4 rounded-2xl">
                  <div className="text-xs text-gray-500 tracking-wider mb-4 uppercase">{title}</div>
                  <div className="h-[120px] flex items-center justify-center">
                    <span className="text-xs text-gray-300">Connect rover for live data</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DashboardBottomBar state={offlineState} />
      </div>
    </div>
  );
}
