"use client";

import RoverVisionPanel from "@/components/dashboard/RoverVisionPanel";
import SafetyIntelPanel from "@/components/dashboard/SafetyIntelPanel";
import RoverControlPanel from "@/components/dashboard/RoverControlPanel";
import TelemetryCharts from "@/components/dashboard/TelemetryCharts";
import type { DashboardState, RoverMode } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
  onEmergencyStop: () => void;
  onModeChange: (mode: RoverMode) => void;
}

export default function OverviewPanel({ state, onEmergencyStop, onModeChange }: Props) {
  return (
    <div className="p-4 pb-2 flex flex-col gap-4">
      {/* Top Row: Camera | Safety Intel | Rover Control — equal thirds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <RoverVisionPanel state={state} />
        <SafetyIntelPanel state={state} />
        <RoverControlPanel
          state={state}
          onEmergencyStop={onEmergencyStop}
          onModeChange={onModeChange}
        />
      </div>

      {/* Bottom: Full-width Telemetry Charts */}
      <TelemetryCharts state={state} />
    </div>
  );
}
