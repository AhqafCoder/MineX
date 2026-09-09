"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { ZoomIn, ZoomOut, Crosshair, RotateCcw } from "lucide-react";
import { waypoints } from "@/lib/mock-data";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function LiveMapPanel({ state }: Props) {
  const [zoom, setZoom] = useState(1);
  const [showLayers, setShowLayers] = useState({ lidar: true, route: true, hazards: true, humans: true, waypoints: true });
  const [roverPos, setRoverPos] = useState({ x: 385, y: 290 });
  const [lidarAngle, setLidarAngle] = useState(0);
  const [slamPoints, setSlamPoints] = useState<{x: number, y: number}[]>([]);
  const [slamOffset, setSlamOffset] = useState(0);
  const animRef = useRef<number>(0);
  
  const [staticLidarPoints] = useState(() => {
    return Array.from({ length: 120 }, () => {
      return {
        r: 50 + Math.random() * 80,
        opacity: Math.random() * 0.4 + 0.2
      };
    });
  });

  useEffect(() => {
    if (state.isLive) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`${state.roverIp}/slam_data`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            setSlamPoints(data.points || []);
            setSlamOffset(data.offset || 0);
          }
        } catch (e) {}
      }, 200);
      return () => clearInterval(interval);
    }
  }, [state.isLive, state.roverIp]);

  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setLidarAngle((a) => (a + 2) % 360);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.roverState === "active") {
        setRoverPos((p) => ({
          x: Math.max(80, Math.min(520, p.x + (Math.random() - 0.48) * 1.5)),
          y: Math.max(100, Math.min(380, p.y + (Math.random() - 0.5) * 0.8)),
        }));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [state.roverState]);

  const layers = [
    { key: "lidar", label: "LiDAR" },
    { key: "route", label: "Route" },
    { key: "hazards", label: "Hazards" },
    { key: "humans", label: "Humans" },
    { key: "waypoints", label: "Waypoints" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-[460px] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
            <MapIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Live Spatial Map</h3>
            <p className="text-xs text-gray-500">Real-time LiDAR & Localization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {layers.map((layer) => (
            <button
              key={layer.key}
              onClick={() => setShowLayers((prev) => ({ ...prev, [layer.key as keyof typeof prev]: !prev[layer.key as keyof typeof prev] }))}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                showLayers[layer.key as keyof typeof showLayers]
                  ? "bg-gray-100 text-green-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map canvas */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        <svg className="absolute inset-0 w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
          {/* Background grid */}
          <defs>
            <pattern id="grid-light" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid-major-light" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect width="200" height="200" fill="url(#grid-light)" />
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#e2e8f0" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-major-light)" />

          {/* Coordinate labels */}
          {[0, 100, 200, 300, 400, 500].map((x) => (
            <text key={x} x={x + 5} y={12} fill="#94a3b8" fontSize="10">{x}m</text>
          ))}
          {[0, 100, 200, 300].map((y) => (
            <text key={y} x={5} y={y + 20} fill="#94a3b8" fontSize="10">{y}m</text>
          ))}

          {/* Tunnel walls */}
          <path d="M 40 150 Q 150 120 300 130 Q 420 140 560 160" fill="none" stroke="#f1f5f9" strokeWidth="60" strokeLinecap="round" />
          <path d="M 40 330 Q 180 310 300 300 Q 420 295 560 310" fill="none" stroke="#f1f5f9" strokeWidth="50" strokeLinecap="round" />
          <path d="M 40 150 Q 150 120 300 130 Q 420 140 560 160" fill="none" stroke="#e2e8f0" strokeWidth="50" strokeLinecap="round" />
          <path d="M 40 330 Q 180 310 300 300 Q 420 295 560 310" fill="none" stroke="#e2e8f0" strokeWidth="40" strokeLinecap="round" />
          <path d="M 40 240 Q 150 220 300 215 Q 420 215 560 230" fill="none" stroke="#ffffff" strokeWidth="90" strokeLinecap="round" />

          {/* LiDAR points */}
          {showLayers.lidar && !state.isLive && staticLidarPoints.map((pt, i) => {
            const angle = (i / 120) * Math.PI * 2 + lidarAngle * Math.PI / 180;
            return (
              <circle
                key={i}
                cx={roverPos.x + Math.cos(angle) * pt.r}
                cy={roverPos.y + Math.sin(angle) * pt.r}
                r={1.5}
                fill={`rgba(34, 197, 94, ${pt.opacity})`}
              />
            );
          })}

          {/* Live SLAM points */}
          {showLayers.lidar && state.isLive && slamPoints.map((p, i) => (
            <rect
              key={i}
              x={roverPos.x + p.x * 0.9}
              y={roverPos.y - (p.y + slamOffset) * 0.9}
              width={2}
              height={2}
              fill="#39FF14"
            />
          ))}

          {/* LiDAR sweep line */}
          {showLayers.lidar && (
            <line
              x1={roverPos.x}
              y1={roverPos.y}
              x2={roverPos.x + Math.cos(lidarAngle * Math.PI / 180) * 100}
              y2={roverPos.y + Math.sin(lidarAngle * Math.PI / 180) * 100}
              stroke="#22c55e"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          )}

          {/* Route path */}
          {showLayers.route && (
            <>
              <polyline
                points={waypoints.filter(w => w.status !== "pending").map(w => `${w.x},${w.y}`).join(" ")}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <polyline
                points={waypoints.filter(w => w.status === "pending" || w.status === "active").map(w => `${w.x},${w.y}`).join(" ")}
                fill="none"
                stroke="#9A9690"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            </>
          )}

          {/* Waypoints */}
          {showLayers.waypoints && waypoints.map((wp) => (
            <g key={wp.id}>
              <circle
                cx={wp.x}
                cy={wp.y}
                r={5}
                fill={wp.status === "completed" ? "#dbeafe" : wp.status === "active" ? "#3b82f6" : "#f1f5f9"}
                stroke={wp.status === "completed" ? "#93c5fd" : wp.status === "active" ? "#2563eb" : "#cbd5e1"}
                strokeWidth="2"
              />
              <text x={wp.x + 8} y={wp.y + 4} fill="#64748b" fontSize="10" fontWeight="bold">{wp.label}</text>
            </g>
          ))}

          {/* Hazard zone */}
          {showLayers.hazards && (
            <ellipse cx={460} cy={270} rx={35} ry={20} fill="rgba(249, 115, 22, 0.1)" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="2" strokeDasharray="4 3" />
          )}
          {showLayers.hazards && (
            <text x={430} y={260} fill="#ea580c" fontSize="10" fontWeight="bold">⚠ OBSTACLE</text>
          )}

          {/* Human detection marker */}
          {showLayers.humans && state.humanDetected && (
            <g>
              <circle cx={240} cy={180} r={14} fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth="2" />
              <circle cx={240} cy={180} r={6} fill="#ef4444" />
              <text x={258} y={176} fill="#ef4444" fontSize="10" fontWeight="bold">HUMAN</text>
              <text x={258} y={188} fill="#f87171" fontSize="9">94% · 8.4m</text>
            </g>
          )}

          {/* Rover marker */}
          <g transform={`translate(${roverPos.x}, ${roverPos.y})`}>
            <circle r={24} fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="1" />
            <rect x={-8} y={-8} width={16} height={16} rx="4" fill="#22c55e" transform={`rotate(${state.heading - 90})`} />
            <line
              x1={0} y1={0}
              x2={Math.cos((state.heading - 90) * Math.PI / 180) * 20}
              y2={Math.sin((state.heading - 90) * Math.PI / 180) * 20}
              stroke="#3b82f6"
              strokeWidth="2"
            />
          </g>

          {/* Danger zone */}
          <ellipse cx={120} cy={350} rx={30} ry={15} fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" strokeDasharray="4 4" />
          <text x={95} y={348} fill="#ef4444" fontSize="9" fontWeight="bold">RESTRICTED</text>
        </svg>

        {/* Map overlay: coordinate indicator */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-gray-100 text-xs text-gray-500 font-medium">
          <div>X: {roverPos.x.toFixed(0)}m · Y: {roverPos.y.toFixed(0)}m</div>
          <div>HDG: {state.heading.toFixed(0)}° · SPD: {state.speed.toFixed(1)}m/s</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-100 bg-white">
        <button onClick={() => setZoom((z) => Math.min(2, z + 0.2))} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => setZoom(1)} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Crosshair className="w-4 h-4" />
        </button>
        <div className="ml-auto text-xs text-gray-500 font-medium">
          Zoom: {(zoom * 100).toFixed(0)}%
        </div>
        <div className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-md">2D Top View</div>
      </div>
    </div>
  );
}

function MapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
    </svg>
  );
}
