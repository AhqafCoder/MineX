"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Cpu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const isDashboard = pathname?.startsWith("/dashboard");
  if (isDashboard) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? "bg-white shadow-sm border-b border-gray-100" : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-50 border border-orange-100 rounded flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
              <Cpu className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Mine<span className="text-orange-600">X</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-orange-600"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA — Single Dashboard Button */}
          <div className="hidden md:block">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2 border border-orange-700"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-white border-b border-gray-100 shadow-lg md:hidden">
          <nav className="px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium text-gray-900 border-b border-gray-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="mt-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-md shadow-sm text-center flex items-center justify-center gap-2 border border-orange-700"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span>Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
