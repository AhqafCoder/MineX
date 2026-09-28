"use client";

import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

const statusItems = [
  { key: "connection", getLabel: (s: DashboardState) => `Connection: ${s.connection === "connected" ? "Connected" : s.connection === "reconnecting" ? "Reconnecting" : "Offline"}`, getStatus: (s: DashboardState) => s.connection === "connected" ? "ok" : "crit" },
  { key: "env", getLabel: () => "Env (DHT22): Online", getStatus: (s: DashboardState) => s.connection === "connected" ? "ok" : "warn" },
  { key: "gas", getLabel: () => "Gas (MQ-135): Online", getStatus: (s: DashboardState) => s.connection === "connected" ? "ok" : "warn" },
  { key: "imu", getLabel: () => "IMU (MPU-6050): Online", getStatus: (s: DashboardState) => (s.accelX !== 0 || s.accelY !== 0 || s.accelZ !== 0) ? "ok" : "warn" },
  { key: "camera", getLabel: (s: DashboardState) => s.isLive && s.connection === "connected" ? "Camera: Streaming" : "Camera: Offline", getStatus: (s: DashboardState) => s.isLive && s.connection === "connected" ? "ok" : "crit" },
  { key: "system", getLabel: (s: DashboardState) => s.roverState === "emergency" ? "System: Emergency" : "System: Normal", getStatus: (s: DashboardState) => s.roverState === "emergency" ? "crit" : "ok" },
];

export default function DashboardBottomBar({ state }: Props) {
  const statusColor = {
    ok: "bg-green-500",
    warn: "bg-yellow-500",
    crit: "bg-red-500",
  };

  const textColor = {
    ok: "text-gray-500",
    warn: "text-yellow-700",
    crit: "text-red-700",
  };

  return (
    <div className="h-8 flex items-center bg-white border-t border-gray-100 overflow-x-auto flex-shrink-0 px-4">
      {statusItems.map((item, i) => {
        const status = item.getStatus(state) as "ok" | "warn" | "crit";
        return (
          <div key={item.key} className="flex items-center flex-shrink-0">
            {i > 0 && <div className="w-1 h-1 rounded-full bg-gray-200 mx-3" />}
            <div className="flex items-center gap-1.5">
              <div className={cn("w-1.5 h-1.5 rounded-full", statusColor[status])} />
              <span className={cn("text-[10px] font-medium", textColor[status])}>
                {item.getLabel(state)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
