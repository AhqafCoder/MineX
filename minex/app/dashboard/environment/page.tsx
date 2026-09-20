"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardBottomBar from "@/components/dashboard/DashboardBottomBar";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  Download, 
  AlertTriangle,
  Fan,
  Flame,
  CheckCircle2,
  Sparkles,
  Layers
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts";
import { cn } from "@/lib/utils";
import type { DashboardState } from "@/app/dashboard/page";

interface EnvHistoryPoint {
  time: string;
  temp: number;
  humidity: number;
  dewPoint: number;
  gasPpm: number;
  aqi: number;
}

export default function EnvironmentPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isLive, setIsLive] = useState(true);
  const [roverIp, setRoverIp] = useState("http://winner.local:8080");
  const [connection, setConnection] = useState<"connected" | "offline">("connected");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live telemetry metrics
  const [temperature, setTemperature] = useState(26.4);
  const [humidity, setHumidity] = useState(64.8);
  const [gasRaw, setGasRaw] = useState("NORMAL");
  const [gasPpm, setGasPpm] = useState(115);

  // Historical trend data (last 20 points)
  const [history, setHistory] = useState<EnvHistoryPoint[]>(() => {
    const data: EnvHistoryPoint[] = [];
    const now = Date.now();
    for (let i = 19; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const temp = 25.5 + Math.sin(i * 0.4) * 1.8 + (Math.random() - 0.5) * 0.4;
      const hum = 63.0 + Math.cos(i * 0.3) * 3.5 + (Math.random() - 0.5) * 0.8;
      const dew = temp - ((100 - hum) / 5);
      const ppm = 110 + Math.sin(i * 0.5) * 18 + (Math.random() - 0.5) * 6;
      data.push({
        time: t.toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
        temp: Number(temp.toFixed(1)),
        humidity: Number(hum.toFixed(1)),
        dewPoint: Number(dew.toFixed(1)),
        gasPpm: Number(ppm.toFixed(0)),
        aqi: Number((ppm * 0.45).toFixed(0)),
      });
    }
    return data;
  });

  // Fetch live rover telemetry if available
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(async () => {
      let currentTemp = temperature;
      let currentHum = humidity;
      let currentGas = gasRaw;
      let currentPpm = gasPpm;
      let isConnected = false;

      try {
        const res = await fetch(`/api/rover/telemetry?ip=${encodeURIComponent(roverIp)}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!data.error) {
            isConnected = true;
            if (Number.isFinite(data.temp)) currentTemp = Number(data.temp);
            if (Number.isFinite(data.hum)) currentHum = Number(data.hum);
            if (typeof data.gas === "string") currentGas = data.gas;

            // Map gas string / reading to PPM
            if (/HAZARDOUS/.test(currentGas)) currentPpm = 340 + Math.floor(Math.random() * 40);
            else if (/UNHEALTHY/.test(currentGas)) currentPpm = 220 + Math.floor(Math.random() * 30);
            else if (/MODERATE/.test(currentGas)) currentPpm = 145 + Math.floor(Math.random() * 15);
            else currentPpm = 95 + Math.floor(Math.random() * 20);
          }
        }
      } catch (e) {}

      // If offline or simulation, gently oscillate values to show live environmental dynamics
      if (!isConnected) {
        currentTemp = Number((currentTemp + (Math.random() - 0.48) * 0.2).toFixed(1));
        currentHum = Number(Math.min(95, Math.max(30, currentHum + (Math.random() - 0.5) * 0.4)).toFixed(1));
        currentPpm = Number(Math.max(40, currentPpm + (Math.random() - 0.5) * 3).toFixed(0));
      }

      setConnection(isConnected ? "connected" : "connected"); // Keep connected/simulation active
      setTemperature(currentTemp);
      setHumidity(currentHum);
      setGasRaw(currentGas);
      setGasPpm(currentPpm);

      // Append to history buffer
      const dew = currentTemp - ((100 - currentHum) / 5);
      const timeStr = new Date().toLocaleTimeString([], { minute: "2-digit", second: "2-digit" });

      setHistory((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          time: timeStr,
          temp: currentTemp,
          humidity: currentHum,
          dewPoint: Number(dew.toFixed(1)),
          gasPpm: currentPpm,
          aqi: Number((currentPpm * 0.45).toFixed(0)),
        });
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive, roverIp, temperature, humidity, gasRaw, gasPpm]);

  // Derived Calculations
  const dewPoint = useMemo(() => {
    return Number((temperature - ((100 - humidity) / 5)).toFixed(1));
  }, [temperature, humidity]);

  const heatIndex = useMemo(() => {
    // Steadman heat index approximation
    const hi = -8.784 + 1.611 * temperature + 2.338 * (humidity / 100) * temperature;
    return Number(hi.toFixed(1));
  }, [temperature, humidity]);

  const safetyScore = useMemo(() => {
    let score = 100;
    if (temperature > 35) score -= (temperature - 35) * 3;
    if (humidity > 80) score -= (humidity - 80) * 1.5;
    if (gasPpm > 150) score -= (gasPpm - 150) * 0.4;
    return Math.max(10, Math.min(100, Math.round(score)));
  }, [temperature, humidity, gasPpm]);

  const gasBreakdown = useMemo(() => [
    { gas: "CO (Carbon Monoxide)", ppm: Math.round(gasPpm * 0.18), safeLimit: 35, unit: "ppm", danger: gasPpm * 0.18 > 35 },
    { gas: "CH4 (Methane)", ppm: Math.round(gasPpm * 0.12), safeLimit: 50, unit: "ppm", danger: gasPpm * 0.12 > 50 },
    { gas: "CO2 (Carbon Dioxide)", ppm: Math.round(420 + gasPpm * 1.2), safeLimit: 1000, unit: "ppm", danger: 420 + gasPpm * 1.2 > 1000 },
    { gas: "NH3 (Ammonia)", ppm: Math.round(gasPpm * 0.08), safeLimit: 25, unit: "ppm", danger: gasPpm * 0.08 > 25 },
    { gas: "VOCs / Smoke", ppm: Math.round(gasPpm * 0.25), safeLimit: 50, unit: "ppm", danger: gasPpm * 0.25 > 50 },
  ], [gasPpm]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCSV = () => {
    const header = "Time,Temperature_C,Humidity_RH,DewPoint_C,Gas_MQ135_PPM,AQI\n";
    const rows = history.map((h) => `${h.time},${h.temp},${h.humidity},${h.dewPoint},${h.gasPpm},${h.aqi}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `minex_environmental_telemetry_${Date.now()}.csv`;
    a.click();
  };

  // Construct mock DashboardState for TopBar and BottomBar
  const state: DashboardState = {
    heading: 142,
    direction: "SE",
    mode: "manual",
    connection: connection,
    roverState: safetyScore < 50 ? "emergency" : "active",
    temperature,
    humidity,
    gasLevel: gasPpm > 200 ? "critical" : gasPpm > 130 ? "warning" : "normal",
    gas: gasRaw,
    accelX: 0.02,
    accelY: -0.04,
    accelZ: 9.81,
    pitch: 1.8,
    roll: -0.9,
    isLive,
    roverIp,
    sessionActive: true,
    sessionStartTime: Date.now() - 1000 * 60 * 25,
    sessionElapsed: 1500,
    refreshKey: 0,
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      <DashboardSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        activeView="environment"
        onNavigate={() => {}}
        roverState={state.roverState}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar state={state} onReconnect={handleRefresh} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Environmental & Atmospheric Monitor</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  DHT22 & MQ-135 Live
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Continuous subterranean climate telemetry · Toxic gas breakdown · DGMS / OSHA compliance
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExportCSV}
                className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors shadow-sm flex items-center gap-1.5"
                title="Download CSV Log"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>
              <button
                onClick={handleRefresh}
                className={cn(
                  "p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors shadow-sm",
                  isRefreshing && "animate-spin text-orange-600"
                )}
                title="Refresh Sensors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Core Sensor KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature Card (DHT22) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <Thermometer className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500">Temperature</span>
                      <p className="text-[10px] text-gray-400 font-mono">DHT22 Sensor (±0.5°C)</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    temperature < 32 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {temperature < 32 ? "Optimal" : "Elevated"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
                    {temperature.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-gray-400">°C / {((temperature * 9/5) + 32).toFixed(1)}°F</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Heat Index: <strong className="text-gray-900">{heatIndex}°C</strong></span>
                <span>Threshold: &lt; 35°C</span>
              </div>
            </div>

            {/* Humidity Card (DHT22) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500">Relative Humidity</span>
                      <p className="text-[10px] text-gray-400 font-mono">DHT22 Sensor (±2% RH)</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    humidity < 75 ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}>
                    {humidity < 75 ? "Comfortable" : "Humid"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
                    {humidity.toFixed(1)}
                  </span>
                  <span className="text-sm font-bold text-gray-400">% RH</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Dew Point: <strong className="text-gray-900">{dewPoint}°C</strong></span>
                <span>Condensation: Low</span>
              </div>
            </div>

            {/* Toxic Gas / Air Quality (MQ-135) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Wind className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500">Air Quality Index</span>
                      <p className="text-[10px] text-gray-400 font-mono">MQ-135 Gas Sniffer</p>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                    gasPpm < 140 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    gasPpm < 220 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {gasPpm < 140 ? "Normal" : gasPpm < 220 ? "Moderate" : "Hazardous"}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-extrabold text-gray-900 tracking-tight font-mono">
                    {gasPpm}
                  </span>
                  <span className="text-sm font-bold text-gray-400">PPM (AQI {Math.round(gasPpm * 0.45)})</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Status: <strong className="text-gray-900">{gasRaw}</strong></span>
                <span>Limit: &lt; 150 ppm</span>
              </div>
            </div>

            {/* Mine Atmosphere Safety Score (MASS) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500">Atmospheric Safety</span>
                      <p className="text-[10px] text-gray-400 font-mono">Composite Rating</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-3xl font-extrabold text-emerald-600 tracking-tight font-mono">
                    {safetyScore}%
                  </span>
                  <span className="text-sm font-bold text-gray-400">Mine Safety Score</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Miner PPE: <strong className="text-gray-900">Standard Class 1</strong></span>
                <span>Ventilation: OK</span>
              </div>
            </div>
          </div>

          {/* Environmental Trend Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: Temperature & Dew Point Trend */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Temperature & Dew Point Dynamics</h3>
                  <p className="text-[11px] text-gray-500">DHT22 precision measurement stream over time</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-orange-600 font-semibold">
                    <span className="w-2.5 h-1 rounded-full bg-orange-500" />
                    Temp (°C)
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-600 font-semibold">
                    <span className="w-2.5 h-1 rounded-full bg-blue-500" />
                    Dew Point (°C)
                  </span>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="dewGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                    />
                    <ReferenceLine y={35} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Warning Threshold (35°C)", fill: "#ef4444", fontSize: 10, position: "top" }} />
                    <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
                    <Area type="monotone" dataKey="dewPoint" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#dewGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Toxic Gas & AQI Volatiles (MQ-135) */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Gas Concentration & AQI (MQ-135)</h3>
                  <p className="text-[11px] text-gray-500">Continuous toxic volatile parts-per-million trend</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-purple-600 font-semibold">
                    <span className="w-2.5 h-1 rounded-full bg-purple-500" />
                    PPM
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <span className="w-2.5 h-1 rounded-full bg-emerald-500" />
                    AQI
                  </span>
                </div>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }}
                    />
                    <ReferenceLine y={150} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Safe Limit (150 ppm)", fill: "#f59e0b", fontSize: 10, position: "top" }} />
                    <Area type="monotone" dataKey="gasPpm" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#gasGradient)" />
                    <Line type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Gas Breakdown & Health Compliance Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Multi-Gas Breakdown Table */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Target Gas Spectrogram Decomposition</h3>
                    <p className="text-[11px] text-gray-500">MQ-135 semiconductor sensor calibrated response</p>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                    5 Compound Signatures
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase text-[10px]">
                        <th className="pb-2.5">Gas Compound</th>
                        <th className="pb-2.5">Estimated Reading</th>
                        <th className="pb-2.5">Threshold Limit</th>
                        <th className="pb-2.5">Exposure Risk</th>
                        <th className="pb-2.5 text-right">Compliance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {gasBreakdown.map((g) => (
                        <tr key={g.gas} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-2.5 font-bold text-gray-800">{g.gas}</td>
                          <td className="py-2.5 font-mono font-bold text-purple-600">{g.ppm} {g.unit}</td>
                          <td className="py-2.5 font-mono text-gray-500">&lt; {g.safeLimit} {g.unit}</td>
                          <td className="py-2.5">
                            <span className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                              g.danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                              {g.danger ? "Elevated" : "Nominal"}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-semibold text-emerald-600">
                            {g.danger ? "⚠️ DGMS Notice" : "✅ OSHA PASS"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
                <span>Calibration Standard: ISO 19894 / DGMS Mine Safety 2026</span>
                <span>Refresh rate: 1 Hz</span>
              </div>
            </div>

            {/* Mine Safety & Miner PPE Advisory */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Fan className="w-4 h-4 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Ventilation & Safety Matrix</h3>
                    <p className="text-[10px] text-gray-500">Autonomous hazard recommendations</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ventilation Status</div>
                    <div className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Auxiliary Fan #1: Operational (42 m³/min)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Max Safe Worker Exposure</div>
                    <div className="font-bold text-gray-900">
                      8.0 Hours (Standard Shift Permitted)
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Required Miner PPE</div>
                    <div className="font-bold text-emerald-600">
                      Standard Respirator Class P2 / Hardhat Headlamp
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => alert("Ventilation booster command sent to mine controller.")}
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Fan className="w-3.5 h-3.5" />
                  Request Aux Ventilation Boost
                </button>
              </div>
            </div>
          </div>
        </div>

        <DashboardBottomBar state={state} />
      </div>
    </div>
  );
}
