"use client";

import { Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, StopCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState, RoverMode } from "@/app/dashboard/page";
import { useState } from "react";

interface Props {
  state: DashboardState;
  onEmergencyStop: () => void;
  onModeChange: (mode: RoverMode) => void;
}

export default function RoverControlPanel({ state, onEmergencyStop, onModeChange }: Props) {
  const [lightOn, setLightOn] = useState(false);
  const isEmergency = state.roverState === "emergency";
  const disabled = state.mode === "autonomous" || isEmergency || (state.isLive && state.connection !== "connected");

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

  const modes: { id: RoverMode; label: string }[] = [
    { id: "manual", label: "Manual" },
    { id: "assisted", label: "Assisted" },
    { id: "autonomous", label: "Autonomous" },
  ];

  return (
    <div className={cn(
      "bg-white rounded-3xl border shadow-sm overflow-hidden h-full flex flex-col",
      isEmergency ? "border-gray-100" : "border-gray-100"
    )}>
      <div className={cn(
        "flex items-center justify-between px-5 py-4 border-b",
        isEmergency ? "bg-gray-50 border-gray-100" : "bg-white border-gray-100"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Rover Control</h3>
            <p className="text-xs text-gray-500">Operation & Navigation</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Mode selector */}
        <div className="flex bg-gray-50 rounded-xl p-1 mb-4 border border-gray-100">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              disabled={isEmergency}
              className={cn(
                "flex-1 text-xs font-semibold py-2 rounded-lg transition-all",
                state.mode === m.id
                  ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* D-Pad */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="absolute inset-0 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(0, 1)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-10 bg-white border border-gray-100 rounded-t-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow-sm transition-all active:scale-95">
            <ArrowUp className="w-4 h-4 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(0, -1)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-10 bg-white border border-gray-100 rounded-b-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow-sm transition-all active:scale-95">
            <ArrowDown className="w-4 h-4 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(-1, 0)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-10 h-8 bg-white border border-gray-100 rounded-l-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow-sm transition-all active:scale-95">
            <ArrowLeft className="w-4 h-4 text-gray-500" />
          </button>
          
          <button 
            disabled={disabled}
            onPointerDown={() => sendDrive(1, 0)}
            onPointerUp={() => sendDrive(0, 0)}
            onPointerLeave={() => sendDrive(0, 0)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-8 bg-white border border-gray-100 rounded-r-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-50 shadow-sm transition-all active:scale-95">
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </button>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-gray-100 border border-gray-100 rounded-full flex items-center justify-center shadow-inner">
            <div className="w-3 h-3 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Camera Pan & Light */}
        <div className="flex items-center gap-2 mb-4">
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
              className="w-full accent-orange-500 disabled:opacity-50 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
            />
          </div>
          <button onClick={toggleLight} disabled={disabled} className={cn("p-2.5 border rounded-xl disabled:opacity-50 transition-colors shadow-sm", lightOn ? "bg-yellow-100 border-yellow-200 text-yellow-600" : "bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100")}>
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>

        {/* E-Stop */}
        <button
          onClick={onEmergencyStop}
          className={cn(
            "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 text-sm",
            isEmergency
              ? "bg-red-500 text-gray-900"
              : "bg-gray-50 text-red-600 hover:bg-gray-100 border border-gray-100"
          )}
        >
          <StopCircle className={cn("w-5 h-5", isEmergency && "animate-pulse")} />
          {isEmergency ? "EMERGENCY STOP ACTIVE" : "EMERGENCY STOP"}
        </button>
      </div>
    </div>
  );
}
