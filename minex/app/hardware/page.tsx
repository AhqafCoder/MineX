import Image from "next/image";
import Link from "next/link";
import { hardwareModules } from "../lib/data";
import InteractiveRover from "../components/InteractiveRover";

export const metadata = {
  title: "Hardware",
  description:
    "360° hardware breakdown of the MineX rover — Sensor Array, Core Enclosure, and Drive System explained in full detail.",
};

const componentHighlights = [
  {
    emoji: "🎛️",
    name: "Arduino Mega 2560",
    role: "Main MCU",
    spec: "54 I/O pins · 16 MHz · ATmega2560",
  },
  {
    emoji: "🔄",
    name: "RPLidar A1M8",
    role: "360° Mapping",
    spec: "12 m range · 8 K samples/s · 360°",
  },
  {
    emoji: "📷",
    name: "Sony IMX477",
    role: "4K Camera",
    spec: "12.3 MP · 4K@30fps · IR + Visible",
  },
  {
    emoji: "🔋",
    name: "LiFePO₄ Pack",
    role: "Power Source",
    spec: "4S4P · 20 Ah · 14.8 V · 296 Wh",
  },
  {
    emoji: "📻",
    name: "LoRa SX1278",
    role: "RF Backup",
    spec: "868 MHz · 3 km LOS · -148 dBm",
  },
];

const architectureSteps = [
  {
    step: "01",
    icon: "📡",
    title: "Sense",
    desc: "LIDAR, cameras, ultrasonic, and gas sensors gather environmental data at 10 Hz with full 360° coverage.",
    color: "var(--primary-blue)",
  },
  {
    step: "02",
    icon: "🧠",
    title: "Process",
    desc: "Jetson Nano runs SLAM and AI inference; Arduino Mega handles real-time motor control loops.",
    color: "var(--primary-red)",
  },
  {
    step: "03",
    icon: "📤",
    title: "Transmit",
    desc: "Processed telemetry streams to the surface over Wi-Fi 6, with LoRa as automatic failover.",
    color: "var(--primary-blue)",
  },
  {
    step: "04",
    icon: "🎮",
    title: "Act",
    desc: "Surface operators review data and issue commands, or MineX executes autonomously.",
    color: "var(--primary-red)",
  },
];

export default function HardwarePage() {
  return (
    <>
      {/* ── Page Banner ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 5% 4rem",
          background:
            "linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 50%, #ffffff 100%)",
          textAlign: "center",
          borderBottom: "1px solid #e8f0fe",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
            border: "1px solid #90caf9",
            color: "var(--primary-blue)",
            padding: "0.35rem 1.1rem",
            borderRadius: "99px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          ⚙️ Hardware Explorer
        </div>
        <h1
          className="section-title"
          style={{ fontSize: "3rem", marginBottom: "1rem", marginTop: "0.5rem" }}
        >
          360°{" "}
          <span className="gradient-text">Hardware Breakdown</span>
        </h1>
        <p className="section-subtitle">
          Three tightly integrated modules work in concert to give MineX
          unparalleled sensing, compute, and mobility — engineered for the
          harshest underground environments.
        </p>
      </section>

      {/* ── Main 2-column layout ─────────────────────────────────────────── */}
      <section className="hardware-section">
        <div className="hardware-layout">
          {/* Left column — image + quick stats */}
          <div>
            {/* Professional image container */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, #f0f4ff 0%, #fff4f4 100%)",
                borderRadius: "20px",
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 8px 32px rgba(25, 118, 210, 0.10), 0 2px 8px rgba(229,57,53,0.06)",
                position: "sticky",
                top: "90px",
              }}
            >
              <div style={{ width: "100%" }}>
                <InteractiveRover 
                  src="/rover-hero.jpeg" 
                  alt="MineX rover — 360° hardware interactive view" 
                />

                {/* 2×2 quick-stat grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                  }}
                >
                  {[
                    { icon: "⚖️", label: "Weight", value: "6.8 kg" },
                    { icon: "📐", label: "Size", value: "420×320 mm" },
                    { icon: "🛡️", label: "IP Rating", value: "IP67" },
                    { icon: "⚡", label: "Runtime", value: "8 hrs" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      style={{
                        background: "white",
                        borderRadius: "10px",
                        padding: "0.85rem 1rem",
                        boxShadow: "var(--shadow-sm)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.65rem",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{s.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "var(--gray-text)",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {s.label}
                        </div>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            color: "var(--dark-text)",
                            lineHeight: 1.2,
                            marginTop: "0.1rem",
                          }}
                        >
                          {s.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column — hardware module cards */}
          <div className="hardware-cards">
            {hardwareModules.map((m) => (
              <article className="hardware-card" key={m.title}>
                <div className="hardware-card-header">
                  <span className="hardware-card-icon" aria-hidden="true">
                    {m.icon}
                  </span>
                  <div>
                    <div className="hardware-card-subtitle">{m.label}</div>
                    <div className="hardware-card-title">{m.title}</div>
                  </div>
                </div>
                <p className="hardware-card-desc">{m.desc}</p>
                <div className="hardware-tags">
                  {m.tags.map((tag) => (
                    <span className="hardware-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Expanded spec mini-table */}
                <div
                  style={{
                    marginTop: "1.2rem",
                    borderTop: "1px solid #f0f0f0",
                    paddingTop: "1rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.6rem 1.2rem",
                  }}
                >
                  {m.specs.map((sp) => (
                    <div
                      key={sp.label}
                      style={{
                        background: "#f8fbff",
                        borderRadius: "6px",
                        padding: "0.5rem 0.7rem",
                        borderLeft: "3px solid var(--primary-blue)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--primary-blue)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginBottom: "0.15rem",
                        }}
                      >
                        {sp.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--dark-text)",
                          fontWeight: 600,
                        }}
                      >
                        {sp.value}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Section ─────────────────────────────────────────── */}
      <section style={{ padding: "5rem 5%", background: "white" }}>
        <div className="section-header">
          <div className="section-tag">System Architecture</div>
          <h2 className="section-title">
            Sense → Process → Transmit →{" "}
            <span className="gradient-text">Act</span>
          </h2>
          <p className="section-subtitle">
            A layered communication bus links every module — from sensors at the
            edge to motors in the field.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {architectureSteps.map((item, idx) => (
            <div
              key={item.step}
              style={{
                background: "var(--light-gray)",
                borderRadius: "14px",
                padding: "2rem 1.8rem",
                position: "relative",
                overflow: "hidden",
                borderTop: `4px solid ${item.color}`,
              }}
              className="feature-card"
            >
              {/* Ghost step number */}
              <div
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1.2rem",
                  fontSize: "3rem",
                  fontWeight: 900,
                  color:
                    idx % 2 === 0
                      ? "rgba(25,118,210,0.07)"
                      : "rgba(229,57,53,0.07)",
                  lineHeight: 1,
                  userSelect: "none",
                }}
              >
                {item.step}
              </div>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.9rem" }}>
                {item.icon}
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "1.15rem",
                  color: item.color,
                  marginBottom: "0.6rem",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--gray-text)",
                  lineHeight: 1.65,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Component Gallery ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 5%",
          background: "var(--light-gray)",
        }}
      >
        <div className="section-header">
          <div className="section-tag">Component Gallery</div>
          <h2 className="section-title">
            Key <span className="gradient-text">Components</span>
          </h2>
          <p className="section-subtitle">
            Every component is carefully selected for performance, reliability,
            and compatibility in mine environments.
          </p>
        </div>

        {/* Horizontally scrollable row */}
        <div
          style={{
            display: "flex",
            gap: "1.25rem",
            overflowX: "auto",
            paddingBottom: "1rem",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {componentHighlights.map((c) => (
            <div
              key={c.name}
              style={{
                flex: "0 0 220px",
                background: "white",
                borderRadius: "14px",
                padding: "1.6rem 1.4rem",
                boxShadow: "var(--shadow-sm)",
                borderTop: "3px solid var(--primary-blue)",
                scrollSnapAlign: "start",
                cursor: "default",
              }}
              className="feature-card"
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "0.8rem" }}>
                {c.emoji}
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "0.98rem",
                  color: "var(--dark-text)",
                  marginBottom: "0.25rem",
                  lineHeight: 1.3,
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--primary-blue)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: "0.7rem",
                }}
              >
                {c.role}
              </div>
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "var(--gray-text)",
                  lineHeight: 1.55,
                }}
              >
                {c.spec}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── End-to-End System Architecture ────────────────────────────────────── */}
      <section style={{ padding: "5rem 5%", background: "white" }}>
        <div className="section-header">
          <div
            className="section-tag"
            style={{
              background: "rgba(25, 118, 210, 0.1)",
              color: "var(--primary-blue)",
              border: "1px solid rgba(25, 118, 210, 0.2)",
            }}
          >
            Data Pipeline
          </div>
          <h2 className="section-title">
            End-to-End <span className="gradient-text">Architecture</span>
          </h2>
          <p className="section-subtitle" style={{ maxWidth: "700px", margin: "0 auto 3rem" }}>
            The software ecosystem powering MineX. From data collection at the edge to machine learning predictions on the surface.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          {/* Phase 1 */}
          <div
            style={{
              background: "#fafafa",
              borderRadius: "16px",
              padding: "2rem",
              borderTop: "4px solid var(--primary-red)",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "2rem",
                background: "var(--primary-red)",
                color: "white",
                padding: "0.2rem 1rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Phase 1
            </div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", marginTop: "0.5rem" }}>🍓</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--dark-text)", marginBottom: "1rem" }}>
              The Raspberry Pi <br/><span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--gray-text)" }}>(Edge Node)</span>
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--gray-text)", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              The Pi&apos;s only job is to collect and forward data from the darkest depths.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-red)" }}>•</span>
                <span><b>Reads the Sensors:</b> Grabs DHT22, MPU6050, HMC5883L, and the USB gas data continuously.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-red)" }}>•</span>
                <span><b>Local Storage (SQLite):</b> Instantly saves a backup to a local <code>.db</code> file so you don&apos;t lose data if Wi-Fi drops.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-red)" }}>•</span>
                <span><b>Cloud Storage (MongoDB):</b> Pushes the exact same data to your database for permanent record-keeping.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-red)" }}>•</span>
                <span><b>Live Broadcaster:</b> Opens a local network TCP/WebSocket port (e.g., Port 5000) and constantly shouts live JSON data for the surface laptop to catch.</span>
              </li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div
            style={{
              background: "#fafafa",
              borderRadius: "16px",
              padding: "2rem",
              borderTop: "4px solid var(--primary-blue)",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "2rem",
                background: "var(--primary-blue)",
                color: "white",
                padding: "0.2rem 1rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Phase 2
            </div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", marginTop: "0.5rem" }}>💻</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--dark-text)", marginBottom: "1rem" }}>
              Your Laptop <br/><span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--gray-text)" }}>(The ML Engine)</span>
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--gray-text)", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Your laptop runs a lightweight Python backend server (Flask or FastAPI) functioning as the brain.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-blue)" }}>•</span>
                <span><b>Listens to the Pi:</b> Connects to the Pi&apos;s IP address on Port 5000 and catches the live sensor stream.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-blue)" }}>•</span>
                <span><b>Runs Scikit-Learn:</b> Feeds incoming gas, temperature, and humidity data into Polynomial Regression and Isolation Forest ML models to generate real-time predictions.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--primary-blue)" }}>•</span>
                <span><b>Serves the Frontend:</b> Packages the raw sensor data alongside the ML predictions and serves them seamlessly to your website interface.</span>
              </li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div
            style={{
              background: "#fafafa",
              borderRadius: "16px",
              padding: "2rem",
              borderTop: "4px solid var(--accent-yellow)",
              boxShadow: "var(--shadow-sm)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "2rem",
                background: "var(--accent-yellow)",
                color: "var(--dark-text)",
                padding: "0.2rem 1rem",
                borderRadius: "99px",
                fontSize: "0.8rem",
                fontWeight: 800,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Phase 3
            </div>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", marginTop: "0.5rem" }}>🌐</div>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--dark-text)", marginBottom: "1rem" }}>
              The Frontend <br/><span style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--gray-text)" }}>(Command Center)</span>
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--gray-text)", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              A clean Next.js web interface running on your laptop&apos;s browser, delivering total situational awareness.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--accent-yellow)" }}>•</span>
                <span><b>Real-Time Polling:</b> Asks your laptop&apos;s backend for the absolute latest data every single second.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--accent-yellow)" }}>•</span>
                <span><b>Live Charts:</b> Displays beautiful, dynamic charts of gas levels, temperatures, and structural orientation.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--accent-yellow)" }}>•</span>
                <span><b>Warning Banners:</b> Triggers high-contrast visual alerts the moment sensors detect hazardous environmental thresholds.</span>
              </li>
              <li style={{ display: "flex", gap: "0.8rem", fontSize: "0.9rem", color: "var(--dark-text)" }}>
                <span style={{ color: "var(--accent-yellow)" }}>•</span>
                <span><b>AI Predictive Countdown:</b> Shows ML-calculated time-to-critical thresholds based on environmental deterioration rates.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4.5rem 5%",
          background:
            "linear-gradient(135deg, #1a237e 0%, #1565c0 60%, #1976D2 100%)",
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
          Want the Full Specifications?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.75)",
            marginBottom: "2rem",
            fontSize: "1.05rem",
          }}
        >
          Dive deeper into every sensor, motor, and module with detailed spec
          tables.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/capabilities"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              borderRadius: "8px",
              border: "2px solid rgba(255,255,255,0.35)",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
            }}
          >
            🤖 See Capabilities
          </Link>
        </div>
      </section>
    </>
  );
}
