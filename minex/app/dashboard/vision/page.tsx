"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import RoverVisionPanel, { VideoSource } from "@/components/dashboard/RoverVisionPanel";
import type { DashboardState } from "@/app/dashboard/page";
import {
  Cpu,
  Activity,
  UserCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Sliders,
  Copy,
  Check,
  Eye,
  Camera,
  Layers,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const defaultState: DashboardState = {
  heading: 142,
  direction: "SE",
  mode: "manual",
  connection: "connected",
  roverState: "active",
  temperature: 24.2,
  humidity: 68,
  gasLevel: "normal",
  gas: "NORMAL",
  accelX: 0.02,
  accelY: -0.01,
  accelZ: 0.98,
  pitch: 1.2,
  roll: -0.8,
  isLive: true,
  roverIp: "http://winner.local:8080",
  sessionActive: true,
  sessionStartTime: Date.now() - 360000,
  sessionElapsed: 360,
  refreshKey: 0,
};

interface AiStatus {
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

export default function VisionPage() {
  const [state, setState] = useState<DashboardState>(defaultState);
  const [aiStatus, setAiStatus] = useState<AiStatus>({
    status: "offline",
    fps: 0,
    latency_ms: 0,
    persons_detected: 0,
  });
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Poll AI status
  useEffect(() => {
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/ai/status", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setAiStatus(data);
        }
      } catch {
        if (mounted) {
          setAiStatus({
            status: "offline",
            fps: 0,
            latency_ms: 0,
            persons_detected: 0,
          });
        }
      }
    };

    fetchStatus();
    const timer = setInterval(fetchStatus, 1500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const standingCount = aiStatus.postures?.filter((p) => p === "STANDING").length ?? 0;
  const crouchingCount = aiStatus.postures?.filter((p) => p === "CROUCHING").length ?? 0;
  const fallenCount = aiStatus.postures?.filter((p) => p === "FALLEN").length ?? 0;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar
        collapsed={false}
        onToggle={() => {}}
        activeView="vision"
        onNavigate={() => {}}
        roverState={state.roverState}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar state={state} onReconnect={() => {}} />

        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-xs">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">
                      Vision AI Operations — YOLOv8 Skeleton Pose
                    </h1>
                    <p className="text-xs text-gray-500">
                      Edge neural inference · 17-point worker pose tracking & fall detection
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border",
                    aiStatus.status === "online"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      aiStatus.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )}
                  />
                  <span>
                    {aiStatus.status === "online"
                      ? `AI ENGINE ONLINE (${aiStatus.device?.toUpperCase()})`
                      : "AI ENGINE OFFLINE"}
                  </span>
                </div>

                {aiStatus.status === "online" && (
                  <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-mono font-bold">
                    {aiStatus.latency_ms}ms · {aiStatus.fps} FPS
                  </div>
                )}
              </div>
            </div>

            {/* Quick-Start Banner if AI Server is Offline */}
            {aiStatus.status === "offline" && (
              <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-5 rounded-3xl shadow-sm border border-purple-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-black tracking-wider uppercase">
                    <Terminal className="w-4 h-4" />
                    <span>Start Local YOLOv8 Pose Engine</span>
                  </div>
                  <p className="text-sm text-gray-200">
                    Run the Python pose service in your terminal to enable hardware-accelerated Apple Silicon GPU inference:
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center justify-between gap-3 bg-black/40 border border-white/15 px-4 py-2 rounded-xl text-xs font-mono text-purple-200 flex-1 md:flex-initial">
                    <span>npm run ai</span>
                    <button
                      onClick={() => copyCommand("npm run ai")}
                      className="p-1 hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedCmd ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <button
                    onClick={() => copyCommand("python3 ai_pose_service.py")}
                    className="text-[11px] px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 transition-colors border border-white/10 whitespace-nowrap"
                  >
                    Direct Python
                  </button>
                </div>
              </div>
            )}

            {/* Main Content Grid: Camera Stream + Telemetry Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 7 cols: Large Video View with Pose Annotations */}
              <div className="lg:col-span-7 xl:col-span-8 min-h-[460px] flex flex-col">
                <RoverVisionPanel state={state} />
              </div>

              {/* Right 5 cols: Safety & Neural Telemetry */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                {/* Personnel Safety Status Card */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase">
                      Personnel Safety Monitor
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1",
                        fallenCount > 0
                          ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      )}
                    >
                      {fallenCount > 0 ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                      {fallenCount > 0 ? "HAZARD ALERT" : "ZONE CLEAR"}
                    </span>
                  </div>

                  {/* Big Number Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <div className="text-2xl font-black text-gray-900">{standingCount}</div>
                      <div className="text-[10px] font-bold text-gray-500 mt-0.5">STANDING</div>
                    </div>
                    <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100">
                      <div className="text-2xl font-black text-amber-700">{crouchingCount}</div>
                      <div className="text-[10px] font-bold text-amber-600 mt-0.5">CRAWLING</div>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl border transition-all",
                        fallenCount > 0
                          ? "bg-red-50 border-red-200 text-red-700"
                          : "bg-gray-50 border-gray-100 text-gray-400"
                      )}
                    >
                      <div className="text-2xl font-black">{fallenCount}</div>
                      <div className="text-[10px] font-bold mt-0.5">FALLEN / DOWN</div>
                    </div>
                  </div>

                  {/* Fall Detection Alert Box */}
                  {fallenCount > 0 && (
                    <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">Man-Down Alert Triggered</div>
                        <p className="text-[11px] text-red-700 mt-0.5">
                          Torso inclination exceeded 50° safety threshold. Possible miner slip or tunnel collapse injury.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 17 COCO Skeletal Keypoints Breakdown */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600" />
                      <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase">
                        17-Point Skeleton Map
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded font-bold">
                      COCO POSE
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { group: "Head / Cranium", joints: "Nose, Eyes, Ears (0-4)", color: "bg-purple-500" },
                      { group: "Torso & Spine", joints: "Shoulders, Hips (5,6, 11,12)", color: "bg-cyan-500" },
                      { group: "Upper Limbs", joints: "Elbows, Wrists (7,8, 9,10)", color: "bg-amber-500" },
                      { group: "Lower Limbs", joints: "Knees, Ankles (13,14, 15,16)", color: "bg-emerald-500" },
                    ].map((item) => (
                      <div key={item.group} className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className={cn("w-2 h-2 rounded-full", item.color)} />
                          <span className="font-semibold text-gray-700">{item.group}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono">{item.joints}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neural Pipeline Specs */}
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-[11px] font-black text-gray-400 tracking-wider uppercase">
                        AI Architecture
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">v8.4.143</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "Neural Model", value: "YOLOv8 Nano Pose (yolov8n-pose.pt)" },
                      { label: "Acceleration", value: "Apple Silicon Metal (MPS GPU)" },
                      { label: "Input Resolution", value: "640 × 480 px" },
                      { label: "Inference Latency", value: `${aiStatus.latency_ms ?? 13} ms (~${aiStatus.fps ?? 75} FPS)` },
                      { label: "Stream Protocol", value: "MJPEG over HTTP (/api/ai/stream)" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                        <span className="text-gray-500 text-[11px]">{row.label}</span>
                        <span className="text-gray-800 font-medium text-[11px] font-mono">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
