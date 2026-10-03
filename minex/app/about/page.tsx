import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import TechnicalApproach from "@/components/architecture/TechnicalApproach";
import Image from "next/image";
import { 
  ScanSearch, Timer,
  ShieldAlert, AlertTriangle,
  Database, ShieldCheck,
  Settings, RotateCcw,
  Coins, BarChart3,
  Cpu, Code2, ScanFace, TrendingUp, 
  Laptop, CheckCircle2, Gauge, Cuboid,
  Radar, Radio, Flame
} from "lucide-react";

export const metadata = {
  title: "About — MineX",
};

interface CardProps {
  theme: "red" | "orange" | "green" | "blue" | "purple";
  title: string;
  desc: string;
  footerText: string;
  icon: React.ReactNode;
  footerIcon: React.ReactNode;
  className?: string;
}

function DiagramCard({ theme, title, desc, footerText, icon, footerIcon, className = "" }: CardProps) {
  const colors = {
    red: { border: "border-red-500", headerBg: "bg-red-500", iconBg: "bg-red-600", footerBg: "bg-red-100", text: "text-red-700" },
    orange: { border: "border-orange-500", headerBg: "bg-orange-500", iconBg: "bg-orange-600", footerBg: "bg-orange-100", text: "text-orange-700" },
    green: { border: "border-green-500", headerBg: "bg-green-500", iconBg: "bg-green-600", footerBg: "bg-green-100", text: "text-green-700" },
    blue: { border: "border-blue-500", headerBg: "bg-blue-500", iconBg: "bg-blue-600", footerBg: "bg-blue-100", text: "text-blue-700" },
    purple: { border: "border-purple-500", headerBg: "bg-purple-500", iconBg: "bg-purple-600", footerBg: "bg-purple-100", text: "text-purple-700" },
  }[theme];

  return (
    <div className={`rounded-2xl border-[3px] bg-white flex flex-col relative ${colors.border} shadow-sm ${className}`}>
      <div className={`${colors.headerBg} text-white flex items-center pl-14 pr-4 py-3 min-h-[56px] rounded-t-xl relative`}>
        <div className={`absolute -left-5 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white flex items-center justify-center shadow-md ${colors.iconBg}`}>
          {icon}
        </div>
        <h3 className="font-bold text-sm md:text-base uppercase tracking-wide leading-tight">{title}</h3>
      </div>
      <div className="p-5 text-sm text-gray-600 font-medium leading-relaxed bg-white flex-1">
        {desc}
      </div>
      <div className={`${colors.footerBg} ${colors.text} px-5 py-2.5 flex items-center justify-center gap-2 font-bold text-xs md:text-sm uppercase tracking-wide rounded-b-xl`}>
        {footerIcon}
        {footerText}
      </div>
    </div>
  );
}

interface FeasibilityItemProps {
  theme: "green" | "blue";
  title: string;
  desc: string;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  rightLabel: string;
}

function FeasibilityItem({ theme, title, desc, leftIcon, rightIcon, rightLabel }: FeasibilityItemProps) {
  const isGreen = theme === "green";
  const bgColors = isGreen ? "bg-gradient-to-r from-green-50/50 to-white" : "bg-gradient-to-r from-blue-50/50 to-white";
  const iconColors = isGreen ? "text-green-600 border-green-100" : "text-blue-600 border-blue-100";
  const rightBg = isGreen ? "bg-green-100/50" : "bg-blue-100/50";
  const rightText = isGreen ? "text-green-700" : "text-blue-700";

  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl mb-3 ${bgColors} border ${isGreen ? 'border-green-100' : 'border-blue-100'} shadow-sm bg-white`}>
      {/* Left Icon */}
      <div className={`w-14 h-14 shrink-0 rounded-full bg-white flex items-center justify-center border-2 ${iconColors} shadow-sm`}>
        {leftIcon}
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-sm md:text-base mb-1">{title}</h4>
        <p className="text-[13px] text-gray-600 leading-relaxed">{desc}</p>
      </div>
      
      {/* Right Badge */}
      <div className={`w-[88px] shrink-0 flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl text-center ${rightBg}`}>
        <div className={`bg-white rounded-full p-1.5 shadow-sm ${rightText}`}>
          {rightIcon}
        </div>
        <span className={`text-[10px] font-bold uppercase leading-tight ${rightText}`}>{rightLabel}</span>
      </div>
    </div>
  );
}


export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-white">
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-orange-600 text-sm font-semibold rounded-full mb-4">
              About MineX
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Autonomous reconnaissance for underground mine safety.
            </h1>
            <p className="text-lg text-gray-500 mb-12">
              MineX is an AI-powered autonomous rover designed to perform remote reconnaissance in 
              GPS-denied underground mine environments — detecting trapped workers, mapping tunnel 
              structures, and monitoring atmospheric hazards so that rescue teams can operate with 
              full situational awareness.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed">
                To reduce responder exposure to hazardous underground environments by enabling 
                autonomous reconnaissance before human entry. MineX combines thermal AI, LiDAR 
                SLAM, and multi-gas monitoring to provide real-time situational awareness that 
                saves lives and accelerates rescue operations.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-3xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed">
                A future where autonomous rover fleets with Wi-Fi HaLow mesh communication 
                continuously monitor underground mines — building real-time 3D hazard maps, 
                detecting atmospheric threats, and alerting operators instantly. Applicable 
                across coal, metal, and mineral mining sectors nationwide.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Diagram Section */}
        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The MineX Rover Capabilities</h2>
              <p className="text-gray-500">Core capabilities of the autonomous architecture</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-x-8 gap-y-12 items-center">
              
              <div className="flex flex-col gap-10 lg:pl-4">
                <DiagramCard
                  theme="red"
                  title="Thermal + AI Survivor Detection"
                  desc="FLIR Lepton 3.5 thermal camera combined with YOLOv8 (TensorRT) actively detects human heat signatures through smoke, dust, and darkness — significantly reducing search time in disaster zones."
                  footerText="Faster Rescue Missions"
                  icon={<Flame size={32} />}
                  footerIcon={<Timer size={18} />}
                />
                <DiagramCard
                  theme="orange"
                  title="Multi-Gas Hazard Monitoring"
                  desc="Industrial MEMS sensors continuously monitor CH₄, CO, H₂S, and O₃ levels with automated hazard zone classification. Gas data is mapped onto the 3D SLAM model for visual hazard overlays."
                  footerText="Proactive Safety"
                  icon={<ShieldAlert size={32} />}
                  footerIcon={<AlertTriangle size={18} />}
                />
              </div>

              <div className="flex flex-col items-center gap-10">
                <div className="relative w-full aspect-square max-w-sm lg:max-w-md bg-gray-50/50 rounded-full flex items-center justify-center p-8">
                  <Image 
                    src="/minex-rover.png" 
                    alt="MineX Rover Centerpiece" 
                    fill 
                    className="object-contain p-4 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
                    priority
                  />
                </div>
                
                <DiagramCard
                  theme="purple"
                  title="Modular & Scalable Design"
                  desc="Built on modular, replaceable components — enabling field-level repairs, easy replication, and fleet deployment. Supports additional rovers, relay nodes, and sensor payloads for large-scale operations."
                  footerText="Fleet-Ready Platform"
                  icon={<Coins size={32} />}
                  footerIcon={<BarChart3 size={18} />}
                  className="w-full lg:w-11/12"
                />
              </div>

              <div className="flex flex-col gap-10 lg:pr-4">
                <DiagramCard
                  theme="green"
                  title="GPS-Free 3D SLAM Mapping"
                  desc="LiDAR + MPU-9250 IMU feed into a Pose Graph SLAM pipeline via ROS2 Nav2, building real-time 3D maps of multi-level tunnel structures — enabling autonomous navigation without GPS."
                  footerText="Underground Navigation"
                  icon={<Radar size={32} />}
                  footerIcon={<ShieldCheck size={18} />}
                />
                <DiagramCard
                  theme="blue"
                  title="Auto-Retrace & Smart Docking"
                  desc="When communication is lost, the rover autonomously retraces its SLAM path to the last mesh node. Smart docking stations enable autonomous recharging, data transfer, and continuous monitoring."
                  footerText="Mission Resilience"
                  icon={<Settings size={32} />}
                  footerIcon={<RotateCcw size={18} />}
                />
              </div>

            </div>
          </div>
        </section>

        {/* TECHNICAL APPROACH DIAGRAM */}
        <section className="py-24 px-6 bg-white overflow-hidden border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1.5 bg-gray-50 text-blue-600 text-sm font-semibold rounded-full mb-4">
                Architecture
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Approach</h2>
              <p className="text-gray-500">A comprehensive overview of hardware integration, software architecture, and AI pipeline.</p>
            </div>
            
            <TechnicalApproach />
          </div>
        </section>

        {/* FEASIBILITY AND VIABILITY */}
        <section className="py-24 px-6 bg-gray-50 overflow-hidden relative">
          <div className="max-w-7xl mx-auto pb-40">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-16 tracking-wide uppercase">
              Feasibility and Viability
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              
              {/* Left Column — Technical Feasibility (Green) */}
              <div className="border-[4px] border-green-500 rounded-[2rem] p-6 lg:p-8 bg-white shadow-xl flex flex-col gap-1">
                <FeasibilityItem 
                  theme="green"
                  title="Ruggedized All-Terrain Mobility"
                  desc="BLDC motors with tank chassis support movement across uneven terrain, mud, dust, and debris. Replaceable modules simplify field-level maintenance and repairs."
                  leftIcon={<Cpu size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Field Ready"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Established Sensor & Embedded Hardware"
                  desc="Built on proven components (Jetson, LiDAR, FLIR, MEMS sensors) with modular architecture for subsystem development, testing, and replacement."
                  leftIcon={<Radar size={28} />}
                  rightIcon={<Coins size={20} />}
                  rightLabel="Proven Tech"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Edge Processing Reduces Connectivity Dependency"
                  desc="All critical AI inference, SLAM, and decision-making runs on the edge — reducing dependence on continuous surface connectivity."
                  leftIcon={<ScanFace size={28} />}
                  rightIcon={<Gauge size={20} />}
                  rightLabel="Low Latency"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Thermal + Visual Multi-Modal Sensing"
                  desc="Thermal and night vision cameras support reconnaissance in low-visibility conditions. LiDAR + IMU + SLAM enable mapping in GPS-denied environments."
                  leftIcon={<Flame size={28} />}
                  rightIcon={<Cuboid size={20} />}
                  rightLabel="Multi-Modal"
                />
              </div>

              {/* Right Column — Operational Viability (Blue) */}
              <div className="border-[4px] border-blue-500 rounded-[2rem] p-6 lg:p-8 bg-white shadow-xl flex flex-col gap-1">
                <FeasibilityItem 
                  theme="blue"
                  title="Auto-Retrace & SLAM Fallback"
                  desc="Manual control and SLAM-based retrace provide fallback during system failures. If comms are lost, the rover safely returns to the last relay node."
                  leftIcon={<RotateCcw size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Safe Return"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Scalable Mesh Communication"
                  desc="Wi-Fi HaLow relay nodes and docking stations enable expandable communication coverage. Additional rovers and sensor payloads can scale future deployments."
                  leftIcon={<Radio size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Expandable"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Fault-Tolerant & Auto-Healing"
                  desc="Multi-threaded architecture isolates subsystem failures, ensuring the rover continues operating even if individual sensors are damaged."
                  leftIcon={<Settings size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Always Running"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Deployment-Ready for Multiple Sectors"
                  desc="Applicable to government/PSU mining, private mining operations, and can be configured for coal, metal, and mineral mining conditions."
                  leftIcon={<ShieldCheck size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Multi-Sector"
                />
              </div>
            </div>

            {/* Overlapping Rover at bottom center */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[700px] h-[350px] pointer-events-none z-20">
              <Image 
                src="/minex-rover.png" 
                alt="MineX Rover" 
                fill 
                className="object-contain drop-shadow-2xl" 
                priority
              />
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
