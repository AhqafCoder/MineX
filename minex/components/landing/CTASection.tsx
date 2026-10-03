"use client";

import Link from "next/link";
import { Mail, Radar } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal direction="up" scale>
          <div className="bg-gray-50 rounded-3xl p-12 border border-gray-100">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Radar className="w-7 h-7 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Experience Mission Control?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Launch the Command Center dashboard to see live telemetry,
              thermal + AI vision feeds, 3D SLAM mapping, and full rover control.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors text-sm"
              >
                Open Command Center
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-full transition-colors text-sm border border-gray-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
