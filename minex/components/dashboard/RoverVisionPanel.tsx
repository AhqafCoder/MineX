"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Maximize2, Minimize2, AlertCircle, RefreshCw, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function RoverVisionPanel({ state }: Props) {
  const [recording, setRecording] = useState(false);
  const [rotation, setRotation] = useState(90); // Default to 90° rotation as requested
  const [imgError, setImgError] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const isOffline = state.connection === "offline";

  // Track container dimensions to properly fit rotated stream without clipping
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDims = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    updateDims();
    const ro = new ResizeObserver(updateDims);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!panelRef.current) return;
    if (!document.fullscreenElement) {
      panelRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleRecord = async () => {
    if (state.isLive && !isOffline) {
      try {
        const res = await fetch(`/api/rover/record?ip=${encodeURIComponent(state.roverIp)}`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setRecording(data.state);
        }
      } catch (e) {}
    }
  };

  const isRotated90or270 = rotation === 90 || rotation === 270;

  return (
    <div
      ref={panelRef}
      className={cn(
        "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Camera Feed</h3>
            <p className="text-[10px] text-gray-500">ESP32-CAM live stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Vision feed container */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-gray-950 min-h-[260px] sm:min-h-[280px] flex items-center justify-center overflow-hidden select-none"
      >
        {state.isLive && !isOffline ? (
          <>
            {!imgError ? (
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={`/api/rover/video?ip=${encodeURIComponent(state.roverIp)}&t=${state.refreshKey}_${localRefresh}`}
                  alt="Live Feed"
                  className="object-contain transition-all duration-300"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    ...(isRotated90or270 && containerSize.height && containerSize.width
                      ? {
                          width: `${containerSize.height}px`,
                          height: `${containerSize.width}px`,
                          maxWidth: `${containerSize.height}px`,
                          maxHeight: `${containerSize.width}px`,
                        }
                      : {
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }),
                  }}
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-center p-4">
                <AlertCircle className="w-8 h-8 mb-2 text-red-500" />
                <span className="text-sm font-semibold text-gray-200">Stream Connection Failed</span>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Ensure the rover is reachable at {state.roverIp}
                </p>
                <button
                  onClick={() => { setImgError(false); setLocalRefresh(Date.now()); }}
                  className="mt-3 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-full transition-colors border border-gray-700"
                >
                  Retry Stream
                </button>
              </div>
            )}

            {/* Live overlay badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 text-gray-200 text-[10px] font-black tracking-widest px-2.5 py-1 rounded flex items-center gap-2 shadow">
                <span className={cn("w-1.5 h-1.5 rounded-full", imgError ? "bg-red-500" : "bg-green-400 animate-pulse")} />
                {imgError ? "STREAM ERROR" : "ESP32-CAM LIVE"}
              </div>
              {rotation !== 0 && (
                <div className="bg-black/60 backdrop-blur-md border border-white/10 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow w-fit">
                  <RotateCw className="w-2.5 h-2.5" />
                  {rotation}°
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-950 text-center p-4">
            <AlertCircle className="w-10 h-10 mb-3 text-gray-600" />
            <span className="text-sm font-semibold text-gray-300">
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
          className="text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 flex items-center gap-1.5 disabled:opacity-40"
          title="Rotate camera feed 90 degrees"
        >
          <RotateCw className="w-3 h-3" />
          Rotate ({rotation}°)
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
        <button
          onClick={toggleFullscreen}
          className="ml-auto p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

