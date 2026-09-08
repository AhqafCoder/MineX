import Image from "next/image";
import Link from "next/link";
import { features } from "../lib/data";

export const metadata = {
  title: "Features — MineX Rover",
  description:
    "Explore all 6 core features of the MineX rover — 4K night vision, real-time streaming, smart navigation, gas detection, extended runtime, and rugged design.",
};

// Tech stack badges data
const techStack = [
  { label: "Arduino", color: "#00979D" },
  { label: "Jetson Nano", color: "#76B900" },
  { label: "RPLidar", color: "#E53935" },
  { label: "React", color: "#61DAFB", textColor: "#1a1a2e" },
  { label: "Next.js", color: "#000000" },
  { label: "Wi-Fi 6", color: "#1565C0" },
  { label: "LoRa RF", color: "#7B1FA2" },
];

export default function FeaturesPage() {
  return (
    <>
      {/* ── Page Banner ───────────────────────── */}
      <section
        style={{
          padding: "5rem 5% 4rem",
          background:
            "linear-gradient(135deg, #0d1b2a 0%, #1a237e 50%, #1b0000 100%)",
          textAlign: "center",
        }}
      >
        <div
          className="section-tag"
          style={{
            background: "rgba(229,57,53,0.15)",
            color: "#ef9a9a",
            border: "1px solid rgba(229,57,53,0.3)",
          }}
        >
          Core Capabilities
        </div>
        <h1
          className="section-title"
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            marginTop: "0.5rem",
            color: "#ffffff",
          }}
        >
          Built for the{" "}
          <span className="gradient-text">Extreme</span>
        </h1>
        <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.75)" }}>
          Every feature of MineX is engineered with a single mission — keep miners safe by replacing
          humans in the most dangerous underground conditions.
        </p>
      </section>

      {/* ── Core Sensor Suite Highlight ────────────────── */}
      <section style={{ padding: "5rem 5%", background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div className="section-header" style={{ marginBottom: "4rem" }}>
          <div className="section-tag" style={{ background: "rgba(25, 118, 210, 0.1)", color: "var(--primary-blue)" }}>
            Real-Time Telemetry
          </div>
          <h2 className="section-title">
            Advanced <span className="gradient-text">Sensor Suite</span>
          </h2>
          <p className="section-subtitle">
            MineX is equipped with an array of industrial-grade sensors and AI vision models to detect every conceivable underground hazard before humans enter.
          </p>
        </div>

        <div className="sensor-suite-grid">
          {/* Left Column Sensors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)", padding: "1.8rem", borderRadius: "16px", border: "1px solid #e9ecef", borderRight: "4px solid #f57c00", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", position: "relative", textAlign: "right" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f57c00", boxShadow: "0 0 8px #f57c00", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f57c00", textTransform: "uppercase", letterSpacing: "0.05em" }}>Climate active</span>
              </div>
              <div style={{ color: "#f57c00", marginBottom: "1rem" }}>
                {/* Thermometer SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                  <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--dark-text)", marginBottom: "0.5rem" }}>Temperature & Humidity</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
                Continuous DHT22 environmental logging to detect dangerous heat spikes and excessive moisture levels, preventing heatstroke and equipment short-circuits.
              </p>
            </div>
            
            <div style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)", padding: "1.8rem", borderRadius: "16px", border: "1px solid #e9ecef", borderRight: "4px solid #d32f2f", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", position: "relative", textAlign: "right" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d32f2f", boxShadow: "0 0 8px #d32f2f", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#d32f2f", textTransform: "uppercase", letterSpacing: "0.05em" }}>Gas Array live</span>
              </div>
              <div style={{ color: "#d32f2f", marginBottom: "1rem" }}>
                {/* Wind/Gas SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                  <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--dark-text)", marginBottom: "0.5rem" }}>Hazardous Gas Sensing</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
                A multi-array MQ sensor grid actively detects toxic concentrations of Carbon Monoxide (CO), Methane (CH₄), and tracks Oxygen (O₂) depletion instantly.
              </p>
            </div>
          </div>

          {/* Center Image */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "140%", height: "140%",
                background: "radial-gradient(circle, rgba(25,118,210,0.08) 0%, transparent 65%)",
                zIndex: 0,
              }}
            />
            {/* Tech scanning ring effect */}
            <div
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "300px", height: "300px",
                border: "1px solid rgba(25,118,210,0.2)",
                borderRadius: "50%",
                zIndex: 0,
                borderTopColor: "rgba(25,118,210,0.8)",
                animation: "spin 8s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "360px", height: "360px",
                border: "1px dashed rgba(25,118,210,0.15)",
                borderRadius: "50%",
                zIndex: 0,
                animation: "spin 12s linear infinite reverse",
              }}
            />
            <Image
              src="/rover-hero.jpeg"
              alt="MineX Sensor Suite"
              width={400}
              height={500}
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "350px",
                height: "auto",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                transform: "scaleX(-1)", // Flip image to face the other way for better symmetry
              }}
            />
          </div>

          {/* Right Column Sensors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)", padding: "1.8rem", borderRadius: "16px", border: "1px solid #e9ecef", borderLeft: "4px solid #2e7d32", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2e7d32", boxShadow: "0 0 8px #2e7d32", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2e7d32", textTransform: "uppercase", letterSpacing: "0.05em" }}>Vision locked</span>
              </div>
              <div style={{ color: "#2e7d32", marginBottom: "1rem" }}>
                {/* User Scan SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                  <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M5 21v-2a4 4 0 0 1 3-3.87" />
                  <path d="M2 21v-2a4 4 0 0 1 3-3.87" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--dark-text)", marginBottom: "0.5rem" }}>AI Human Detection</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
                Powered by YOLO-based machine learning on the Jetson Nano, MineX automatically identifies trapped or injured personnel through thermal and optical feeds.
              </p>
            </div>

            <div style={{ background: "linear-gradient(145deg, #ffffff, #f8f9fa)", padding: "1.8rem", borderRadius: "16px", border: "1px solid #e9ecef", borderLeft: "4px solid #1976d2", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1976d2", boxShadow: "0 0 8px #1976d2", animation: "pulse 2s infinite" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1976d2", textTransform: "uppercase", letterSpacing: "0.05em" }}>LiDAR scanning</span>
              </div>
              <div style={{ color: "#1976d2", marginBottom: "1rem" }}>
                {/* 3D Box/Map SVG */}
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--dark-text)", marginBottom: "0.5rem" }}>Structural Integrity</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
                Combined 360° LIDAR and ultrasonic mapping constantly scans tunnel geometry to detect impending collapses, rockfalls, or pathway blockages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Features Grid ────────────────── */}
      <section className="features-section" style={{ background: "var(--light-gray)" }}>
        <div className="section-header" style={{ marginBottom: "3rem" }}>
          <h2 className="section-title">All Hardware <span className="gradient-text">Features</span></h2>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <article className="feature-card" key={f.title} style={{ background: "white" }}>
              <div className="feature-icon" aria-hidden="true">{f.icon}</div>
              <h2 className="feature-title">{f.title}</h2>
              <p className="feature-desc" style={{ marginBottom: "1rem" }}>{f.desc}</p>
              {/* Detailed breakdown below divider */}
              <div
                style={{
                  borderTop: "1px solid #f0f0f0",
                  paddingTop: "1rem",
                  marginTop: "auto",
                }}
              >
                <p style={{ fontSize: "0.85rem", color: "#777", lineHeight: 1.65 }}>
                  {f.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Technology Stack ──────────────────── */}
      <section
        style={{
          padding: "4rem 5%",
          background: "linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)",
          textAlign: "center",
        }}
      >
        <div className="section-tag" style={{ marginBottom: "0.8rem" }}>
          Under the Hood
        </div>
        <h2
          className="section-title"
          style={{ fontSize: "2rem", marginBottom: "0.75rem" }}
        >
          Technology Stack
        </h2>
        <p
          className="section-subtitle"
          style={{ marginBottom: "2.5rem" }}
        >
          A carefully chosen combination of embedded, AI, and web technologies powers the MineX platform end-to-end.
        </p>

        {/* Pill badges row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {techStack.map((tech) => (
            <span
              key={tech.label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.5rem 1.25rem",
                borderRadius: "9999px",
                background: tech.color,
                color: tech.textColor ?? "#ffffff",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.02em",
                boxShadow: `0 2px 8px ${tech.color}44`,
              }}
            >
              {tech.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────── */}
      <section
        style={{
          padding: "4rem 5%",
          background: "var(--light-gray)",
          textAlign: "center",
        }}
      >
        <h2 className="section-title" style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Ready to See the Hardware?
        </h2>
        <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
          Dive into the physical components that power these features.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/hardware" className="btn-primary">⚙️ Hardware Explorer →</Link>
        </div>
      </section>
    </>
  );
}
