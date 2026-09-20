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
  Laptop, CheckCircle2, Gauge, Cuboid
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
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Making hazardous environments safer for everyone.
            </h1>
            <p className="text-lg text-gray-500 mb-12">
              We believe that no human should have to risk their life in unstable mines 
              or disaster zones when smart, affordable robotics can do the scouting for them.
            </p>
          </div>
        </section>

        <section className="py-16 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-3xl mb-4">🎯</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-500 leading-relaxed">
                To build intelligent robotic systems that go where humans cannot — gathering critical data, locating survivors, and monitoring hazards so that first responders can make better decisions with less risk.
              </p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <div className="text-3xl mb-4">🌍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-500 leading-relaxed">
                A future where autonomous rover fleets operate continuously in hazardous environments — building real-time maps, monitoring conditions, and alerting operators instantly when something changes.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Diagram Section */}
        <section className="py-24 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The MineX Rover Capabilities</h2>
              <p className="text-gray-500">An overview of our autonomous architecture</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-x-8 gap-y-12 items-center">
              
              <div className="flex flex-col gap-10 lg:pl-4">
                <DiagramCard
                  theme="red"
                  title="Rapid Survivor Location"
                  desc="Edge-AI (YOLOv8) actively hunts for humans and cell phones, significantly reducing search times in visually chaotic disaster zones or collapsed structures."
                  footerText="Faster Rescue Missions"
                  icon={<ScanSearch size={32} />}
                  footerIcon={<Timer size={18} />}
                />
                <DiagramCard
                  theme="orange"
                  title="Proactive Hazard Prevention"
                  desc="Continuous, real-time streaming of temperature and hazardous gas levels (MQ-135) keeps first responders and miners out of harm's way until an area is definitively proven safe."
                  footerText="Safer Operations"
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
                  title="Cost-Effective Scalability"
                  desc="Built on low-cost hardware (Raspberry Pi, ESP32) and open-source frameworks, making it highly affordable to mass-produce and deploy swarms of these rovers in emergency scenarios."
                  footerText="Affordable at Scale"
                  icon={<Coins size={32} />}
                  footerIcon={<BarChart3 size={18} />}
                  className="w-full lg:w-11/12"
                />
              </div>

              <div className="flex flex-col gap-10 lg:pr-4">
                <DiagramCard
                  theme="green"
                  title="Zero Data Loss Guarantee"
                  desc="Offline-first, dual-database architecture ensures that critical telemetry is never lost. Even during total network blackouts deep in mining shafts, data is safely preserved on the local node."
                  footerText="Reliable & Secure Data"
                  icon={<Database size={32} />}
                  footerIcon={<ShieldCheck size={18} />}
                />
                <DiagramCard
                  theme="blue"
                  title="Mission-Critical Durability"
                  desc="A highly resilient, auto-healing multi-threaded system. If a sensor is physically crushed or short-circuits, the software automatically isolates the failure so the rest of the rover continues operating without crashing."
                  footerText="Continuous Operation"
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
              <p className="text-gray-500">A comprehensive overview of our hardware integration, software architecture, and AI pipeline.</p>
            </div>
            
            <TechnicalApproach />
          </div>
        </section>

        {/* FEASIBILITY AND VIABILITY DIAGRAM */}
        <section className="py-24 px-6 bg-gray-50 overflow-hidden relative">
          <div className="max-w-7xl mx-auto pb-40">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-16 tracking-wide uppercase">
              Feasibility and Viability
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
              
              {/* Left Column (Green) */}
              <div className="border-[4px] border-green-500 rounded-[2rem] p-6 lg:p-8 bg-white shadow-xl flex flex-col gap-1">
                <FeasibilityItem 
                  theme="green"
                  title="Low-Cost & Readily Available Hardware"
                  desc="Built using affordable and widely available hardware (Raspberry Pi, ESP32-CAM, standard sensors), making it cost-effective and easy to deploy at scale."
                  leftIcon={<Cpu size={28} />}
                  rightIcon={<Coins size={20} />}
                  rightLabel="Cost Effective"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Open-Source Ecosystem"
                  desc="Relies entirely on robust open-source frameworks (Python, OpenCV, Ultralytics YOLOv8), eliminating expensive licensing fees and enabling community support."
                  leftIcon={<Code2 size={28} />}
                  rightIcon={<Code2 size={20} />}
                  rightLabel="No Licensing Fees"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Optimized for Edge Execution"
                  desc="YOLOv8 runs efficiently on the Raspberry Pi, providing real-time detection of humans and cell phones without the need for high-power GPUs."
                  leftIcon={<ScanFace size={28} />}
                  rightIcon={<Gauge size={20} />}
                  rightLabel="Lightweight & Efficient"
                />
                <FeasibilityItem 
                  theme="green"
                  title="Scalable & Deployable"
                  desc="Modular design allows easy replication and mass deployment, enabling multiple rovers to work together in large disaster or mining areas."
                  leftIcon={<TrendingUp size={28} />}
                  rightIcon={<Cuboid size={20} />}
                  rightLabel="Scalable Solution"
                />
              </div>

              {/* Right Column (Blue) */}
              <div className="border-[4px] border-blue-500 rounded-[2rem] p-6 lg:p-8 bg-white shadow-xl flex flex-col gap-1">
                <FeasibilityItem 
                  theme="blue"
                  title="Offline-First Architecture"
                  desc="Dual-database system (SQLite + MongoDB) ensures zero data loss, even during total network blackouts in underground or disaster-hit areas."
                  leftIcon={<Database size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Zero Data Loss"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Independent Local Access"
                  desc="Built-in TCP server allows direct connection from a laptop/control station to monitor real-time data without requiring an active internet connection."
                  leftIcon={<Laptop size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Works Offline"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Fault-Tolerant & Auto-Healing"
                  desc="Multi-threaded architecture isolates sensor failures, ensuring the rover continues operating even if a sensor is damaged or short-circuits."
                  leftIcon={<Settings size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Always Running"
                />
                <FeasibilityItem 
                  theme="blue"
                  title="Mission-Ready for Real-World Use"
                  desc="Rugged, modular and resilient design built for harsh environments like collapsed structures and mining shafts."
                  leftIcon={<ShieldCheck size={28} />}
                  rightIcon={<CheckCircle2 size={20} />}
                  rightLabel="Reliable & Robust"
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
