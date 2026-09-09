"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROVER_COMMAND_CENTER_URL } from "@/lib/constants";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gray-50 rounded-3xl p-12 border border-gray-100">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Experience Mission Control?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Launch the full Command Center dashboard to see live telemetry,
            AI vision feeds, mission management and rover control.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href={ROVER_COMMAND_CENTER_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-gray-900 font-semibold rounded-full transition-colors text-sm"
            >
              Launch Command Center <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-full border border-gray-100 transition-colors text-sm"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
