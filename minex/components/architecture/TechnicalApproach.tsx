import React from 'react';
import { 
  Cpu, Thermometer, Compass, Camera, Wind, 
  Activity, ShieldAlert, RotateCcw, 
  Database, Cloud, Radio, Server,
  Scan, Crosshair, Users, Smartphone,
  ArrowRight, Flame, Radar, Eye
} from 'lucide-react';

export default function TechnicalApproach() {
  return (
    <div className="w-full bg-slate-50 p-4 md:p-8 rounded-3xl border border-slate-200 shadow-inner flex flex-col gap-6">
      
      {/* Top Half: Hardware, Software, Telemetry */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* 1. Hardware Integration */}
        <div className="bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-sm relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">1</div>
          <h3 className="font-bold text-blue-900 mb-1 ml-4 text-lg">Sensing & Hardware</h3>
          <p className="text-xs text-blue-600 mb-4 ml-4">Multi-modal data acquisition</p>
          
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Radar size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">2D RPI LiDAR 6M</div>
                <div className="text-[10px] text-slate-500 uppercase">3D Mapping & Navigation</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-md"><Activity size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">MPU-9250 (9-DOF)</div>
                <div className="text-[10px] text-slate-500 uppercase">IMU + Magnetometer (I2C)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-red-100 text-red-700 rounded-md"><Flame size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">FLIR Lepton 3.5 + Arducam NOIR</div>
                <div className="text-[10px] text-slate-500 uppercase">Thermal + Night Vision</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-orange-100 text-orange-700 rounded-md"><Wind size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">MEMS CH₄ · CO · H₂S · O₃</div>
                <div className="text-[10px] text-slate-500 uppercase">Multi-Gas Monitoring (GPIO/ADC)</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-md"><Radio size={18} /></div>
              <div>
                <div className="text-sm font-bold text-slate-800">Heltec Wi-Fi HaLow (802.11ah)</div>
                <div className="text-[10px] text-slate-500 uppercase">Long-Range Mesh Communication</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Software Architecture */}
        <div className="bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm relative flex flex-col justify-between">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">2</div>
          <div>
            <h3 className="font-bold text-green-900 mb-1 ml-4 text-lg">Multi-Threaded Arch</h3>
            <p className="text-xs text-green-600 mb-4 ml-4">ROS2 Nav2 + Fault Tolerant</p>
            
            <div className="grid grid-cols-3 gap-1 mb-2">
              {['SLAM', 'Vision', 'Gas'].map(t => (
                <div key={t} className="bg-green-50 border border-green-200 rounded text-center py-1">
                  <div className="text-[9px] font-bold text-green-700">{t}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {['Comms', 'IMU', 'Nav'].map(t => (
                <div key={t} className="bg-green-50 border border-green-200 rounded text-center py-1">
                  <div className="text-[9px] font-bold text-green-700">{t}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3 mb-4">
              <RotateCcw className="text-red-500 mt-1 shrink-0" size={16} />
              <div>
                <div className="text-xs font-bold text-red-700">Auto-Healing + Auto-Retrace</div>
                <div className="text-[10px] text-red-500 leading-tight">If sensor fails → auto-restart. If comms lost → SLAM retrace home.</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white shadow-md">
            <Cpu className="mx-auto mb-2 opacity-80" size={32} />
            <h4 className="font-bold">NVIDIA Jetson / RPi 4</h4>
            <p className="text-[10px] text-green-100">Edge AI · SLAM · Decision Making</p>
          </div>
        </div>

        {/* 3. Data & Communication */}
        <div className="bg-white rounded-2xl p-5 border-2 border-yellow-200 shadow-sm relative">
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">3</div>
          <h3 className="font-bold text-yellow-900 mb-1 ml-4 text-lg">Data & Communication</h3>
          <p className="text-xs text-yellow-600 mb-4 ml-4">Local storage, mesh relay, and live broadcast</p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <Database className="text-purple-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-purple-900">Local Edge Storage</div>
                <div className="text-[10px] text-purple-600 leading-tight">Zero data loss. All telemetry logged locally on-device.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Radio className="text-blue-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-blue-900">Wi-Fi HaLow Mesh Network</div>
                <div className="text-[10px] text-blue-600 leading-tight">802.11ah self-healing mesh with relay nodes for underground comms.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Server className="text-emerald-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-emerald-900">WebRTC Two-Way Voice</div>
                <div className="text-[10px] text-emerald-600 leading-tight">Real-time voice communication between surface and subsurface.</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
              <Cloud className="text-rose-600 mt-1 shrink-0" size={20} />
              <div>
                <div className="text-sm font-bold text-rose-900">Surface Dashboard</div>
                <div className="text-[10px] text-rose-600 leading-tight">Live telemetry, 3D mine map, and rover controls via command center.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Half: AI Vision System */}
      <div className="bg-white rounded-2xl p-5 border-2 border-purple-200 shadow-sm relative w-full">
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-md">4</div>
        <h3 className="font-bold text-purple-900 mb-1 ml-4 text-lg">AI-Powered Vision & Detection</h3>
        <p className="text-xs text-purple-600 mb-6 ml-4">Multi-modal detection for targeted rescue</p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Feed Sources */}
          <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl border border-slate-100 w-full md:w-1/4">
            <Camera size={32} className="text-slate-600 mb-2" />
            <div className="font-bold text-sm text-slate-800">Camera Feeds</div>
            <div className="text-[10px] text-slate-500 text-center">Thermal + NOIR + Visual</div>
          </div>
          
          <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
          
          {/* YOLO Model */}
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl border border-blue-100 w-full md:w-1/4">
            <Scan size={32} className="text-blue-600 mb-2" />
            <div className="font-bold text-sm text-blue-900">YOLOv8 TensorRT</div>
            <div className="text-[10px] text-blue-600 text-center">On-Device Edge AI Inference</div>
          </div>
          
          <ArrowRight className="text-slate-300 hidden md:block shrink-0" size={24} />
          
          {/* Inference Results */}
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl border border-purple-100 w-full md:w-2/4">
            <div className="flex items-center gap-2 mb-3 w-full justify-center">
              <Crosshair size={20} className="text-purple-600" />
              <div className="font-bold text-sm text-purple-900">Detection & Classification</div>
            </div>
            <div className="flex gap-3 w-full">
              <div className="flex-1 bg-white rounded-lg p-2 flex items-center gap-2 border border-purple-100 shadow-sm">
                <Users className="text-green-600 shrink-0" size={16} />
                <div>
                  <div className="text-xs font-bold">Humans</div>
                  <div className="text-[9px] text-slate-500">Thermal + Visual</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 flex items-center gap-2 border border-purple-100 shadow-sm">
                <Wind className="text-red-600 shrink-0" size={16} />
                <div>
                  <div className="text-xs font-bold">Gas Hazards</div>
                  <div className="text-[9px] text-slate-500">CH₄ · CO · H₂S</div>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 flex items-center gap-2 border border-purple-100 shadow-sm">
                <Eye className="text-blue-600 shrink-0" size={16} />
                <div>
                  <div className="text-xs font-bold">Obstacles</div>
                  <div className="text-[9px] text-slate-500">LiDAR Detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="bg-slate-900 rounded-xl p-4 text-center">
        <h4 className="text-white font-bold tracking-widest text-sm mb-1">AUTONOMOUS MINE SAFETY & RESCUE SYSTEM</h4>
        <div className="text-slate-400 text-[10px] tracking-widest flex items-center justify-center gap-2 flex-wrap">
          <span>SENSE</span> <ArrowRight size={10} />
          <span>UNDERSTAND</span> <ArrowRight size={10} />
          <span>DECIDE</span> <ArrowRight size={10} />
          <span>ACT</span> <ArrowRight size={10} />
          <span className="text-orange-400 font-bold">SAVE LIVES</span>
        </div>
      </div>

    </div>
  );
}
