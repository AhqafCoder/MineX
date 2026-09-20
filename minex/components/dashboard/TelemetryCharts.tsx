"use client";

import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";
import { useState, useEffect, useRef } from "react";
import type { DashboardState } from "@/app/dashboard/page";

interface Props {
  state: DashboardState;
}

export default function TelemetryCharts({ state }: Props) {
  const [history, setHistory] = useState<any[]>([]);
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 1000) {
      lastUpdateRef.current = now;
      const newEntry = {
        time: new Date(now).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        gas: state.gasLevel === "normal" ? 100 : state.gasLevel === "warning" ? 150 : 250, // rough representation
        temp: state.temperature,
        hum: state.humidity,
        heading: state.heading,
      };

      setHistory(prev => {
        const next = [...prev, newEntry];
        if (next.length > 20) return next.slice(next.length - 20);
        return next;
      });
    }
  }, [state]);

  // Initial fill for empty state to make charts look nice before 20s elapsed
  useEffect(() => {
    if (history.length === 0) {
      const now = Date.now();
      const initial = Array.from({ length: 20 }, (_, i) => ({
        time: new Date(now - (20 - i) * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        gas: 100,
        temp: 24,
        hum: 55,
        heading: 0,
      }));
      setHistory(initial);
    }
  }, []);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Live Telemetry</h3>
            <p className="text-[10px] text-gray-500">Real-time sensor data streaming</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-100 rounded-md">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-bold text-green-600 tracking-wider">LIVE SYNC</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
        <ChartCard title="Air Quality" data={history} dataKey="gas" color="#10b981" fill="rgba(16, 185, 129, 0.1)" value={state.gas || "OFFLINE"} />
        <ChartCard title="Temperature (°C)" data={history} dataKey="temp" color="#3b82f6" fill="rgba(59, 130, 246, 0.1)" value={state.temperature.toFixed(1)} />
        <ChartCard title="Humidity (%)" data={history} dataKey="hum" color="#f59e0b" fill="rgba(245, 158, 11, 0.1)" value={state.humidity.toFixed(1)} />
        <ChartCard title="Heading" data={history} dataKey="heading" color="#8b5cf6" fill="rgba(139, 92, 246, 0.1)" value={`${state.heading.toFixed(0)}° ${state.direction}`} />
      </div>
    </div>
  );
}

function ChartCard({ title, data, dataKey, color, fill, value }: { title: string, data: any[], dataKey: string, color: string, fill: string, value: string }) {
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
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={fill} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
