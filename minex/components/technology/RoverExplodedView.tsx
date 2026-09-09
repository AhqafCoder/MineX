"use client";

import React from "react";
import Image from "next/image";

export default function RoverExplodedView() {
  return (
    <div className="w-full max-w-3xl mx-auto relative rounded-3xl overflow-hidden border border-slate-800 shadow-[0_0_40px_rgba(0,0,0,0.4)] bg-[#0f172a] group">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 z-10 bg-gradient-to-b from-[#0f172a]/90 via-[#0f172a]/40 to-transparent pointer-events-none">
        <h3 className="text-[#00f0ff] font-bold text-xl tracking-widest uppercase mb-1 drop-shadow-lg">MIND ROVER</h3>
        <p className="text-gray-300 text-sm uppercase tracking-wider drop-shadow-md">Hardware Prototype Breakdown</p>
      </div>
      
      {/* Image Container - Using original exact aspect ratio (768x1200) */}
      <div className="relative w-full aspect-[768/1200] flex items-center justify-center">
        <Image 
          src="/rover-prototype.jpeg" 
          alt="Rover Exploded View Diagram"
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
          priority
          unoptimized
        />
        
        {/* Subtle Cyberpunk Overlay Effects */}
        <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(15,23,42,1)] pointer-events-none" />
      </div>

      {/* Decorative Bottom Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-60" />
    </div>
  );
}
