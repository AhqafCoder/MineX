"use client";

import Link from "next/link";
import { Cpu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 px-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-50 border border-orange-100 rounded flex items-center justify-center relative overflow-hidden shadow-sm">
            <Cpu className="w-4 h-4 text-orange-600" />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">
            Mine<span className="text-orange-600">X</span>
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-orange-600 font-medium">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} MineX Project. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
