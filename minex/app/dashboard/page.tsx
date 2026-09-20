"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import OverviewPanel from "@/components/dashboard/OverviewPanel";

export type RoverMode = "manual" | "assisted" | "autonomous";
export type ConnectionStatus = "connected" | "reconnecting" | "offline";

export interface DashboardState {
  heading: number;
  direction: string;
  mode: RoverMode;
  connection: ConnectionStatus;
  roverState: "active" | "standby" | "emergency";
  temperature: number;
  humidity: number;
  gasLevel: "normal" | "warning" | "critical";
  gas: string;
  accelX: number;
  accelY: number;
  accelZ: number;
  pitch: number;
  roll: number;
  isLive: boolean;
  roverIp: string;
  // Session logging
  sessionActive: boolean;
  sessionStartTime: number | null;
  sessionElapsed: number;
  // UI State
  refreshKey: number;
}

const initialState: DashboardState = {
  heading: 0,
  direction: "--",
  mode: "manual",
  connection: "offline",
  roverState: "standby",
  temperature: 0,
  humidity: 0,
  gasLevel: "normal",
  gas: "OFFLINE",
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  pitch: 0,
  roll: 0,
  isLive: true,
  roverIp: "http://winner.local:8080",
  sessionActive: false,
  sessionStartTime: null,
  sessionElapsed: 0,
  refreshKey: 0,
};

/** Compute pitch & roll (degrees) from raw accelerometer values */
function computeOrientation(ax: number, ay: number, az: number) {
  const pitch = Math.atan2(-ax, Math.sqrt(ay * ay + az * az)) * (180 / Math.PI);
  const roll = Math.atan2(ay, az) * (180 / Math.PI);
  return { pitch: Number.isFinite(pitch) ? pitch : 0, roll: Number.isFinite(roll) ? roll : 0 };
}

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState<DashboardState>(initialState);

  // Live data fetching from actual Rover — through API proxy to avoid CORS
  useEffect(() => {
    if (!state.isLive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/rover/telemetry?ip=${encodeURIComponent(state.roverIp)}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.error) {
            setState(prev => ({ ...prev, connection: "offline", gas: "OFFLINE" }));
            return;
          }
          setState(prev => {
            const rawGas = typeof data.gas === "string" ? data.gas : String(data.gas ?? "OFFLINE");
            const gasLevel: "normal" | "warning" | "critical" = /UNHEALTHY|HAZARDOUS/.test(rawGas)
              ? "critical"
              : /MODERATE/.test(rawGas)
                ? "warning"
                : "normal";

            const heading = Number.isFinite(data.heading) ? Number(data.heading) : prev.heading;
            const direction = typeof data.direction === "string" && data.direction ? data.direction : prev.direction;
            const temperature = Number.isFinite(data.temp) ? Number(data.temp) : prev.temperature;
            const humidity = Number.isFinite(data.hum) ? Number(data.hum) : prev.humidity;
            const ax = Number.isFinite(data.ax) ? Number(data.ax) : prev.accelX;
            const ay = Number.isFinite(data.ay) ? Number(data.ay) : prev.accelY;
            const az = Number.isFinite(data.az) ? Number(data.az) : prev.accelZ;
            const { pitch, roll } = computeOrientation(ax, ay, az);

            return {
              ...prev,
              temperature,
              humidity,
              heading,
              direction,
              gas: rawGas,
              gasLevel,
              accelX: ax,
              accelY: ay,
              accelZ: az,
              pitch,
              roll,
              connection: "connected",
              roverState: gasLevel === "critical" ? "emergency" : "active",
            };
          });
        } else {
          setState(prev => ({ ...prev, connection: "offline", gas: "OFFLINE" }));
        }
      } catch (err) {
        setState(prev => ({ ...prev, connection: "offline", gas: "OFFLINE" }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state.isLive, state.roverIp, state.refreshKey]);

  // Session timer tick
  useEffect(() => {
    if (!state.sessionActive) return;

    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        sessionElapsed: prev.sessionStartTime
          ? Math.floor((Date.now() - prev.sessionStartTime) / 1000)
          : 0,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [state.sessionActive]);

  const handleToggleSession = useCallback(() => {
    setState((prev) => {
      if (prev.sessionActive) {
        // Stop session
        return { ...prev, sessionActive: false };
      } else {
        // Start session
        return { ...prev, sessionActive: true, sessionStartTime: Date.now(), sessionElapsed: 0 };
      }
    });
  }, []);

  const handleModeChange = (mode: RoverMode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const handleReconnect = async () => {
    setState((prev) => ({ ...prev, connection: "reconnecting", refreshKey: prev.refreshKey + 1 }));
    try {
      const res = await fetch(`/api/rover/telemetry?ip=${encodeURIComponent(state.roverIp)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.error) {
          setState((prev) => ({ ...prev, connection: "offline" }));
        } else {
          setState((prev) => ({ ...prev, connection: "connected" }));
        }
      } else {
        setState((prev) => ({ ...prev, connection: "offline" }));
      }
    } catch {
      setState((prev) => ({ ...prev, connection: "offline" }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeView="overview"
        onNavigate={() => {}}
        roverState={state.roverState}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar
          state={state}
          onReconnect={handleReconnect}
          onToggleLive={() => setState(s => ({ ...s, isLive: !s.isLive }))}
          onIpChange={(ip: string) => setState(s => ({ ...s, roverIp: ip }))}
          onToggleSession={handleToggleSession}
          onRefresh={handleReconnect}
        />
        
        <div className="flex-1 overflow-auto bg-gray-50">
          <OverviewPanel
            state={state}
            onEmergencyStop={() => {}}
            onModeChange={handleModeChange}
          />
        </div>
        
        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
