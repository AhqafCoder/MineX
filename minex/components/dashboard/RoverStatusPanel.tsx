"use client";

import Image from "next/image";
import { Battery, Wifi, Gauge, Navigation, Map, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function RoverStatusPanel({ state }: Props) {
  const isEmergency = state.roverState === "emergency";

  return (
    <div className={cn(
      "bg-white rounded-3xl border shadow-sm overflow-hidden",
      isEmergency ? "border-gray-100" : "border-gray-100"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-5 py-4 border-b",
        isEmergency ? "bg-gray-50 border-gray-100" : "border-gray-100 bg-white"
      )}>
        <h3 className="font-bold text-gray-900">Rover Status</h3>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isEmergency ? "bg-red-500 animate-pulse" : "bg-orange-600"
          )} />
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            isEmergency ? "text-red-600" : "text-orange-600"
          )}>
            {isEmergency ? "E-Stop" : "Online"}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Rover image */}
        <div className="relative h-32 mb-4 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 blur-2xl" />
          </div>
          <Image
            src="/minex-rover.png"
            alt="MINEX-01 Rover"
            fill
            className="object-contain p-2 relative z-10"
          />
          {isEmergency && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 rounded-2xl z-20">
              <div className="bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-xs font-bold text-red-600">STOPPED</span>
              </div>
            </div>
          )}
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: Battery, label: "Battery", value: `${state.battery.toFixed(0)}%`, color: state.battery > 50 ? "text-orange-600" : "text-orange-500", bg: "bg-gray-50" },
            { icon: Wifi, label: "Signal", value: `${state.signal.toFixed(0)}%`, color: "text-orange-600", bg: "bg-gray-50" },
            { icon: Gauge, label: "Speed", value: `${state.speed.toFixed(1)} m/s`, color: "text-gray-900", bg: "bg-gray-50" },
            { icon: Map, label: "Distance", value: `${state.distance.toFixed(0)} m`, color: "text-gray-900", bg: "bg-gray-50" },
          ].map((metric) => (
            <div key={metric.label} className={cn("p-3 rounded-xl border border-gray-100", metric.bg)}>
              <div className="flex items-center gap-1.5 mb-1 text-gray-500">
                <metric.icon className="w-3 h-3" />
                <span className="text-xs font-medium">{metric.label}</span>
              </div>
              <div className={cn("text-lg font-bold", metric.color)}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
