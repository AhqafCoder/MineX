"use client";

import { AlertTriangle, Clock, Siren, Radio, CircleDollarSign, Bot, Navigation, Flame } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const problems: { icon: LucideIcon; number: string; title: string; desc: string; badge: string }[] = [
  {
    icon: Siren,
    number: "01",
    title: "Human Entry into Hazardous Zones",
    desc: "Rescue teams must physically enter collapsed structures, toxic gas pockets, and unstable mine shafts — putting responders at immediate risk.",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: AlertTriangle,
    number: "02",
    title: "Limited Visibility Underground",
    desc: "Smoke, dust, and complete darkness in underground mines make visual search nearly impossible for human rescue teams.",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: Radio,
    number: "03",
    title: "Communication Blackouts",
    desc: "Conventional Wi-Fi and cellular signals fail underground. Without reliable communication, coordination between surface and subsurface teams breaks down.",
    badge: "text-yellow-600 bg-gray-100",
  },
  {
    icon: Navigation,
    number: "04",
    title: "GPS-Denied Navigation",
    desc: "GPS signals cannot penetrate underground — making autonomous navigation, mapping, and location tracking extremely difficult without alternative systems.",
    badge: "text-orange-500 bg-gray-100",
  },
  {
    icon: Flame,
    number: "05",
    title: "Methane & Toxic Gas Exposure",
    desc: "Methane (CH₄), carbon monoxide (CO), hydrogen sulfide (H₂S), and oxygen depletion are constant threats. Manual gas assessment is slow and dangerous.",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: Clock,
    number: "06",
    title: "Slow & Uncertain Search",
    desc: "Manual search operations are time-consuming and can miss survivors in debris. Every minute of delay reduces the chance of survival.",
    badge: "text-orange-500 bg-gray-100",
  },
  {
    icon: CircleDollarSign,
    number: "07",
    title: "Expensive Existing Solutions",
    desc: "Current mine rescue robots are bulky, costly, and difficult to deploy at scale — making them inaccessible to most mining operations.",
    badge: "text-gray-500 bg-gray-100",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal direction="up" scale blur>
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gray-50 text-red-500 text-sm font-semibold rounded-full mb-4">
              The Problem
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Real Risks. Real Challenges.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Underground mine accidents in India continue to claim lives every year. These are the challenges that MineX is engineered to solve.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((p, i) => (
            <ScrollReveal key={p.number} direction="up" delay={i * 0.08}>
              <div className="rounded-2xl border p-6 bg-gray-50 border-gray-100 hover:shadow-md transition-shadow h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.badge}`}>
                    {p.number}
                  </span>
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                    <p.icon className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}

          {/* CTA card */}
          <ScrollReveal direction="up" delay={0.56}>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-orange-600" />
              </div>
              <div className="font-bold text-orange-600 mb-1">MineX solves all of this</div>
              <p className="text-orange-600 text-sm">Thermal AI · LiDAR SLAM · Wi-Fi HaLow · Autonomous</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
