"use client";

import { useState } from "react";
import { Camera, Maximize2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeRoverUrl } from "@/lib/rover-api";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function RoverVisionPanel({ state }: Props) {
  const [recording, setRecording] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);
  const isOffline = state.connection === "offline";

  const toggleRecord = async () => {
    if (state.isLive && !isOffline) {
      try {
        const res = await fetch(`${normalizeRoverUrl(state.roverIp)}/toggle_record`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setRecording(data.state);
        }
      } catch (e) {}
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Camera Feed</h3>
            <p className="text-xs text-gray-500">ESP32-CAM live stream</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {recording && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-md text-[10px] font-black tracking-widest border border-red-100">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </div>
          )}
          <button
            onClick={() => { setImgError(false); setLocalRefresh(Date.now()); }}
            disabled={isOffline}
            className="p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-40"
            title="Refresh Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-black tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            {isOffline ? "OFFLINE" : "ESP32-CAM"}
          </span>
        </div>
      </div>

      {/* Vision feed */}
      <div className="relative flex-1 bg-gray-900 min-h-[180px]">
        {state.isLive && !isOffline ? (
          <>
            {!imgError ? (
              <img 
                src={`${normalizeRoverUrl(state.roverIp)}/video_feed?t=${state.refreshKey}_${localRefresh}`} 
                alt="Live Feed" 
                className="w-full h-full object-cover transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
                <span className="text-sm font-semibold text-gray-300">Stream Connection Failed</span>
                <button 
                  onClick={() => { setImgError(false); setLocalRefresh(Date.now()); }}
                  className="mt-3 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded-full transition-colors border border-gray-700"
                >
                  Retry Stream
                </button>
              </div>
            )}
            {/* Live overlay */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              <div className="bg-black/50 backdrop-blur-md border border-white/10 text-gray-200 text-[10px] font-black tracking-widest px-2.5 py-1 rounded flex items-center gap-2">
                <span className={cn("w-1.5 h-1.5 rounded-full", imgError ? "bg-red-500" : "bg-green-400 animate-pulse")} />
                {imgError ? "STREAM ERROR" : "ESP32-CAM LIVE"}
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
            <AlertCircle className="w-10 h-10 mb-3 text-gray-600" />
            <span className="text-sm font-semibold text-gray-400">
              {isOffline ? "No Video Signal" : "Simulation Mode"}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {isOffline ? "Connect to rover for camera feed" : "Camera not available in SIM"}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
          disabled={isOffline}
          className="text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
        >
          Rotate 90°
        </button>
        <button
          onClick={toggleRecord}
          disabled={isOffline}
          className={cn(
            "text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all disabled:opacity-40",
            recording ? "bg-red-50 text-red-700 border border-red-200" : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
          )}
        >
          {recording ? "Stop Rec" : "Record"}
        </button>
        <button className="ml-auto p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
