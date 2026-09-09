"use client";

import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

const statusItems = [
  { key: "battery", getLabel: (s: DashboardState) => `Battery ${s.battery.toFixed(0)}%`, getStatus: (s: DashboardState) => s.battery > 50 ? "ok" : "warn" },
  { key: "signal", getLabel: (s: DashboardState) => `Signal ${s.signal.toFixed(0)}%`, getStatus: (s: DashboardState) => s.signal > 60 ? "ok" : "warn" },
  { key: "lidar", getLabel: () => "LiDAR Online", getStatus: () => "ok" },
  { key: "camera", getLabel: () => "Camera Active", getStatus: () => "ok" },
  { key: "imu", getLabel: () => "IMU Stable", getStatus: () => "ok" },
  { key: "db", getLabel: (s: DashboardState) => s.connection === "connected" ? "DB Synced" : "DB Local", getStatus: (s: DashboardState) => s.connection === "connected" ? "ok" : "warn" },
  { key: "ai", getLabel: () => "AI Ready", getStatus: () => "ok" },
  { key: "mission", getLabel: (s: DashboardState) => s.roverState === "emergency" ? "Emergency Stop" : "Mission Active", getStatus: (s: DashboardState) => s.roverState === "emergency" ? "crit" : "ok" },
];

export default function DashboardBottomBar({ state }: Props) {
  const statusColor = {
    ok: "bg-orange-600",
    warn: "bg-yellow-500",
    crit: "bg-red-500",
  };

  const textColor = {
    ok: "text-gray-500",
    warn: "text-yellow-700",
    crit: "text-red-700",
  };

  return (
    <div className="h-10 flex items-center bg-white border-t border-gray-100 overflow-x-auto flex-shrink-0 px-4">
      {statusItems.map((item, i) => {
        const status = item.getStatus(state) as "ok" | "warn" | "crit";
        return (
          <div key={item.key} className="flex items-center flex-shrink-0">
            {i > 0 && <div className="w-1 h-1 rounded-full bg-gray-200 mx-4" />}
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", statusColor[status])} />
              <span className={cn("text-xs font-medium", textColor[status])}>
                {item.getLabel(state)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
