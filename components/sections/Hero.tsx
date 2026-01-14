"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import ShimmerButton from "@/components/ui/shimmer-button";
import { heroData } from "@/data/portfolio-data";
import { motion } from "framer-motion";
import { Download } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased">
      <div className="relative z-10 mx-auto max-w-2xl p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-lg font-bold tracking-widest text-neutral-400 uppercase md:text-xl">
            {heroData.title}
          </h2>
        </motion.div>

        <TextGenerateEffect
          words={heroData.subtitle}
          className="bg-gradient-to-b from-white to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mx-auto mt-4 max-w-lg text-base font-normal text-neutral-300"
        >
          {heroData.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <ShimmerButton
            className="shadow-2xl"
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg dark:from-white dark:to-slate-900/10">
              {heroData.cta}
            </span>
          </ShimmerButton>

          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/50 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800 lg:text-lg"
          >
            <Download className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>Resume</span>
          </a>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  );
};
