"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import OverviewPanel from "@/components/dashboard/OverviewPanel";

export type RoverMode = "manual" | "assisted" | "autonomous";
export type ConnectionStatus = "connected" | "reconnecting" | "offline";

export interface DashboardState {
  battery: number;
  signal: number;
  speed: number;
  distance: number;
  heading: number;
  direction: string;
  motorTemp: number;
  mode: RoverMode;
  connection: ConnectionStatus;
  roverState: "active" | "standby" | "emergency";
  missionElapsed: number; // in seconds
  humanDetected: boolean;
  humanConfidence: number;
  temperature: number;
  humidity: number;
  gasLevel: "normal" | "warning" | "critical";
  gas: string;
  accelX: number;
  accelY: number;
  accelZ: number;
  isLive: boolean;
  roverIp: string;
}

const initialState: DashboardState = {
  battery: 78,
  signal: 96,
  speed: 1.2,
  distance: 428,
  heading: 142,
  direction: "N",
  motorTemp: 42,
  mode: "autonomous",
  connection: "connected",
  roverState: "active",
  missionElapsed: 6138,
  humanDetected: true,
  humanConfidence: 94,
  temperature: 24.5,
  humidity: 55,
  gasLevel: "normal",
  gas: "OFFLINE",
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  isLive: true,
  roverIp: "http://192.168.4.1:8080",
};

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [state, setState] = useState<DashboardState>(initialState);

  // Live data fetching from actual Rover
  useEffect(() => {
    if (!state.isLive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${state.roverIp}/telemetry`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
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

            return {
              ...prev,
              temperature,
              humidity,
              heading,
              direction,
              gas: rawGas,
              gasLevel,
              accelX: Number.isFinite(data.ax) ? Number(data.ax) : prev.accelX,
              accelY: Number.isFinite(data.ay) ? Number(data.ay) : prev.accelY,
              accelZ: Number.isFinite(data.az) ? Number(data.az) : prev.accelZ,
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
  }, [state.isLive, state.roverIp]);

  // Live simulation tick
  useEffect(() => {
    if (state.isLive || state.roverState === "emergency" || state.connection !== "connected") return;

    const interval = setInterval(() => {
      setState((prev) => {
        const isAutonomous = prev.mode === "autonomous";
        return {
          ...prev,
          battery: Math.max(0, prev.battery - 0.005),
          signal: Math.max(70, Math.min(99, prev.signal + (Math.random() - 0.5))),
          speed: isAutonomous ? Math.max(0.5, Math.min(2, prev.speed + (Math.random() - 0.5) * 0.2)) : prev.speed,
          distance: isAutonomous ? prev.distance + prev.speed * 0.5 : prev.distance,
          heading: isAutonomous ? (prev.heading + (Math.random() - 0.5) * 0.5 + 360) % 360 : prev.heading,
          motorTemp: Math.max(35, Math.min(65, prev.motorTemp + (Math.random() - 0.5) * 0.3)),
          missionElapsed: prev.missionElapsed + 1,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.roverState, state.connection, state.mode]);

  const handleEmergencyStop = () => {
    setState((prev) => ({
      ...prev,
      roverState: prev.roverState === "emergency" ? "standby" : "emergency",
      speed: 0,
      mode: "manual",
    }));
  };

  const handleModeChange = (mode: RoverMode) => {
    setState((prev) => ({ ...prev, mode }));
  };

  const simulateOffline = () => {
    setState((prev) => ({ ...prev, connection: "offline" }));
    setTimeout(() => {
      setState((prev) => ({ ...prev, connection: "reconnecting" }));
      setTimeout(() => {
        setState((prev) => ({ ...prev, connection: "connected" }));
      }, 3000);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
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
          missionElapsed={formatTime(state.missionElapsed)}
          onSimulateOffline={simulateOffline}
          onToggleLive={() => setState(s => ({ ...s, isLive: !s.isLive }))}
          onIpChange={(ip: string) => setState(s => ({ ...s, roverIp: ip }))}
        />
        
        <div className="flex-1 overflow-auto bg-gray-50">
          <OverviewPanel
            state={state}
            onEmergencyStop={handleEmergencyStop}
            onModeChange={handleModeChange}
          />
        </div>
        
        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
