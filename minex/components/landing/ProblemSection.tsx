"use client";

import { AlertTriangle, Clock, Siren, Radio, CircleDollarSign, Bot } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import type { LucideIcon } from "lucide-react";

const problems: { icon: LucideIcon; number: string; title: string; desc: string; badge: string }[] = [
  {
    icon: AlertTriangle,
    number: "01",
    title: "Dangerous Areas",
    desc: "Collapsed structures, disaster sites and mining shafts are too risky for humans to enter.",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: Clock,
    number: "02",
    title: "Slow Search",
    desc: "Manual searching operations are time-consuming and can fail to locate survivors in hazardous environments.",
    badge: "text-orange-500 bg-gray-100",
  },
  {
    icon: Siren,
    number: "03",
    title: "High Risk to Life",
    desc: "Exposure to toxic gases, extreme temperatures and unstable structures puts rescue teams at risk.",
    badge: "text-red-500 bg-gray-100",
  },
  {
    icon: Radio,
    number: "04",
    title: "Unreliable Connectivity",
    desc: "Network blackouts underground can lead to loss of critical telemetry and operational data.",
    badge: "text-yellow-600 bg-gray-100",
  },
  {
    icon: CircleDollarSign,
    number: "05",
    title: "Expensive Solutions",
    desc: "Existing systems can be costly, bulky and difficult to deploy across large mining operations.",
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
            <p className="text-gray-500 text-lg">Challenges that MineX was built to solve.</p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p, i) => (
            <ScrollReveal key={p.number} direction="up" delay={i * 0.08}>
              <div className="rounded-2xl border p-6 bg-gray-50 border-gray-100 hover:shadow-md transition-shadow">
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
          <ScrollReveal direction="up" delay={0.4}>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 flex flex-col items-center justify-center text-center h-full">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-orange-600" />
              </div>
              <div className="font-bold text-orange-600 mb-1">MineX solves all of this</div>
              <p className="text-orange-600 text-sm">Edge AI · Offline-first · Autonomous</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
