"use client";

import { useState } from "react";
import LiveMapPanel from "@/components/dashboard/LiveMapPanel";
import RoverStatusPanel from "@/components/dashboard/RoverStatusPanel";
import RoverVisionPanel from "@/components/dashboard/RoverVisionPanel";
import SafetyIntelPanel from "@/components/dashboard/SafetyIntelPanel";
import RoverControlPanel from "@/components/dashboard/RoverControlPanel";
import MissionPanel from "@/components/dashboard/MissionPanel";
import AlertCenter from "@/components/dashboard/AlertCenter";
import TelemetryCharts from "@/components/dashboard/TelemetryCharts";
import SystemHealthPanel from "@/components/dashboard/SystemHealthPanel";
import type { DashboardState, RoverMode } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
  onEmergencyStop: () => void;
  onModeChange: (mode: RoverMode) => void;
}

export default function OverviewPanel({ state, onEmergencyStop, onModeChange }: Props) {
  return (
    <div className="p-6 grid grid-cols-12 gap-6 min-h-full">
      {/* Row 1: Map + Right panel */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9">
        <LiveMapPanel state={state} />
      </div>

      {/* Right column */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
        <RoverStatusPanel state={state} />
        <MissionPanel state={state} />
        <AlertCenter />
      </div>

      {/* Row 2: Vision + Safety + Control */}
      <div className="col-span-12 lg:col-span-5 xl:col-span-4">
        <RoverVisionPanel state={state} />
      </div>

      <div className="col-span-12 lg:col-span-4 xl:col-span-4">
        <SafetyIntelPanel state={state} />
      </div>

      <div className="col-span-12 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
        <RoverControlPanel
          state={state}
          onEmergencyStop={onEmergencyStop}
          onModeChange={onModeChange}
        />
        <SystemHealthPanel state={state} />
      </div>

      {/* Row 3: Telemetry charts */}
      <div className="col-span-12">
        <TelemetryCharts state={state} />
      </div>
    </div>
  );
}
