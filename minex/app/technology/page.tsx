import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import RoverExplodedViewWrapper from "@/components/technology/RoverExplodedViewWrapper";

export const metadata = {
  title: "Technology — MineX",
};

const techSections = [
  {
    id: "01",
    title: "Edge AI Processing",
    subtitle: "On-Device Intelligence",
    desc: "MineX runs all critical AI inference, SLAM computation, sensor fusion, and decision-making locally on an NVIDIA Jetson or Raspberry Pi 4. Edge processing ensures low-latency responses and full operational continuity even without surface connectivity.",
    specs: ["NVIDIA Jetson / RPi 4", "TensorRT Quantization", "<100ms inference latency"],
  },
  {
    id: "02",
    title: "Computer Vision",
    subtitle: "YOLOv8 + Thermal + Night Vision",
    desc: "YOLOv8 with TensorRT quantization runs on-device, processing frames from both the FLIR Lepton 3.5 thermal camera and Arducam 8MP NOIR night vision camera. Thermal imaging detects human heat signatures while NOIR provides visual context in zero-light conditions.",
    specs: ["YOLOv8 TensorRT", "FLIR Lepton 3.5 Thermal", "Arducam 8MP NOIR"],
  },
  {
    id: "03",
    title: "3D SLAM & Navigation",
    subtitle: "GPS-Free Autonomous Mapping",
    desc: "A 2D RPI LiDAR and MPU-9250 (9-DOF IMU) feed into a Pose Graph SLAM pipeline via the ROS2 Nav2 stack. This enables real-time 3D reconstruction of multi-level mine tunnels, autonomous path planning, and obstacle avoidance — all without GPS.",
    specs: ["ROS2 Nav2 Stack", "Pose Graph SLAM", "2D RPI LiDAR 6M", "MPU-9250 9-DOF"],
  },
  {
    id: "04",
    title: "Underground Communication",
    subtitle: "Wi-Fi HaLow Mesh Network",
    desc: "IEEE 802.11ah Wi-Fi HaLow (Heltec modules) creates a self-healing mesh network with strategically placed relay nodes. This provides long-range, low-power communication underground. WebRTC enables two-way voice between surface operators and subsurface.",
    specs: ["IEEE 802.11ah Protocol", "Self-Healing Mesh", "WebRTC Two-Way Voice"],
  },
  {
    id: "05",
    title: "Multi-Gas Hazard Detection",
    subtitle: "Industrial-Grade Atmospheric Monitoring",
    desc: "Four dedicated industrial MEMS gas sensors continuously monitor methane (CH₄), carbon monoxide (CO), hydrogen sulfide (H₂S), and ozone (O₃). Gas concentration data is mapped onto the 3D SLAM model for visual hazard zone classification.",
    specs: ["MEMS CH₄", "Winsen ZE03-CO", "Fermion MEMS H₂S", "ASAIR AO-03"],
  },
  {
    id: "06",
    title: "Fault Tolerance & Autonomy",
    subtitle: "Auto-Retrace, Smart Docking & Self-Healing",
    desc: "Each subsystem runs as an independently supervised thread with automatic fault isolation and restart. When communication is lost, the rover retraces its SLAM path to the last known relay node. Smart docking stations enable autonomous recharging and data transfer.",
    specs: ["Auto-Retrace Navigation", "Smart Docking Station", "Self-Healing Threads"],
  },
];

export default function TechnologyPage() {
  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-white">
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 bg-white text-orange-600 text-sm font-semibold rounded-full mb-4 border border-gray-100">
              Deep Tech
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              The Engine Inside
            </h1>
            <p className="text-lg text-gray-500">
              Six core technology pillars enable MineX to operate autonomously in GPS-denied, communication-challenged underground mine environments.
            </p>
          </div>
        </section>

        {/* 3D Exploded View Section */}
        <section className="py-12 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <RoverExplodedViewWrapper />
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {techSections.map((tech) => (
              <div key={tech.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8">
                <div className="text-5xl font-bold text-gray-100">{tech.id}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-orange-600 mb-1">{tech.subtitle}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{tech.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-4">{tech.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tech.specs.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-full border border-gray-100">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
