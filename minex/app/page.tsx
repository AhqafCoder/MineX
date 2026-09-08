import Image from "next/image";
import Link from "next/link";
import { features, capabilities } from "./lib/data";
import InteractiveRover from "./components/InteractiveRover";

// ── Page-level metadata
export const metadata = {
  title: "MineX — Autonomous Mine Safety & Telemetry Rover",
  description:
    "Meet MineX — India's first autonomous rover built to explore, map, and monitor hazardous underground mine environments so miners never have to.",
};

// ─────────────────────────────────────────
// PAGE BANNER (reusable hero stripe)
// ─────────────────────────────────────────
export function PageBanner({
  tag,
  title,
  subtitle,
  gradient = "linear-gradient(135deg,#ffffff 0%,#fff9e6 60%,#fff3e0 100%)",
}: {
  tag: string;
  title: React.ReactNode;
  subtitle: string;
  gradient?: string;
}) {
  return (
    <section
      style={{
        padding: "5rem 5% 4rem",
        background: gradient,
        textAlign: "center",
      }}
    >
      <div className="section-tag" style={{ marginBottom: "0.8rem" }}>
        {tag}
      </div>
      <h1 className="section-title" style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        {title}
      </h1>
      <p className="section-subtitle">{subtitle}</p>
    </section>
  );
}

// ─────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────
export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section className="hero-section" aria-label="Hero">
        {/* Left */}
        <div>
          <div className="hero-badge">
            <span>🏆</span>
            <span>SIH 2026 · Mine Safety Innovation</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            <span className="gradient-text" style={{ fontWeight: 900 }}>MINEX</span> —
            <br />
            Autonomous Mine
            <br />
            Safety Rover
          </h1>

          <p className="hero-description" style={{ fontSize: "1.1rem", maxWidth: "480px", color: "var(--gray-text)", marginBottom: "2.5rem" }}>
            Smart, rugged, always-on. MineX goes where miners can&apos;t —
            mapping tunnels, detecting gas, and streaming live video from the
            deepest underground environments to ensure zero risk to human life.
          </p>

          {/* CTAs */}
          <div className="hero-cta" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/features" className="btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.05rem" }}>
              🚀 Explore Features
            </Link>
          </div>
        </div>

        {/* Right – Product Image */}
        <div className="hero-image-wrap">
          {/* Gradient container for transparent-bg rover image */}
          <div
            style={{
              background:
                "linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 50%, #fff0f0 100%)",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow:
                "0 0 0 1px rgba(229,57,53,0.1), 0 20px 60px rgba(25,118,210,0.12), 0 4px 16px rgba(229,57,53,0.08)",
            }}
          >
            <InteractiveRover 
              src="/rover-hero.jpeg" 
              alt="MineX Autonomous Mine Safety Rover — interactive 3D view" 
            />
          </div>

          {/* Floating info badge */}
          <div className="hero-image-badge">
            <div className="hero-badge-item">
              <span style={{ color: "#4CAF50" }}>●</span>
              <span>Live Telemetry</span>
            </div>
            <div style={{ width: 1, height: 20, background: "#e0e0e0" }} />
            <div className="hero-badge-item">
              <span>📶</span>
              <span>RF + Wi-Fi 6</span>
            </div>
            <div style={{ width: 1, height: 20, background: "#e0e0e0" }} />
            <div className="hero-badge-item">
              <span>🛡️</span>
              <span>IP67 Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Preview ─────────────────── */}
      <section className="features-section" style={{ paddingBottom: "4rem" }}>
        <div className="section-header">
          <div className="section-tag">Core Capabilities</div>
          <h2 className="section-title">Built for the Extreme</h2>
          <p className="section-subtitle">
            Every feature is engineered with a single mission — keep miners safe
            by replacing humans in the most dangerous underground conditions.
          </p>
        </div>

        {/* Show first 3 features */}
        <div className="features-grid" style={{ marginBottom: "2.5rem" }}>
          {features.slice(0, 3).map((f) => (
            <article className="feature-card" key={f.title}>
              <div className="feature-icon" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/features" className="btn-primary">
            View All →
          </Link>
        </div>
      </section>

      {/* ── Hardware Teaser ───────────────────── */}
      <section
        className="hardware-teaser-grid"
        style={{
          padding: "5rem 5%",
          background: "linear-gradient(to right, var(--light-gray), #ffffff)",
        }}
      >
        <Image
          src="/rover-real.jpeg"
          alt="MineX rover — real photo on white background"
          width={500}
          height={375}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "16px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        />
        <div>
          <div className="section-tag" style={{ textAlign: "left" }}>
            Hardware Explorer
          </div>
          <h2
            className="section-title"
            style={{ textAlign: "left", marginBottom: "1rem" }}
          >
            360° Hardware Breakdown
          </h2>
          <p
            className="section-subtitle"
            style={{ textAlign: "left", margin: 0, marginBottom: "1.5rem" }}
          >
            Three tightly integrated modules — Sensor Array, Core Enclosure, and
            Drive System — work in concert to give MineX unparalleled sensing,
            compute, and mobility.
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2rem" }}
          >
            {[
              "📡 Sensor Array — LIDAR, Night Vision, Gas Sensors",
              "🏠 Core Enclosure — Arduino Mega + Jetson Nano",
              "⚙️ Drive System — 6-Wheel Treads, LiFePO₄ Battery",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.95rem",
                  color: "var(--gray-text)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--primary-red)",
                    flexShrink: 0,
                  }}
                />
                {item}
              </div>
            ))}
          </div>
          <Link href="/hardware" className="btn-primary">
            Explore Hardware →
          </Link>
        </div>
      </section>

      {/* ── Capabilities Preview ──────────────── */}
      <section className="capabilities-section" style={{ paddingBottom: "4rem" }}>
        <div className="section-header">
          <div className="section-tag">What It Can Do</div>
          <h2 className="section-title">Intelligent Mission Capabilities</h2>
          <p className="section-subtitle">
            MineX doesn&apos;t just explore — it understands, maps, alerts, and
            acts autonomously.
          </p>
        </div>

        <div className="capabilities-grid" style={{ marginBottom: "2.5rem" }}>
          {capabilities.slice(0, 3).map((c) => (
            <article className="capability-card" key={c.title}>
              <div className="capability-icon" aria-hidden="true">
                {c.icon}
              </div>
              <h3 className="capability-title">{c.title}</h3>
              <p className="capability-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="/capabilities"
            className="btn-primary"
            style={{
              background: "white",
              color: "var(--primary-blue)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            View All Capabilities →
          </Link>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────── */}
      <section
        style={{
          padding: "5rem 5%",
          background: "white",
          textAlign: "center",
        }}
      >
        <div className="section-tag">Ready to Dive In?</div>
        <h2 className="section-title" style={{ marginBottom: "1rem" }}>
          Explore the Full MineX Platform
        </h2>
        <p
          className="section-subtitle"
          style={{ marginBottom: "2.5rem" }}
        >
          From detailed specs to hardware schematics — everything is documented
          and open for review.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/about" className="btn-secondary">
            👥 Meet the Team
          </Link>
        </div>
      </section>
    </>
  );
}
