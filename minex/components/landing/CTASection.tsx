"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal direction="up" scale>
          <div className="bg-gray-50 rounded-3xl p-12 border border-gray-100">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-orange-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Experience Mission Control?
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Launch the full Command Center dashboard to see live telemetry,
              AI vision feeds, mission management and rover control.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors text-sm"
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
