"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import MineSlamMap3D from "@/components/dashboard/MineSlamMap3D";
import { 
  Map, 
  Layers, 
  Activity, 
  Flame, 
  Navigation, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  RefreshCw,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

const initialState: DashboardState = {
  heading: 142,
  direction: "SE",
  mode: "manual",
  connection: "connected",
  roverState: "active",
  temperature: 24.8,
  humidity: 62.4,
  gasLevel: "normal",
  gas: "NORMAL",
  accelX: 0.02,
  accelY: -0.05,
  accelZ: 9.81,
  pitch: 2.1,
  roll: -1.4,
  isLive: true,
  roverIp: "http://winner.local:8080",
  sessionActive: true,
  sessionStartTime: Date.now() - 1000 * 60 * 18,
  sessionElapsed: 1080,
  refreshKey: 0,
};

const CHAMBER_STATUS = [
  { id: "SEC-01", name: "Portal Entrance", depth: "-0.0m", gas: "Safe (18 ppm)", gasType: "Normal Air", status: "cleared", points: "3,420" },
  { id: "SEC-02", name: "Station Alpha (Sub-L1)", depth: "-4.0m", gas: "Safe (32 ppm)", gasType: "Normal Air", status: "cleared", points: "4,180" },
  { id: "SEC-03", name: "North Crosscut 1", depth: "-6.2m", gas: "Warning (85 ppm)", gasType: "CO (Carbon Monoxide)", status: "warning", points: "2,840" },
  { id: "SEC-04", name: "Abandoned Stope N-2", depth: "-9.1m", gas: "Critical (240 ppm)", gasType: "CH4 (Methane)", status: "critical", points: "3,110" },
  { id: "SEC-05", name: "Extraction Stope 101", depth: "-8.0m", gas: "Warning (72 ppm)", gasType: "CO (Carbon Monoxide)", status: "warning", points: "3,650" },
  { id: "SEC-06", name: "Deep Heading Dead-End", depth: "-10.0m", gas: "Critical (310 ppm)", gasType: "CH4 (Methane)", status: "critical", points: "1,980" },
  { id: "SEC-07", name: "Substation South", depth: "-5.0m", gas: "Warning (45 ppm)", gasType: "H2S (Hydrogen Sulfide)", status: "warning", points: "2,440" },
];

export default function MapPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState<DashboardState>(initialState);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Poll live telemetry if available
  useEffect(() => {
    if (!state.isLive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rover/telemetry?ip=${encodeURIComponent(state.roverIp)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!data.error) {
            setState((prev) => ({
              ...prev,
              temperature: Number.isFinite(data.temp) ? Number(data.temp) : prev.temperature,
              humidity: Number.isFinite(data.hum) ? Number(data.hum) : prev.humidity,
              heading: Number.isFinite(data.heading) ? Number(data.heading) : prev.heading,
              direction: typeof data.direction === "string" ? data.direction : prev.direction,
              gas: typeof data.gas === "string" ? data.gas : prev.gas,
              accelX: Number.isFinite(data.ax) ? Number(data.ax) : prev.accelX,
              accelY: Number.isFinite(data.ay) ? Number(data.ay) : prev.accelY,
              accelZ: Number.isFinite(data.az) ? Number(data.az) : prev.accelZ,
              connection: "connected",
            }));
          }
        }
      } catch (err) {}
    }, 1500);

    return () => clearInterval(interval);
  }, [state.isLive, state.roverIp]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setState((prev) => ({ ...prev, refreshKey: prev.refreshKey + 1 }));
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeView="map"
        onNavigate={() => {}}
        roverState={state.roverState}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar state={state} onReconnect={handleRefresh} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">3D Subterranean SLAM & LiDAR Map</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
                  Mine Level -1 (Sub-surface)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Real-time 3D LiDAR point cloud odometry, subterranean tunnel mesh, and multi-gas hazard mapping
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className={cn(
                  "p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors shadow-sm",
                  isRefreshing && "animate-spin text-orange-600"
                )}
                title="Refresh Telemetry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                SLAM Engine 60 FPS
              </div>
            </div>
          </div>

          {/* Main 3D SLAM Rotatable Canvas Element */}
          <MineSlamMap3D state={state} heightClass="h-[580px] lg:h-[620px]" />

          {/* Quick Telemetry & Chamber Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Exploration Status Summary */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mine Shaft Coverage</span>
                  <span className="text-xs font-bold text-orange-600">76% Explored</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-gradient-to-r from-orange-500 to-emerald-500 h-full rounded-full w-3/4" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Total Mapped</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">1,850 m²</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Shaft Depth</div>
                    <div className="text-lg font-bold text-gray-900 font-mono">-10.4 m</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>LiDAR Point Resolution:</span>
                  <span className="font-semibold text-gray-900">0.05 m</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Loop Closures Confirmed:</span>
                  <span className="font-semibold text-emerald-600">18 / 18 OK</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Odometry Drift Error:</span>
                  <span className="font-semibold text-gray-900">&lt; 0.8%</span>
                </div>
              </div>
            </div>

            {/* Chamber Inspection Ledger Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Chamber Hazard & Point Ledger</h3>
                  <p className="text-[11px] text-gray-500">Spatial zone gas readings mapped along rover trajectory</p>
                </div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                  7 Identified Zones
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px]">
                      <th className="pb-2.5">Sector</th>
                      <th className="pb-2.5">Chamber Name</th>
                      <th className="pb-2.5">Depth</th>
                      <th className="pb-2.5">Gas Telemetry</th>
                      <th className="pb-2.5">LiDAR Points</th>
                      <th className="pb-2.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {CHAMBER_STATUS.map((ch) => (
                      <tr key={ch.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-2.5 font-bold font-mono text-gray-600">{ch.id}</td>
                        <td className="py-2.5 font-semibold text-gray-900">{ch.name}</td>
                        <td className="py-2.5 font-mono text-gray-500">{ch.depth}</td>
                        <td className="py-2.5">
                          <span
                            className={cn(
                              "font-medium",
                              ch.status === "critical"
                                ? "text-red-600 font-bold"
                                : ch.status === "warning"
                                ? "text-amber-600 font-semibold"
                                : "text-emerald-600"
                            )}
                          >
                            {ch.gas}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-gray-500">{ch.points} pts</td>
                        <td className="py-2.5 text-right">
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                              ch.status === "critical"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : ch.status === "warning"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            )}
                          >
                            {ch.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
