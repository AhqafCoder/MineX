import React from 'react';
import { 
  Cpu, Thermometer, Compass, Camera, Wind, 
  Activity, ShieldAlert, RotateCcw, 
  Database, Cloud, Radio, Server,
  Scan, Crosshair, Users, Smartphone,
  ArrowRight
} from 'lucide-react';

export default function TechnicalApproach() {
  return (
    <div className="w-full bg-slate-50 p-4 md:p-8 rounded-3xl border border-slate-200 shadow-inner flex flex-col gap-6">
      
      {/* Top Half: Hardware, Software, Telemetry */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* 1. Hardware Integration */}
        <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
          <h3 className="font-bold text-blue-900 mb-1 ml-4 text-lg">Edge Computing & Hardware</h3>
          <p className="text-xs text-blue-600 mb-4 ml-4">Sensor data collection</p>
          
          <div className="space-y-3 relative z-10">
            {/* Sensor Items */}
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Activity size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">MPU-6050</div>
                <div className="text-[10px] text-slate-500 uppercase">Kinematics (I2C)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Compass size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">QMC6310</div>
                <div className="text-[10px] text-slate-500 uppercase">Orientation (I2C)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Thermometer size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">DHT22</div>
                <div className="text-[10px] text-slate-500 uppercase">Env Data (GPIO)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Camera size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">ESP32-CAM + MQ-135</div>
                <div className="text-[10px] text-slate-500 uppercase">Vision & Gas (Serial/GPIO)</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Software Architecture */}
        <div className="bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm relative flex flex-col justify-between">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
          <div>
            <h3 className="font-bold text-green-900 mb-1 ml-4 text-lg">Multi-Threaded Arch</h3>
            <p className="text-xs text-green-600 mb-4 ml-4">Asynchronous & Fault Tolerant</p>
            
            <div className="grid grid-cols-5 gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(t => (
                <div key={t} className="bg-green-50 border border-green-200 rounded text-center py-1">
                  <div className="text-[9px] font-bold text-green-700">T{t}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3 mb-6">
              <RotateCcw className="text-red-500 mt-1 shrink-0" size={16} />
              <div>
                <div className="text-xs font-bold text-red-700">Auto-Healing Fault Tolerance</div>
                <div className="text-[10px] text-red-500 leading-tight">If sensor fails → catch error, auto-reboot. Main system running.</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white shadow-md">
            <Cpu className="mx-auto mb-2 opacity-80" size={32} />
            <h4 className="font-bold">Raspberry Pi Edge Node</h4>
            <p className="text-[10px] text-green-100">Local Processing | Low Latency</p>
          </div>
        </div>

        {/* 3. Data Management */}
        <div className="bg-white rounded-2xl p-5 border-2 border-yellow-200 shadow-sm relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
          <h3 className="font-bold text-yellow-900 mb-1 ml-4 text-lg">Dual-Tier Telemetry</h3>
          <p className="text-xs text-yellow-600 mb-4 ml-4">Local logging & live broadcast</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <Database className="text-purple-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-purple-900">Local Storage (SQLite)</div>
                <div className="text-[10px] text-purple-600 leading-tight">Zero Data Loss. Logs all data locally even without internet.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Cloud className="text-emerald-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-emerald-900">Cloud Sync (MongoDB)</div>
                <div className="text-[10px] text-emerald-600 leading-tight">Fault-tolerant pipeline. Automatically syncs when Wi-Fi active.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
              <Radio className="text-rose-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-rose-900">Live Broadcast (TCP)</div>
                <div className="text-[10px] text-rose-600 leading-tight">Streams real-time JSON to operator control station.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: AI Vision System */}
      <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-sm relative w-full">
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">4</div>
        <h3 className="font-bold text-purple-900 mb-1 ml-4 text-lg">AI-Powered Vision System</h3>
        <p className="text-xs text-purple-600 mb-6 ml-4">On-device object detection for targeted rescue</p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Feed */}
          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100 w-full md:w-1/4">
            <Camera size={32} className="text-slate-600 mb-2" />
            <div className="font-bold text-sm text-slate-800">Camera Feed</div>
            <div className="text-[10px] text-slate-500">ESP32-CAM Stream</div>
          </div>
          
          <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
          
          {/* YOLO Model */}
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-100 w-full md:w-1/4">
            <Scan size={32} className="text-blue-600 mb-2" />
            <div className="font-bold text-sm text-blue-900">YOLOv8 Nano</div>
            <div className="text-[10px] text-blue-600 text-center">On-Device Machine Learning (yolov8n.pt)</div>
          </div>
          
          <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
          
          {/* Inference */}
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-100 w-full md:w-2/4">
            <div className="flex items-center gap-2 mb-3 w-full justify-center">
              <Crosshair size={20} className="text-purple-600" />
              <div className="font-bold text-sm text-purple-900">Targeted Rescue Inference</div>
            </div>
            <div className="flex gap-3 w-full">
              <div className="flex-1 bg-white rounded-lg p-2 flex items-center gap-2 border border-purple-100 shadow-sm">
                <Users className="text-green-600 shrink-0" size={16} />
                <div>
                  <div className="text-xs font-bold">Humans</div>
                  <div className="text-[9px] text-slate-500">Class 0</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 flex items-center gap-2 border border-purple-100 shadow-sm">
                <Smartphone className="text-blue-600 shrink-0" size={16} />
                <div>
                  <div className="text-xs font-bold">Phones</div>
                  <div className="text-[9px] text-slate-500">Class 67</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-slate-900 rounded-xl p-4 text-center">
        <h4 className="text-white font-bold tracking-widest text-sm mb-1">INTEGRATED SYSTEM FOR SEARCH & RESCUE</h4>
        <div className="text-slate-400 text-[10px] tracking-widest flex items-center justify-center gap-2 flex-wrap">
          <span>SENSE</span> <ArrowRight size={10} />
          <span>PROCESS</span> <ArrowRight size={10} />
          <span>ANALYZE</span> <ArrowRight size={10} />
          <span>STORE</span> <ArrowRight size={10} />
          <span>TRANSMIT</span> <ArrowRight size={10} />
          <span className="text-orange-400 font-bold">SAVE LIVES</span>
        </div>
      </div>

    </div>
  );
}
