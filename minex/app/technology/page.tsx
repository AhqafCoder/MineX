import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import RoverExplodedViewWrapper from "@/components/technology/RoverExplodedViewWrapper";

export const metadata = {
  title: "Technology — MineX",
};

const techSections = [
  {
    id: "01",
    title: "Onboard Compute & AI",
    subtitle: "NVIDIA Jetson / Raspberry Pi 4",
    desc: "MineX runs all critical AI inference, SLAM, and decision-making locally on high-performance edge nodes. This ensures low-latency responses and full operational continuity even in GPS-denied environments.",
    specs: ["NVIDIA Jetson / RPi 4", "Ubuntu 22.04 LTS", "C++ / Python"],
  },
  {
    id: "02",
    title: "Computer Vision & Thermal",
    subtitle: "YOLOv8 TensorRT Quantized",
    desc: "Advanced edge AI processes feeds from FLIR Lepton 3.5 and Arducam 8MP NOIR. This dual-vision setup detects trapped workers through thick smoke and absolute darkness.",
    specs: ["YOLOv8 TensorRT", "FLIR Lepton 3.5", "Arducam NOIR", "OpenCV / PyTorch"],
  },
  {
    id: "03",
    title: "3D SLAM & Navigation",
    subtitle: "ROS2 Nav2 Stack",
    desc: "Fusing data from a 2D RPI LiDAR (6M) and an MPU-9250 9-DOF IMU, the rover builds real-time 3D maps using Pose Graph SLAM and navigates autonomously.",
    specs: ["2D RPI LiDAR 6M", "MPU-9250 9-DOF IMU", "ROS2 Nav2", "Pose Graph SLAM"],
  },
  {
    id: "04",
    title: "Subsurface Communication",
    subtitle: "Wi-Fi HaLow Mesh Protocol",
    desc: "Connecting the surface dashboard, relay nodes, and rovers using IEEE 802.11ah Wi-Fi HaLow. If the mesh connection is lost, the rover's Auto-Retrace safely navigates back to the last node.",
    specs: ["Heltec Wi-Fi HaLow", "802.11ah Mesh", "Self-Healing", "Auto-Retrace"],
  },
  {
    id: "05",
    title: "Atmospheric Monitoring",
    subtitle: "Multi-Level Gas Mapping",
    desc: "An array of precision sensors continuously monitors hazardous gases. The data is mapped in 3D to create safe zones and alert rescue teams instantly.",
    specs: ["MEMS CH4", "Winsen ZE03-CO", "Fermion MEMS H2S", "ASAIR AO-03 O2"],
  },
  {
    id: "06",
    title: "Telemetry & Command",
    subtitle: "React, FastAPI, WebSockets",
    desc: "The surface control station receives live 3D maps, telemetry, and video feeds. It also features WebRTC for live two-way voice communication via docking stations.",
    specs: ["React.js / Next.js", "FastAPI / WebSockets", "WebRTC Audio", "Live Dashboard"],
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
              Six core technology pillars enable MineX to operate reliably in the world&apos;s most demanding environments.
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
