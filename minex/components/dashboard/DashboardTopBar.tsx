"use client";

import { Bell, Settings, User, Wifi, WifiOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
  missionElapsed: string;
  onSimulateOffline: () => void;
  onToggleLive?: () => void;
  onIpChange?: (ip: string) => void;
}

export default function DashboardTopBar({ state, missionElapsed, onSimulateOffline, onToggleLive, onIpChange }: Props) {
  const connectionConfig = {
    connected: { color: "text-orange-600", bg: "bg-gray-100", label: "Connected", icon: Wifi },
    reconnecting: { color: "text-yellow-600", bg: "bg-gray-100", label: "Reconnecting", icon: Loader2 },
    offline: { color: "text-red-600", bg: "bg-gray-100", label: "Offline", icon: WifiOff },
  };

  const conn = connectionConfig[state.connection];

  return (
    <div className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100 flex-shrink-0">
      
      {/* Left: Info */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Rover</span>
          <span className="text-sm font-bold text-gray-900">MINEX-01</span>
        </div>
        <div className="w-px h-8 bg-gray-100 hidden md:block" />
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Mission</span>
          <span className="text-sm font-bold text-gray-900">Tunnel Inspection</span>
        </div>
      </div>

      {/* Center: Timer */}
      <div className="text-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Elapsed Time</div>
        <div className="text-sm font-bold text-gray-900">{missionElapsed}</div>
      </div>

      {/* Right: Controls & Status */}
      <div className="flex items-center gap-4">
        {onToggleLive && (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={state.roverIp}
              onChange={(e) => onIpChange?.(e.target.value)}
              className="px-2 py-1 border border-gray-200 rounded text-xs w-36"
              placeholder="http://192.168.4.1:8080"
            />
            <button onClick={onToggleLive} className={cn("px-3 py-1 text-xs font-bold rounded-full border transition-all", state.isLive ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200")}>
              {state.isLive ? "LIVE" : "SIM"}
            </button>
          </div>
        )}

        <button
          onClick={onSimulateOffline}
          className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-80", conn.bg, conn.color)}
        >
          <conn.icon className={cn("w-3.5 h-3.5", state.connection === "reconnecting" && "animate-spin")} />
          {conn.label}
        </button>

        <div className="w-px h-8 bg-gray-100" />
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
