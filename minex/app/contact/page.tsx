"use client";

import { useState } from "react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Navigation />
      <main className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <section className="w-full max-w-4xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-1/2 bg-orange-600 p-10 text-gray-900 flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
              <p className="text-green-50 mb-8">
                Whether you're interested in technology, partnerships, or general enquiries, we'd love to hear from you.
              </p>
              <div className="space-y-4 text-sm font-medium">
                <div>📧 hello@minex.dev</div>
                <div>📍 Engineering Dept</div>
              </div>
            </div>

            <div className="md:w-1/2 p-10">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent</h3>
                  <p className="text-gray-500">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Name</label>
                    <input type="text" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Email</label>
                    <input type="email" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">Message</label>
                    <textarea rows={4} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-600"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-orange-600 text-gray-900 font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors">
                    Send Message
                  </button>
                </form>
              )}
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
