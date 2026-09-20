import Link from "next/link";
import Image from "next/image";

const PRODUCT_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Hardware", href: "/hardware" },
  { label: "Capabilities", href: "/capabilities" },
];

const RESOURCE_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "Research Paper", href: "#" },
  { label: "GitHub Repo", href: "#" },
  { label: "Changelog", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Contact", href: "#" },
];

const SOCIAL = [
  { icon: "🐙", label: "GitHub", href: "#" },
  { icon: "🐦", label: "Twitter", href: "#" },
  { icon: "💼", label: "LinkedIn", href: "#" },
  { icon: "📧", label: "Email", href: "mailto:minex@example.com" },
];

const COLS = [
  { heading: "Product", links: PRODUCT_LINKS },
  { heading: "Resources", links: RESOURCE_LINKS },
  { heading: "Company", links: COMPANY_LINKS },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* ── Brand column ── */}
        <div className="footer-brand">
          <Link
            href="/"
            className="nav-logo"
            aria-label="MineX Home"
            style={{ marginBottom: "0.75rem" }}
          >
            <Image
              src="/minex-logo.png"
              alt="MineX"
              width={36}
              height={36}
              style={{ borderRadius: 4, display: "block" }}
            />
            <span
              className="gradient-text"
              style={{ fontWeight: 800, fontSize: "1.4rem" }}
            >
              MineX
            </span>
          </Link>

          <p style={{ lineHeight: 1.7, maxWidth: 280 }}>
            Autonomous Mine Safety &amp; Telemetry Rover — engineered for
            zero-compromise underground operations. SIH&nbsp;2026 Innovation
            Project.
          </p>

          {/* Social row */}
          <div
            className="footer-social"
            style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}
          >
            {SOCIAL.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="social-link"
                aria-label={label}
                title={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ fontSize: "1.25rem", lineHeight: 1 }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Link columns ── */}
        {COLS.map((col) => (
          <div className="footer-col" key={col.heading}>
            <h4
              style={{
                color: "var(--primary-yellow, #f5a623)",
                fontWeight: 700,
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.8rem",
              }}
            >
              {col.heading}
            </h4>
            <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {col.links.map(({ label, href }) => (
                <li key={label} style={{ marginBottom: "0.5rem" }}>
                  {href.startsWith("/") ? (
                    <Link
                      href={href}
                      style={{ transition: "color 0.2s" }}
                      className="footer-link"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="footer-link"
                      style={{ transition: "color 0.2s" }}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <p>
          &copy;&nbsp;{year}&nbsp;MineX &middot; All rights reserved &middot;
          SIH&nbsp;2026
        </p>
        <p>
          Built with&nbsp;❤️ for mine worker safety &middot;{" "}
          <a
            href="#"
            style={{
              color: "rgba(255,255,255,0.5)",
              textDecoration: "underline",
            }}
          >
            Open Source
          </a>
        </p>
      </div>
    </footer>
  );
}
