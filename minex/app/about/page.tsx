import Image from "next/image";
import Link from "next/link";
import { teamMembers } from "../lib/data";

export const metadata = {
  title: "About",
  description:
    "Meet the team behind MineX — a passionate group of engineers and developers building autonomous mine safety technology for SIH 2026.",
};

const timeline = [
  {
    month: "Jan 2026",
    title: "Concept & Research",
    desc: "Problem statement received for SIH 2026. Team formed and initial research into mine safety challenges, existing solutions, and hardware feasibility began.",
    icon: "💡",
  },
  {
    month: "Feb 2026",
    title: "System Design",
    desc: "Hardware architecture finalised. Component selection, CAD modelling, and circuit schematics drafted. Communication protocol stack defined.",
    icon: "📐",
  },
  {
    month: "Mar 2026",
    title: "Prototype v1",
    desc: "First physical prototype assembled. Basic locomotion, camera streaming, and serial telemetry validated under controlled lab conditions.",
    icon: "🔧",
  },
  {
    month: "May 2026",
    title: "Sensor Integration",
    desc: "LIDAR, gas sensor array, and ultrasonic modules integrated. Initial SLAM mapping tests conducted in a simulated tunnel corridor.",
    icon: "📡",
  },
  {
    month: "Jul 2026",
    title: "Autonomous Navigation",
    desc: "Full autonomous mode implemented on Jetson Nano. End-to-end telemetry pipeline completed with real-time dashboard on the surface UI.",
    icon: "🤖",
  },
  {
    month: "Sep 2026",
    title: "SIH 2026 Submission",
    desc: "MineX rover fully tested, documented, and submitted for Smart India Hackathon 2026 national evaluation — ready to make a difference.",
    icon: "🏆",
  },
];

const missionPillars = [
  { icon: "🎯", label: "Zero Risk", desc: "No human enters hazardous zones" },
  { icon: "📡", label: "Full Telemetry", desc: "Real-time sensor + video feed" },
  { icon: "🤖", label: "Autonomous", desc: "Self-navigating AI-powered rover" },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Page Banner ─────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "5rem 5% 4rem",
          background:
            "linear-gradient(135deg, #ffffff 0%, #fff9e6 55%, #fff3e0 100%)",
          textAlign: "center",
          borderBottom: "1px solid #ffe0b2",
        }}
      >
        {/* SIH 2026 badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
            border: "1px solid #FFD54F",
            color: "#e65100",
            padding: "0.35rem 1.1rem",
            borderRadius: "99px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          🏆 SIH 2026 · Innovation Project
        </div>

        <h1
          className="section-title"
          style={{ fontSize: "3rem", marginBottom: "1rem", marginTop: "0.5rem" }}
        >
          About{" "}
          <span className="gradient-text">Team MineX</span>
        </h1>
        <p className="section-subtitle">
          A multidisciplinary team of engineers, developers, and designers
          united by a single mission — make underground mining safer through
          autonomous technology.
        </p>
      </section>

      {/* ── Mission Section ──────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 5%", background: "white" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Left — mission text */}
          <div>
            <div
              className="section-tag"
              style={{ textAlign: "left", display: "inline-block" }}
            >
              Our Mission
            </div>
            <h2
              className="section-title"
              style={{
                textAlign: "left",
                marginBottom: "1.2rem",
                marginTop: "0.5rem",
              }}
            >
              Zero Risk to Human Life{" "}
              <span className="gradient-text">Underground</span>
            </h2>
            <p
              style={{
                color: "var(--gray-text)",
                lineHeight: 1.8,
                marginBottom: "1.2rem",
                fontSize: "0.98rem",
              }}
            >
              Mining accidents claim thousands of lives every year worldwide.
              The biggest risk factor is sending human workers into unmapped,
              post-blast, or gas-contaminated tunnels for inspection and
              reconnaissance — before conditions are confirmed safe.
            </p>
            <p
              style={{
                color: "var(--gray-text)",
                lineHeight: 1.8,
                marginBottom: "2rem",
                fontSize: "0.98rem",
              }}
            >
              MineX was built to eliminate that risk entirely. By deploying an
              autonomous rover as the first responder, we give surface operators
              complete situational awareness — full LIDAR maps, live 4K video,
              and real-time gas readings — without exposing a single miner to
              danger.
            </p>

            {/* Mission pillars */}
            <div
              style={{
                display: "flex",
                gap: "0.9rem",
                flexWrap: "wrap",
                marginBottom: "2rem",
              }}
            >
              {missionPillars.map((p) => (
                <div
                  key={p.label}
                  style={{
                    background: "var(--light-gray)",
                    borderRadius: "10px",
                    padding: "0.85rem 1.1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    border: "1px solid #eeeeee",
                    flex: "1 1 120px",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{p.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "var(--dark-text)",
                      }}
                    >
                      {p.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--gray-text)",
                        marginTop: "0.1rem",
                      }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/features" className="btn-primary">
                🚀 See the Rover
              </Link>
            </div>
          </div>

          {/* Right — rover-real.jpeg */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/rover-real.jpeg"
              alt="MineX rover — real-world photo"
              width={520}
              height={390}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "18px",
                boxShadow:
                  "0 16px 48px rgba(0,0,0,0.14), 0 4px 16px rgba(229,57,53,0.08)",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Team Grid ────────────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 5%", background: "var(--light-gray)" }}>
        <div className="section-header">
          <div className="section-tag">The Team</div>
          <h2 className="section-title">
            Meet the <span className="gradient-text">Engineers</span>
          </h2>
          <p className="section-subtitle">
            Six specialists across hardware, software, AI, and communications —
            building one integrated, award-ready system.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {teamMembers.map((member, i) => (
            <div
              key={member.name}
              style={{
                background: "white",
                borderRadius: "14px",
                padding: "2rem",
                boxShadow: "var(--shadow-sm)",
                borderTop: `4px solid ${
                  i % 2 === 0 ? "var(--primary-red)" : "var(--primary-blue)"
                }`,
                border: "1px solid #f0f0f0",
              }}
              className="feature-card"
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: 64,
                  height: 64,
                  background:
                    i % 2 === 0
                      ? "linear-gradient(135deg, #ffebee, #fce4ec)"
                      : "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.9rem",
                  marginBottom: "1rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {member.emoji}
              </div>
              <h3
                style={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "var(--dark-text)",
                  marginBottom: "0.3rem",
                }}
              >
                {member.name}
              </h3>
              <div
                style={{
                  fontSize: "0.78rem",
                  color:
                    i % 2 === 0 ? "var(--primary-red)" : "var(--primary-blue)",
                  fontWeight: 700,
                  marginBottom: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {member.role}
              </div>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--gray-text)",
                  lineHeight: 1.65,
                }}
              >
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Project Timeline ─────────────────────────────────────────────── */}
      <section style={{ padding: "5rem 5%", background: "white" }}>
        <div className="section-header">
          <div className="section-tag">Project Timeline</div>
          <h2 className="section-title">
            From Idea to <span className="gradient-text">Reality</span>
          </h2>
          <p className="section-subtitle">
            9 months of rapid development, rigorous testing, and constant
            iteration — built on passion and purpose.
          </p>
        </div>

        <div style={{ position: "relative", maxWidth: 820, margin: "0 auto" }}>
          {/* Centre line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 2,
              background:
                "linear-gradient(to bottom, var(--primary-red), var(--primary-blue))",
              transform: "translateX(-50%)",
            }}
          />

          {timeline.map((event, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={event.month}
                className="timeline-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 52px 1fr",
                  gap: "1rem",
                  marginBottom: "2.5rem",
                  alignItems: "center",
                }}
              >
                {/* Left slot */}
                <div
                  className={!isLeft ? "timeline-left-hide" : ""}
                  style={{ textAlign: "right" }}
                >
                  {isLeft && (
                    <div
                      style={{
                        background: "var(--light-gray)",
                        borderRadius: "12px",
                        padding: "1.1rem 1.3rem",
                        display: "inline-block",
                        maxWidth: 300,
                        textAlign: "right",
                        border: "1px solid #eeeeee",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--primary-red)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {event.month}
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: "var(--dark-text)",
                          marginBottom: "0.4rem",
                          fontSize: "1rem",
                        }}
                      >
                        {event.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.84rem",
                          color: "var(--gray-text)",
                          lineHeight: 1.55,
                        }}
                      >
                        {event.desc}
                      </div>
                    </div>
                  )}
                </div>

                {/* Centre icon node */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "white",
                    border: `3px solid ${
                      i % 2 === 0 ? "var(--primary-red)" : "var(--primary-blue)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    zIndex: 1,
                    justifySelf: "center",
                    boxShadow:
                      i % 2 === 0
                        ? "0 2px 12px rgba(229,57,53,0.22)"
                        : "0 2px 12px rgba(25,118,210,0.22)",
                  }}
                >
                  {event.icon}
                </div>

                {/* Right slot */}
                <div className={isLeft ? "timeline-left-hide" : ""}>
                  {!isLeft && (
                    <div
                      style={{
                        background: "var(--light-gray)",
                        borderRadius: "12px",
                        padding: "1.1rem 1.3rem",
                        display: "inline-block",
                        maxWidth: 300,
                        textAlign: "left",
                        border: "1px solid #eeeeee",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.72rem",
                          color: "var(--primary-blue)",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {event.month}
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          color: "var(--dark-text)",
                          marginBottom: "0.4rem",
                          fontSize: "1rem",
                        }}
                      >
                        {event.title}
                      </div>
                      <div
                        style={{
                          fontSize: "0.84rem",
                          color: "var(--gray-text)",
                          lineHeight: 1.55,
                        }}
                      >
                        {event.desc}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Dark Stats Banner ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4.5rem 5%",
          background: "var(--dark-text)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2.5rem",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {[
            { value: "6", label: "Team Members", icon: "👥" },
            { value: "9", label: "Months Development", icon: "📅" },
            { value: "50+", label: "Components Used", icon: "🔩" },
            { value: "1", label: "SIH 2026 Entry", icon: "🏆" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: "2.8rem",
                  fontWeight: 900,
                  color: "var(--accent-yellow)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.88rem",
                  color: "rgba(255,255,255,0.6)",
                  marginTop: "0.4rem",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 5%",
          background: "var(--light-gray)",
          textAlign: "center",
        }}
      >
        <h2
          className="section-title"
          style={{ fontSize: "2rem", marginBottom: "0.8rem" }}
        >
          Explore the Full Project
        </h2>
        <p
          style={{
            color: "var(--gray-text)",
            marginBottom: "2rem",
            fontSize: "1rem",
          }}
        >
          Dive into MineX&apos;s features, hardware, and technical specifications.
        </p>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/features" className="btn-primary">
            🚀 Features →
          </Link>
          <Link href="/hardware" className="btn-secondary">
            ⚙️ Hardware
          </Link>
        </div>
      </section>
    </>
  );
}
