"use client";

import { Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";
import { useState } from "react";

interface Props {
  state: DashboardState;
  onEmergencyStop: () => void;
  onModeChange: (mode: "manual" | "assisted" | "autonomous") => void;
}

export default function RoverControlPanel({ state }: Props) {
  const [lightOn, setLightOn] = useState(false);
  const isEmergency = state.roverState === "emergency";
  const disabled = isEmergency || (state.isLive && state.connection !== "connected");

  const sendDrive = (x: number, y: number) => {
    if (!state.isLive) return;
    fetch(`/api/rover/drive?ip=${encodeURIComponent(state.roverIp)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ x, y })
    }).catch(() => {});
  };

  const toggleLight = async () => {
    if (!state.isLive) { setLightOn(!lightOn); return; }
    try {
      const res = await fetch(`/api/rover/light?ip=${encodeURIComponent(state.roverIp)}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setLightOn(data.state);
      }
    } catch (e) {}
  };

  const setPan = (val: number) => {
    if (!state.isLive) return;
    fetch(`/api/rover/servo?ip=${encodeURIComponent(state.roverIp)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: val })
    }).catch(() => {});
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Rover Control</h3>
            <p className="text-[10px] text-gray-500">Manual Navigation</p>
          </div>
        </div>
        {disabled && (
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
            {state.connection !== "connected" ? "OFFLINE" : "E-STOP"}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* D-Pad */}
        <div className="relative w-28 h-28 mx-auto mb-3">
          <div className="absolute inset-0 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(0, 1)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-9 bg-white border border-gray-100 rounded-t-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95">
            <ArrowUp className="w-3.5 h-3.5 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(0, -1)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-9 bg-white border border-gray-100 rounded-b-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95">
            <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(-1, 0)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-7 bg-white border border-gray-100 rounded-l-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-3.5 h-3.5 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(1, 0)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-7 bg-white border border-gray-100 rounded-r-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95">
            <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 border border-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Camera Pan & Light */}
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-gray-500 font-medium">CAM PAN</span>
              <span className="text-gray-400">RESET</span>
            </div>
            <input 
              type="range" min="-1" max="1" step="0.05" defaultValue="0" 
              onChange={(e) => setPan(parseFloat(e.target.value))} 
              onMouseUp={(e) => { e.currentTarget.value = "0"; setPan(0); }}
              onTouchEnd={(e) => { e.currentTarget.value = "0"; setPan(0); }}
              disabled={disabled} 
              className="w-full accent-orange-500 disabled:opacity-40 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
          <button onClick={toggleLight} disabled={disabled} className={cn("p-2.5 border rounded-xl disabled:opacity-40 transition-colors shadow-sm", lightOn ? "bg-yellow-100 border-yellow-200 text-yellow-600" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100")}>
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
