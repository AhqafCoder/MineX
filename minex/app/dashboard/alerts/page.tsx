"use client";

import { useState } from "react";
import { alerts as initialAlerts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { CheckCircle, X, Filter } from "lucide-react";
import type { DashboardState } from "@/app/dashboard/page";

const mockState: DashboardState = {
  heading: 142,
  direction: "N", mode: "autonomous", connection: "offline", roverState: "standby",
  missionElapsed: 0,
  temperature: 31, humidity: 68, gasLevel: "normal", gas: "OFFLINE",
  accelX: 0, accelY: 0, accelZ: 0, pitch: 0, roll: 0, isLive: false, roverIp: "http://192.168.4.1:8080",
};

const priorityConfig = {
  critical: { color: "#ff3333", bg: "bg-[#ff3333]/10", border: "border-[#ff3333]/30" },
  high: { color: "#ff3333", bg: "bg-[#ff3333]/5", border: "border-[#ff3333]/20" },
  medium: { color: "#ffaa00", bg: "bg-[#ffaa00]/5", border: "border-[#ffaa00]/20" },
  info: { color: "#00d4ff", bg: "bg-[#00d4ff]/5", border: "border-[#00d4ff]/20" },
};

type FilterType = "all" | "critical" | "high" | "medium" | "info" | "acknowledged";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = alerts.filter((a) => {
    if (filter === "all") return true;
    if (filter === "acknowledged") return a.status === "acknowledged";
    return a.priority === filter;
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "critical", label: "CRITICAL" },
    { key: "high", label: "HIGH" },
    { key: "medium", label: "MEDIUM" },
    { key: "info", label: "INFO" },
    { key: "acknowledged", label: "ACK'D" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar
        collapsed={false}
        onToggle={() => {}}
        activeView="alerts"
        onNavigate={() => {}}
        roverState="active"
      />
      <div className="flex-1 flex flex-col">
        <DashboardTopBar state={mockState} missionElapsed="01:42:18" onSimulateOffline={() => {}} />
        <div className="flex-1 overflow-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alert Center</h1>
                <p className="text-mono text-xs text-[#4a5568] mt-1">{alerts.filter(a => a.status === "active").length} active alerts</p>
              </div>
              <div className="flex gap-1">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={cn(
                      "text-mono text-xs px-3 py-1.5 border transition-colors",
                      filter === f.key
                        ? "border-[#00d4ff]/40 text-[#00d4ff] bg-[#00d4ff]/5"
                        : "border-[#1e2030] text-[#4a5568] hover:border-[#00d4ff]/20"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {filtered.map((alert) => {
                const cfg = priorityConfig[alert.priority];
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-4 border-l-4 border border-r border-t border-b",
                      cfg.bg,
                      alert.status === "acknowledged" && "opacity-60"
                    )}
                    style={{ borderLeftColor: cfg.color, borderTopColor: "#1e2030", borderRightColor: "#1e2030", borderBottomColor: "#1e2030" }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-mono text-xs font-bold uppercase" style={{ color: cfg.color }}>
                            {alert.priority}
                          </span>
                          <span className="text-mono text-xs text-[#4a5568]">{alert.timestamp}</span>
                          <span className="text-mono text-xs text-[#4a5568]">·</span>
                          <span className="text-mono text-xs text-[#4a5568]">{alert.rover}</span>
                        </div>
                        <div className="font-medium text-gray-900 mb-1">{alert.title}</div>
                        <div className="text-sm text-[#8892a4] mb-2">{alert.description}</div>
                        <div className="text-mono text-xs text-[#4a5568]">
                          📍 {alert.location}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {alert.status === "active" && (
                          <button
                            onClick={() => setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, status: "acknowledged" as const } : a))}
                            className="flex items-center gap-1 px-3 py-1.5 text-mono text-xs border border-[#00ff88]/30 text-[#00ff88] hover:bg-[#00ff88]/5 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
                          className="p-1.5 text-[#4a5568] hover:text-[#ff3333] border border-[#1e2030] hover:border-[#ff3333]/30 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-mono text-sm text-[#4a5568]">
                  No alerts matching filter
                </div>
              )}
            </div>
          </div>
        </div>
        <DashboardBottomBar state={mockState} />
      </div>
    </div>
  );
}
