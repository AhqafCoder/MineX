"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Maximize2,
  Minimize2,
  AlertCircle,
  RefreshCw,
  RotateCw,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Video,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
  defaultMode?: VisionMode;
}

export type VisionMode = "raw" | "ai_pose";
export type VideoSource = "rover" | "webcam" | "sim";

interface AiStatusData {
  status: "online" | "offline";
  device?: string;
  model?: string;
  fps?: number;
  latency_ms?: number;
  persons_detected?: number;
  postures?: string[];
  alert_state?: "normal" | "hazard";
  message?: string;
}

export default function RoverVisionPanel({ state, defaultMode = "raw" }: Props) {
  const [visionMode, setVisionMode] = useState<VisionMode>(defaultMode);
  const [videoSource, setVideoSource] = useState<VideoSource>("rover");
  const [recording, setRecording] = useState(false);
  const [rotation, setRotation] = useState(0); // 0°, 90°, 180°, 270°
  const [imgError, setImgError] = useState(false);
  const [localRefresh, setLocalRefresh] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // AI settings
  const [confidence, setConfidence] = useState(0.35);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);

  // AI status telemetry
  const [aiStatus, setAiStatus] = useState<AiStatusData>({
    status: "offline",
    fps: 0,
    latency_ms: 0,
    persons_detected: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const isOffline = state.connection === "offline";

  // Dimension tracking for rotations
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

  // Poll AI Server status periodically
  useEffect(() => {
    let active = true;
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/ai/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (active) setAiStatus(data);
        }
      } catch {
        if (active) setAiStatus({ status: "offline", fps: 0, latency_ms: 0, persons_detected: 0 });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Sync AI settings to backend when changed
  const updateAiConfig = async (newConf: number, newSkel: boolean, newBox: boolean) => {
    try {
      await fetch("/api/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conf_threshold: newConf,
          show_skeleton: newSkel,
          show_boxes: newBox,
        }),
      });
    } catch {}
  };

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

  const copyAiStartCommand = () => {
    navigator.clipboard.writeText("npm run ai");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const isRotated90or270 = rotation === 90 || rotation === 270;

  // Determine stream URL based on mode
  const streamUrl =
    visionMode === "ai_pose"
      ? `/api/ai/stream?source=${videoSource}&rover_ip=${encodeURIComponent(
          state.roverIp
        )}&conf=${confidence}&rotation=${rotation}&t=${state.refreshKey}_${localRefresh}`
      : `/api/rover/video?ip=${encodeURIComponent(state.roverIp)}&t=${state.refreshKey}_${localRefresh}`;

  return (
    <div
      ref={panelRef}
      className={cn(
        "bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full",
        isFullscreen && "fixed inset-0 z-50 rounded-none border-0"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Vision & Pose AI</h3>
              {aiStatus.status === "online" && (
                <span className="flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  YOLOv8 ({aiStatus.device?.toUpperCase()})
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-500">
              {visionMode === "ai_pose" ? "Real-time 17-pt skeleton pose & miner safety" : "Direct ESP32-CAM MJPEG stream"}
            </p>
          </div>
        </div>

        {/* Header Right: Mode selector & controls */}
        <div className="flex items-center gap-2">
          {/* Mode Pill Toggle */}
          <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => {
                setVisionMode("raw");
                setImgError(false);
              }}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                visionMode === "raw" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              )}
            >
              Raw
            </button>
            <button
              onClick={() => {
                setVisionMode("ai_pose");
                setImgError(false);
              }}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all flex items-center gap-1",
                visionMode === "ai_pose" ? "bg-purple-600 text-white shadow-xs" : "text-gray-500 hover:text-gray-900"
              )}
            >
              <Cpu className="w-3 h-3" />
              AI Pose
            </button>
          </div>

          {recording && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 text-red-600 rounded-md text-[10px] font-black tracking-widest border border-red-100">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              REC
            </div>
          )}

          <button
            onClick={() => {
              setImgError(false);
              setLocalRefresh(Date.now());
            }}
            className="p-1.5 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
            title="Refresh Stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-bar for AI controls (Source selector, Settings toggle) */}
      <div className="flex items-center justify-between px-5 py-2 bg-gray-50/80 border-b border-gray-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-gray-400">SOURCE:</span>
          <select
            value={videoSource}
            onChange={(e) => {
              setVideoSource(e.target.value as VideoSource);
              setImgError(false);
            }}
            className="text-[11px] font-semibold bg-white border border-gray-200 text-gray-800 rounded-md px-2 py-0.5 focus:outline-hidden focus:ring-1 focus:ring-purple-500"
          >
            <option value="rover">
              {`Rover Cam (${state.roverIp.replace(/^https?:\/\//, "")})`}
            </option>
            <option value="webcam">Laptop Webcam (Live Test)</option>
            <option value="sim">Underground Tunnel Simulation</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {visionMode === "ai_pose" && (
            <>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-bold">{aiStatus.persons_detected ?? 0}</span>
                <span className="text-gray-400 text-[10px]">Miners</span>
              </div>

              {aiStatus.latency_ms ? (
                <span className="text-[10px] text-emerald-600 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                  {aiStatus.latency_ms}ms · {aiStatus.fps} FPS
                </span>
              ) : null}

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={cn(
                  "p-1 rounded-md transition-colors border",
                  showSettings ? "bg-purple-50 text-purple-600 border-purple-200" : "text-gray-400 hover:text-gray-700 border-transparent hover:bg-gray-100"
                )}
                title="AI Detection Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* AI Settings Popover Drawer */}
      {showSettings && visionMode === "ai_pose" && (
        <div className="px-5 py-2.5 bg-purple-50/50 border-b border-purple-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-gray-700">Confidence: {Math.round(confidence * 100)}%</span>
            <input
              type="range"
              min="0.15"
              max="0.85"
              step="0.05"
              value={confidence}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setConfidence(val);
                updateAiConfig(val, showSkeleton, showBoxes);
              }}
              className="w-28 accent-purple-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={showSkeleton}
                onChange={(e) => {
                  setShowSkeleton(e.target.checked);
                  updateAiConfig(confidence, e.target.checked, showBoxes);
                }}
                className="rounded accent-purple-600"
              />
              Skeleton Limbs
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={showBoxes}
                onChange={(e) => {
                  setShowBoxes(e.target.checked);
                  updateAiConfig(confidence, showSkeleton, e.target.checked);
                }}
                className="rounded accent-purple-600"
              />
              Bounding Boxes
            </label>
          </div>
        </div>
      )}

      {/* Vision feed container */}
      <div
        ref={containerRef}
        className="relative flex-1 bg-gray-950 min-h-[260px] sm:min-h-[280px] flex items-center justify-center overflow-hidden select-none"
      >
        {/* If AI mode is selected and AI server is offline, show helpful onboarding */}
        {visionMode === "ai_pose" && aiStatus.status === "offline" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-center p-6 z-20">
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-3">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-gray-100">YOLOv8 Pose AI Engine Ready</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Start the hardware-accelerated local Python AI service to enable real-time 17-point skeletal pose tracking:
            </p>

            <div className="mt-4 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
              <code className="text-xs text-purple-300 font-mono">npm run ai</code>
              <button
                onClick={copyAiStartCommand}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Copy command"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 mt-2">
              Runs locally on Apple Silicon Metal GPU (<span className="text-purple-400 font-mono">MPS</span>) at ~75 FPS
            </p>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setLocalRefresh(Date.now());
                }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white rounded-full transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Check Connection
              </button>
              <button
                onClick={() => setVisionMode("raw")}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-300 rounded-full transition-colors border border-gray-700"
              >
                Switch to Raw Feed
              </button>
            </div>
          </div>
        ) : !imgError ? (
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={streamUrl}
              alt="Live Feed"
              className="object-contain transition-all duration-300"
              style={{
                transform: visionMode === "raw" ? `rotate(${rotation}deg)` : undefined,
                ...(visionMode === "raw" && isRotated90or270 && containerSize.height && containerSize.width
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
              {visionMode === "ai_pose"
                ? `Ensure AI server is streaming from source '${videoSource}'`
                : `Ensure the rover is reachable at ${state.roverIp}`}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setImgError(false);
                  setLocalRefresh(Date.now());
                }}
                className="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-full transition-colors border border-gray-700"
              >
                Retry Stream
              </button>
              {videoSource !== "sim" && (
                <button
                  onClick={() => {
                    setVideoSource("sim");
                    setImgError(false);
                  }}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white rounded-full transition-colors"
                >
                  Use Simulation Feed
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 text-gray-200 text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md flex items-center gap-2 shadow">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                imgError ? "bg-red-500" : "bg-green-400 animate-pulse"
              )}
            />
            {imgError
              ? "STREAM ERROR"
              : visionMode === "ai_pose"
              ? `YOLOv8 POSE · ${videoSource.toUpperCase()}`
              : "ESP32-CAM RAW"}
          </div>

          {/* Hazard Alert Banner on video overlay */}
          {visionMode === "ai_pose" && aiStatus.alert_state === "hazard" && (
            <div className="bg-red-600/90 backdrop-blur-md border border-red-400 text-white text-[10px] font-black px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>MAN DOWN / FALL DETECTED</span>
            </div>
          )}

          {rotation !== 0 && visionMode === "raw" && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-purple-300 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow w-fit">
              <RotateCw className="w-2.5 h-2.5" />
              {rotation}°
            </div>
          )}
        </div>
      </div>

      {/* Controls Footer */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 bg-white flex-shrink-0">
        <button
          onClick={() => setRotation((prev) => (prev + 90) % 360)}
          className="text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 flex items-center gap-1.5"
          title="Rotate camera feed 90 degrees"
        >
          <RotateCw className="w-3 h-3" />
          Rotate ({rotation}°)
        </button>

        <button
          onClick={toggleRecord}
          disabled={isOffline && videoSource === "rover"}
          className={cn(
            "text-[11px] px-3.5 py-1.5 rounded-full font-bold transition-all disabled:opacity-40",
            recording
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
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
