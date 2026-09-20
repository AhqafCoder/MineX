"use client";

import { Gamepad2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Lightbulb, Gauge, Zap, Octagon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";
import { useState } from "react";

interface Props {
  state: DashboardState;
  onEmergencyStop: () => void;
  onModeChange: (mode: "manual" | "assisted" | "autonomous") => void;
}

const SPEED_PRESETS = [
  { label: "CRAWL", value: 30, desc: "0.3 m/s · High Precision" },
  { label: "PATROL", value: 55, desc: "0.6 m/s · Mapping" },
  { label: "NORMAL", value: 80, desc: "1.0 m/s · Standard" },
  { label: "BOOST", value: 100, desc: "1.4 m/s · Full Throttle" },
];

export default function RoverControlPanel({ state, onEmergencyStop }: Props) {
  const [lightOn, setLightOn] = useState(false);
  const [speed, setSpeed] = useState(55); // Default to moderate/slow speed for mine safety
  const isEmergency = state.roverState === "emergency";
  const disabled = isEmergency || (state.isLive && state.connection !== "connected");

  const sendDrive = (x: number, y: number) => {
    if (!state.isLive) return;
    const speedFactor = speed / 100;
    fetch(`/api/rover/drive?ip=${encodeURIComponent(state.roverIp)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        x: Number((x * speedFactor).toFixed(2)), 
        y: Number((y * speedFactor).toFixed(2)),
        speed: speed 
      })
    }).catch(() => {});
  };

  const toggleLight = async () => {
    if (!state.isLive) { setLightOn(!lightOn); return; }
    try {
      const res = await fetch(`/api/rover/light?ip=${encodeURIComponent(state.roverIp)}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLightOn(data.state);
      }
    } catch (e) {}
  };

  const setPan = (val: number) => {
    if (!state.isLive) return;
    fetch(`/api/rover/servo?ip=${encodeURIComponent(state.roverIp)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: val })
    }).catch(() => {});
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Rover Navigation & Speed</h3>
            <p className="text-[10px] text-gray-500">4WD Differential Drive · Variable Speed</p>
          </div>
        </div>
        {disabled && (
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            {state.connection !== "connected" ? "OFFLINE" : "E-STOP ACTIVE"}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        {/* Speed Control Section */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Gauge className="w-3 h-3 text-orange-500" />
              Drive Throttle Limit
            </span>
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
              {speed}% ({(speed * 0.014).toFixed(2)} m/s)
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-4 gap-1.5 mb-2.5">
            {SPEED_PRESETS.map((p) => (
              <button
                key={p.label}
                disabled={disabled}
                onClick={() => setSpeed(p.value)}
                className={cn(
                  "py-1 px-1.5 text-[10px] font-bold rounded-lg transition-all text-center",
                  speed === p.value
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
                )}
                title={p.desc}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Speed Slider */}
          <input
            type="range"
            min="15"
            max="100"
            step="5"
            value={speed}
            disabled={disabled}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-orange-500 disabled:opacity-40 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* D-Pad & Emergency Controls */}
        <div className="flex items-center justify-center gap-4 my-1">
          {/* D-Pad */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <div className="absolute inset-0 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />

            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(0, 1)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-9 bg-white border border-gray-100 rounded-t-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95"
              title="Drive Forward"
            >
              <ArrowUp className="w-3.5 h-3.5 text-gray-600" />
            </button>

            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(0, -1)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className="absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-9 bg-white border border-gray-100 rounded-b-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95"
              title="Drive Reverse"
            >
              <ArrowDown className="w-3.5 h-3.5 text-gray-600" />
            </button>

            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(-1, 0)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-7 bg-white border border-gray-100 rounded-l-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95"
              title="Steer Left"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gray-600" />
            </button>

            <button
              disabled={disabled}
              onPointerDown={() => sendDrive(1, 0)}
              onPointerUp={() => sendDrive(0, 0)}
              onPointerLeave={() => sendDrive(0, 0)}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-7 bg-white border border-gray-100 rounded-r-xl hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center disabled:opacity-40 shadow-sm transition-all active:scale-95"
              title="Steer Right"
            >
              <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
            </button>

            {/* Center Stop / Brake Button */}
            <button
              disabled={disabled}
              onClick={() => sendDrive(0, 0)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-600 border border-gray-200 rounded-full flex items-center justify-center shadow-inner transition-colors"
              title="Quick Brake"
            >
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />
            </button>
          </div>

          {/* Quick Actions (Emergency Stop & Light) */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onEmergencyStop}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm flex items-center gap-1.5",
                isEmergency
                  ? "bg-red-600 text-white border-red-700 animate-pulse"
                  : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              )}
            >
              <Octagon className="w-3.5 h-3.5" />
              {isEmergency ? "RELEASE STOP" : "E-STOP"}
            </button>

            <button
              onClick={toggleLight}
              disabled={disabled}
              className={cn(
                "px-3 py-2 border rounded-xl text-xs font-bold disabled:opacity-40 transition-colors shadow-sm flex items-center gap-1.5",
                lightOn
                  ? "bg-yellow-100 border-yellow-300 text-yellow-700 shadow-yellow-100"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              )}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {lightOn ? "LIGHT ON" : "LIGHT OFF"}
            </button>
          </div>
        </div>

        {/* Camera Pan Gimbal */}
        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-gray-500 font-bold uppercase">ESP32-CAM Pan Angle</span>
            <span className="text-gray-400 font-mono">Center (0°)</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            defaultValue="0"
            onChange={(e) => setPan(parseFloat(e.target.value))}
            onMouseUp={(e) => { e.currentTarget.value = "0"; setPan(0); }}
            onTouchEnd={(e) => { e.currentTarget.value = "0"; setPan(0); }}
            disabled={disabled}
            className="w-full accent-orange-500 disabled:opacity-40 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

