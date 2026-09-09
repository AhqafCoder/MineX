"use client";

import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { telemetryHistory } from "@/lib/mock-data";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function TelemetryCharts({ state }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Live Telemetry</h3>
            <p className="text-xs text-gray-500">Real-time sensor data streaming</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        <ChartCard title="Air Quality" data={telemetryHistory.gasLevel} color="#10b981" fill="rgba(16, 185, 129, 0.1)" value={state.gas || "OFFLINE"} />
        <ChartCard title="Temperature (°C)" data={telemetryHistory.speed} color="#3b82f6" fill="rgba(59, 130, 246, 0.1)" value={state.temperature.toFixed(1)} />
        <ChartCard title="Humidity (%)" data={telemetryHistory.battery} color="#f59e0b" fill="rgba(245, 158, 11, 0.1)" value={state.humidity.toFixed(1)} />
        <ChartCard title="Heading" data={telemetryHistory.signal} color="#8b5cf6" fill="rgba(139, 92, 246, 0.1)" value={`${state.heading.toFixed(0)}° ${state.direction}`} />
      </div>
    </div>
  );
}

function ChartCard({ title, data, color, fill, value }: { title: string, data: any[], color: string, fill: string, value: string }) {
  return (
    <div className="bg-white p-5 flex flex-col h-40">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</span>
        <span className="font-bold text-gray-900">{value}</span>
      </div>
      <div className="flex-1 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "12px", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              itemStyle={{ color: color, fontWeight: 'bold' }}
              labelStyle={{ display: 'none' }}
            />
            <Area type="monotone" dataKey="value" stroke={color} fill={fill} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
