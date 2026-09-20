"use client";

import { Shield, Thermometer, Droplets, Wind, Navigation, RefreshCw } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function SafetyIntelPanel({ state }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const isOffline = state.connection === "offline";

  const handleRefresh = async () => {
    setRefreshing(true);
    // Since page.tsx automatically polls every second, we just show a spin animation
    // to give feedback, the polling loop handles actual data syncing
    setTimeout(() => setRefreshing(false), 800);
  };

  const envStatus = {
    temp: isOffline ? "offline" : state.temperature < 35 ? "normal" : state.temperature < 45 ? "warning" : "critical",
    humidity: isOffline ? "offline" : state.humidity < 75 ? "normal" : state.humidity < 85 ? "warning" : "critical",
    gas: isOffline ? "offline" : state.gasLevel,
  };

  const gasText = isOffline ? "--" : (typeof state.gas === "string" && state.gas && state.gas !== "OFFLINE") ? state.gas : "--";

  const statusColor: Record<string, string> = { normal: "bg-green-500", warning: "bg-yellow-500", critical: "bg-red-500", offline: "bg-gray-300" };
  const textColor: Record<string, string> = { normal: "text-green-600", warning: "text-yellow-600", critical: "text-red-600", offline: "text-gray-400" };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Safety Intel</h3>
            <p className="text-[10px] text-gray-500">{isOffline ? "Waiting for connection" : "Live sensor readings"}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className={cn("p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors", refreshing && "animate-spin text-gray-900")}
          title="Refresh Sensor Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto">
        {/* Environment (DHT11) */}
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Environment (DHT11)</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Thermometer className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400">Temp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  {isOffline ? "--" : state.temperature.toFixed(1)}<span className="text-xs text-gray-400">°C</span>
                </span>
                <div className={cn("w-1.5 h-1.5 rounded-full ml-auto", statusColor[envStatus.temp])} />
              </div>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-400">Humidity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-gray-900">
                  {isOffline ? "--" : state.humidity.toFixed(1)}<span className="text-xs text-gray-400">%</span>
                </span>
                <div className={cn("w-1.5 h-1.5 rounded-full ml-auto", statusColor[envStatus.humidity])} />
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality (MQ-135) */}
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Air Quality (MQ-135)</div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-400" />
              <div>
                <div className={cn("text-sm font-bold", textColor[envStatus.gas])}>{gasText}</div>
              </div>
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
              isOffline ? "bg-gray-100 text-gray-400" :
              state.gasLevel === "normal" ? "bg-green-50 text-green-600" :
              state.gasLevel === "warning" ? "bg-yellow-50 text-yellow-600" :
              "bg-red-50 text-red-600"
            )}>
              {isOffline ? "OFFLINE" : state.gasLevel === "normal" ? "SAFE" : state.gasLevel === "warning" ? "WARNING" : "DANGER"}
            </span>
          </div>
        </div>

        {/* Motion (MPU-6050 + QMC5310) */}
        <div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Motion (MPU-6050 + QMC5310)</div>
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div>
                <div className="text-[10px] text-gray-400 font-medium">Accelerometer (g)</div>
                <div className="text-xs font-bold text-gray-900 font-mono">
                  {isOffline ? "X: --  Y: --  Z: --" : `X: ${state.accelX.toFixed(2)}  Y: ${state.accelY.toFixed(2)}  Z: ${state.accelZ.toFixed(2)}`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-[10px] text-gray-400 font-medium">Heading</div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-900">{isOffline ? "--" : state.heading.toFixed(0)}°</span>
                    <span className="text-xs font-bold text-orange-600">{isOffline ? "--" : state.direction}</span>
                  </div>
                </div>
                <div className="ml-auto w-6 h-6 rounded-full border border-gray-200 bg-white flex items-center justify-center relative">
                  <div
                    className="w-4 h-4 rounded-full border border-orange-400 relative transition-transform duration-300"
                    style={{ transform: `rotate(${isOffline ? 0 : state.heading}deg)` }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-orange-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
