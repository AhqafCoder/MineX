"use client";

import { Shield, Thermometer, Droplets, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function SafetyIntelPanel({ state }: Props) {
  const envStatus = {
    temp: state.temperature < 35 ? "normal" : state.temperature < 45 ? "warning" : "critical",
    humidity: state.humidity < 75 ? "normal" : state.humidity < 85 ? "warning" : "critical",
    gas: state.gasLevel,
  };

  const gasText = typeof state.gas === "string" && state.gas ? state.gas : "OFFLINE";

  const statusColor = { normal: "bg-orange-600", warning: "bg-yellow-500", critical: "bg-red-500" };
  const textColor = { normal: "text-orange-600", warning: "text-yellow-600", critical: "text-red-600" };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Safety Intel</h3>
            <p className="text-xs text-gray-500">Live hazard monitoring</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Human Detection */}
        <div className={cn(
          "p-4 rounded-2xl border transition-colors",
          state.humanDetected ? "bg-gray-50 border-gray-100" : "bg-gray-50 border-gray-100"
        )}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">Human Detection</span>
            <span className={cn(
              "text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
              state.humanDetected ? "bg-gray-100 text-red-600" : "bg-gray-200 text-gray-500"
            )}>
              {state.humanDetected ? "Detected" : "Clear"}
            </span>
          </div>
          {state.humanDetected && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Confidence</span>
                <span className="font-bold text-red-600">{state.humanConfidence.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${state.humanConfidence}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-500">Location</span>
                <span className="font-semibold text-gray-900">Tunnel B-04 (8.4m)</span>
              </div>
            </div>
          )}
        </div>

        {/* Environment */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Environment</div>
          
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Temperature</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{state.temperature.toFixed(0)}°C</span>
              <div className={cn("w-2 h-2 rounded-full", statusColor[envStatus.temp as keyof typeof statusColor])} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Humidity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{state.humidity.toFixed(0)}%</span>
              <div className={cn("w-2 h-2 rounded-full", statusColor[envStatus.humidity as keyof typeof statusColor])} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">Gas Level</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold uppercase", textColor[state.gasLevel])}>{gasText}</span>
              <div className={cn("w-2 h-2 rounded-full", statusColor[state.gasLevel])} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
