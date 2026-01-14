"use client";
import React from "react";
import { FloatingDock } from "@/components/ui/dock";
import { contactData } from "@/data/portfolio-data";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const Contact = () => {
  return (
    <section
      id="contact"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 py-20"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">Let&apos;s Connect</h2>
        <p className="mx-auto mb-10 max-w-lg text-neutral-400">
          Ready to start your next project? Feel free to reach out to me for collaborations or just
          a friendly hello.
        </p>

        <form className="mx-auto mb-10 w-full max-w-md space-y-4 text-left">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-neutral-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-medium text-neutral-400">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tell me about your project..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-700"
          >
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
