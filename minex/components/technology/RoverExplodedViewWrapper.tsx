"use client";

import dynamic from "next/dynamic";

const RoverExplodedView = dynamic(
  () => import("./RoverExplodedView"),
  { 
    loading: () => (
      <div className="w-full max-w-3xl mx-auto aspect-[768/1200] bg-[#0f172a] rounded-3xl animate-pulse flex items-center justify-center text-[#00f0ff] border border-slate-800 shadow-2xl">
        Loading Schematic...
      </div>
    )
  }
);

export default function RoverExplodedViewWrapper() {
  return <RoverExplodedView />;
}
