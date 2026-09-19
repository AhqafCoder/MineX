"use client";

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

        {/* Orientation & Tilt */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100 flex items-center gap-4">
          <div className="flex-1 flex flex-col items-center">
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Heading</div>
            <div className="relative w-12 h-12 bg-white rounded-full border shadow-sm flex items-center justify-center">
              <div className="absolute top-1 text-[8px] font-bold text-gray-400">N</div>
              <div 
                className="w-8 h-8 rounded-full border-2 border-orange-500 relative transition-transform duration-300"
                style={{ transform: `rotate(${state.heading}deg)` }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-orange-600" />
              </div>
              <div className="absolute text-[10px] font-bold mt-1 text-gray-700">{state.heading.toFixed(0)}&deg;</div>
            </div>
          </div>
          <div className="w-px h-12 bg-gray-200" />
          <div className="flex-1 flex flex-col gap-2">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                <span>Pitch</span>
                <span className={cn(Math.abs(state.pitch) > 15 ? "text-orange-600" : "")}>{state.pitch.toFixed(1)}&deg;</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center relative">
                <div className="absolute h-full w-[2px] bg-gray-400 z-10" />
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 absolute left-1/2 origin-left"
                  style={{ width: `${Math.min(50, Math.abs(state.pitch))}%`, transform: state.pitch < 0 ? 'scaleX(-1)' : 'scaleX(1)' }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
                <span>Roll</span>
                <span className={cn(Math.abs(state.roll) > 15 ? "text-orange-600" : "")}>{state.roll.toFixed(1)}&deg;</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center relative">
                <div className="absolute h-full w-[2px] bg-gray-400 z-10" />
                <div 
                  className="h-full bg-green-500 transition-all duration-300 absolute left-1/2 origin-left"
                  style={{ width: `${Math.min(50, Math.abs(state.roll))}%`, transform: state.roll < 0 ? 'scaleX(-1)' : 'scaleX(1)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics grid removed (no telemetry support from backend) */}
      </div>
    </div>
  );
}
