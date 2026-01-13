"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/dock";
import { contactData } from "@/data/portfolio-data";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-neutral-950 relative overflow-hidden h-screen flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Let's Connect</h2>
        <p className="text-neutral-400 mb-10 max-w-lg mx-auto">
          Ready to start your next project? Feel free to reach out to me for collaborations or just a friendly hello.
        </p>

        <form className="w-full max-w-md mx-auto space-y-4 mb-10 text-left">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
                <input type="email" id="email" className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" placeholder="your@email.com" />
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-400 mb-1">Message</label>
                <textarea id="message" rows={4} className="w-full px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" placeholder="Tell me about your project..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Send Message
            </button>
        </form>

        <div className="flex justify-center">
            <FloatingDock items={contactData.social} />
        </div>
      </div>
      
      {/* Reusing beams for effect, or could use another background */}
      <BackgroundBeams className="opacity-50" />
    </section>
  );
};
