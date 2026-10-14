"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { navLinks } from "../lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled
          ? "0 2px 24px rgba(0,0,0,0.18)"
          : "0 1px 4px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.3s ease",
      }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link href="/" className="nav-logo" aria-label="MineX Home">
        <Image
          src="/minex-logo.png"
          alt="MineX"
          width={36}
          height={36}
          style={{ borderRadius: 4, display: "block" }}
          priority
        />
        <span
          className="gradient-text"
          style={{ fontWeight: 800, fontSize: "1.4rem" }}
        >
          MineX
        </span>
      </Link>

      {/* Desktop Links */}
      <ul className={`nav-links${menuOpen ? " open" : ""}`} role="list">
        {navLinks.map(({ href, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} style={{ position: "relative" }}>
              <Link
                href={href}
                style={{
                  color: isActive ? "var(--primary-red)" : undefined,
                  fontWeight: isActive ? 700 : undefined,
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                {isActive && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: -4,
                      left: 0,
                      width: "100%",
                      height: 2,
                      background: "var(--primary-red)",
                      borderRadius: 1,
                    }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          href="/hardware"
          className="btn-primary nav-cta"
          style={{ padding: "0.6rem 1.4rem", fontSize: "0.9rem" }}
        >
          Get Started
        </Link>

        {/* Hamburger */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span
            style={{
              transform: menuOpen ? "rotate(45deg) translateY(7px)" : "none",
              transition: "transform 0.3s ease",
            }}
          />
          <span
            style={{
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
          <span
            style={{
              transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "none",
              transition: "transform 0.3s ease",
            }}
          />
        </button>
      </div>
    </nav>
  );
}
