"use client";

import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function SystemHealthPanel({ state }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "healthy":
      case "ready":
      case "synced":
      case "connected":
      case "streaming":
        return "text-orange-600 bg-gray-50 border-gray-100 dot-green";
      case "degraded":
      case "processing":
      case "local":
      case "connecting":
        return "text-yellow-600 bg-gray-50 border-gray-100 dot-yellow";
      case "offline":
      case "disconnected":
        return "text-red-600 bg-gray-50 border-gray-100 dot-red";
      default:
        return "text-gray-500 bg-gray-50 border-gray-100 dot-gray";
    }
  };

  const isConnected = state.connection === "connected";
  const hasImu = state.accelX !== 0 || state.accelY !== 0 || state.accelZ !== 0;

  const healthItems = [
    { id: "edgeNode", name: "Edge Node", status: isConnected ? "online" : "offline" },
    { id: "raspberryPi", name: "Raspberry Pi", status: isConnected ? "healthy" : "offline" },
    { id: "yolov8", name: "YOLOv8", status: isConnected ? "ready" : "offline" },
    { id: "lidar", name: "LiDAR", status: state.isLive ? "offline" : "online" }, // LiDAR is simulated for now
    { id: "esp32cam", name: "ESP32-CAM", status: state.isLive && isConnected ? "online" : "offline" },
    { id: "mpu6050", name: "MPU6050", status: isConnected && hasImu ? "online" : "offline" },
    { id: "qmc6310", name: "QMC6310", status: isConnected && hasImu ? "online" : "offline" },
    { id: "dht22", name: "DHT22", status: isConnected ? "online" : "offline" },
    { id: "mq135", name: "MQ135", status: isConnected && state.gas !== "OFFLINE" ? "online" : "offline" },
    { id: "sqlite", name: "SQLite", status: isConnected ? "synced" : "local" },
    { id: "mongodb", name: "MongoDB", status: isConnected ? "connected" : "disconnected" },
    { id: "tcp", name: "TCP", status: state.connection === "reconnecting" ? "connecting" : isConnected ? "streaming" : "offline" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">System Health</h3>
            <p className="text-xs text-gray-500">Component diagnostics</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-5 grid grid-cols-2 gap-3 overflow-y-auto max-h-60">
        {healthItems.map((item) => {
          const colorClass = getStatusColor(item.status);
          const bgDotClass = colorClass.includes('dot-green') ? 'bg-orange-600' :
                             colorClass.includes('dot-yellow') ? 'bg-yellow-500' :
                             colorClass.includes('dot-red') ? 'bg-red-500' : 'bg-gray-500';
          
          return (
            <div key={item.id} className={cn("p-3 rounded-xl border flex flex-col justify-between", colorClass.split(' dot-')[0])}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 truncate mr-2">
                  {item.name}
                </span>
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", bgDotClass)} />
              </div>
              <div className="text-xs font-medium opacity-90 truncate capitalize">
                {item.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
