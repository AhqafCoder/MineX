import Link from "next/link";
import { capabilities } from "../lib/data";

export const metadata = {
  title: "Capabilities",
  description:
    "Explore all intelligent mission capabilities of MineX — 3D mapping, gas alerts, all-terrain mobility, remote inspection, autonomous mode, and military-grade durability.",
};

const metrics = [
  { value: "3 km", label: "Max RF Range", icon: "📶", color: "#E53935" },
  { value: "10 Hz", label: "LIDAR Scan Rate", icon: "🔄", color: "#1976D2" },
  { value: "< 80ms", label: "Video Latency", icon: "⚡", color: "#E53935" },
  { value: "200ms", label: "Gas Sample Rate", icon: "🧪", color: "#1976D2" },
  { value: "1.2 m/s", label: "Max Speed", icon: "🏎️", color: "#E53935" },
  { value: "24 hrs", label: "Standby Runtime", icon: "🔋", color: "#1976D2" },
];

const useCases = [
  {
    icon: "💥",
    title: "Post-Blast Survey",
    desc: "After controlled detonations, MineX enters the blast zone to assess structural integrity and gas levels before human clearance is granted.",
    badge: "Critical Safety",
    badgeColor: "#E53935",
  },
  {
    icon: "🔥",
    title: "Fire Detection & Response",
    desc: "Thermal and gas sensors detect underground fires early, allowing surface crews to coordinate response before toxic smoke builds to lethal levels.",
    badge: "Emergency Response",
    badgeColor: "#FF5722",
  },
  {
    icon: "🏗️",
    title: "Structural Inspection",
    desc: "HD cameras and LIDAR map tunnel wall deformations and roof sag, flagging sections at risk of collapse before they become deadly.",
    badge: "Preventive Safety",
    badgeColor: "#1976D2",
  },
  {
    icon: "📍",
    title: "Mine Mapping",
    desc: "Autonomous SLAM exploration generates accurate 3D maps of previously unmapped or abandoned mine sections for rescue planning.",
    badge: "Operations",
    badgeColor: "#388E3C",
  },
];

export default function CapabilitiesPage() {
  return (
    <>
      {/* ── Page Banner ── */}
      <section
        style={{
          padding: "5.5rem 5% 4.5rem",
          background: "linear-gradient(150deg, #0d1b4b 0%, #1a237e 35%, #1565C0 70%, #1976D2 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            className="section-tag"
            style={{
              background: "rgba(255,193,7,0.15)",
              color: "#FFD54F",
              border: "1px solid rgba(255,193,7,0.3)",
              marginBottom: "1rem",
            }}
          >
            Mission Intelligence
          </div>
          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              color: "white",
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Intelligent Mission{" "}
            <span style={{ color: "#FFC107" }}>Capabilities</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "1.05rem",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            MineX doesn&apos;t just explore — it understands, maps, alerts, and acts
            autonomously so surface crews always have the full operational picture.
          </p>
        </div>
      </section>

      {/* ── Performance Metrics ── */}
      <section
        style={{
          background: "white",
          padding: "3rem 5%",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              style={{
                textAlign: "center",
                padding: "1.5rem 0.5rem",
                borderRadius: 12,
                background: "var(--light-gray)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>{m.icon}</div>
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: m.color,
                  lineHeight: 1.1,
                  marginBottom: "0.3rem",
                }}
              >
                {m.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--gray-text)", fontWeight: 600 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section className="capabilities-section">
        <div className="capabilities-grid">
          {capabilities.map((c, i) => (
            <article
              key={c.title}
              className="capability-card"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="capability-icon" aria-hidden="true">
                {c.icon}
              </div>
              <h2 className="capability-title">{c.title}</h2>
              <p className="capability-desc">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Autonomous Pipeline ── */}
      <section style={{ padding: "5rem 5%", background: "white" }}>
        <div className="section-header">
          <div className="section-tag">How Autonomy Works</div>
          <h2 className="section-title">Decision Pipeline</h2>
          <p className="section-subtitle">
            From raw sensor data to autonomous action — in under 100 ms.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0",
            overflowX: "auto",
            paddingBottom: "1rem",
          }}
        >
          {[
            { step: "01", icon: "📡", title: "Sense", desc: "LIDAR + cameras + gas sensors gather environment data at 10 Hz continuously.", color: "#E53935" },
            { step: "02", icon: "🧠", title: "Fuse", desc: "Jetson Nano fuses all sensor streams into a unified situational awareness model.", color: "#C62828" },
            { step: "03", icon: "🗺️", title: "Map", desc: "SLAM algorithm updates the 3D point-cloud map and detects new obstacles.", color: "#1976D2" },
            { step: "04", icon: "🤔", title: "Decide", desc: "AI planning layer selects the safest path or triggers emergency protocols.", color: "#1565C0" },
            { step: "05", icon: "🎮", title: "Act", desc: "Motor commands execute the plan; telemetry streams the result to the surface.", color: "#0D47A1" },
          ].map((p, i, arr) => (
            <div key={p.step} style={{ display: "flex", alignItems: "stretch", flexShrink: 0 }}>
              <div
                style={{
                  background: p.color,
                  color: "white",
                  borderRadius: 12,
                  padding: "1.8rem 1.4rem",
                  width: 200,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    opacity: 0.7,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.5rem",
                  }}
                >
                  STEP {p.step}
                </div>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{p.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>
                  {p.title}
                </div>
                <div style={{ fontSize: "0.82rem", opacity: 0.85, lineHeight: 1.5 }}>{p.desc}</div>
              </div>
              {i < arr.length - 1 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.5rem",
                    color: "#bbb",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Real-World Use Cases ── */}
      <section style={{ padding: "5rem 5%", background: "var(--light-gray)" }}>
        <div className="section-header">
          <div className="section-tag">Real-World Use Cases</div>
          <h2 className="section-title">Where MineX Gets Deployed</h2>
          <p className="section-subtitle">
            From routine inspections to post-blast surveys — MineX handles the jobs
            too dangerous for human entry.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {useCases.map((uc) => (
            <div
              key={uc.title}
              style={{
                background: "white",
                borderRadius: 12,
                padding: "2rem",
                borderTop: `3px solid ${uc.badgeColor}`,
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.3s ease",
              }}
              className="feature-card"
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{uc.icon}</div>
              <span
                style={{
                  display: "inline-block",
                  background: uc.badgeColor + "18",
                  color: uc.badgeColor,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.7rem",
                  borderRadius: 99,
                  marginBottom: "0.6rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {uc.badge}
              </span>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--dark-text)",
                  marginBottom: "0.5rem",
                }}
              >
                {uc.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--gray-text)", lineHeight: 1.6 }}>
                {uc.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: "5rem 5%",
          background: "var(--dark-text)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "white",
            marginBottom: "0.8rem",
          }}
        >
          Ready to explore the specs?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            marginBottom: "2rem",
            fontSize: "1.05rem",
          }}
        >
          Every capability is backed by precise engineering and real hardware.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/about"
            className="btn-secondary"
            style={{ borderColor: "rgba(255,255,255,0.3)", color: "white", background: "transparent" }}
          >
            👥 Meet the Team
          </Link>
        </div>
      </section>
    </>
  );
}
