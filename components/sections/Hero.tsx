"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import ShimmerButton from "@/components/ui/shimmer-button";
import { heroData, contactData } from "@/data/portfolio-data";
import { motion, Variants } from "framer-motion";
import { Download, ArrowDown } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const Hero = () => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-md bg-neutral-950 antialiased">
      {/* atmosphere layers */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.18] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_45%,black,transparent)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-[55%] rounded-full bg-white/[0.06] blur-[120px]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto max-w-2xl px-4 text-center"
      >

        <motion.h2
          variants={item}
          className="mb-2 text-sm font-bold tracking-[0.25em] text-neutral-400 uppercase md:text-base"
        >
          {heroData.subtitle}
          <span className="mx-2 text-neutral-700">·</span>
          {heroData.location}
        </motion.h2>

        <TextGenerateEffect
          words={heroData.name}
          className="bg-gradient-to-b from-white via-white to-neutral-400 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-8xl"
        />

        <motion.p
          variants={item}
          className="mx-auto mt-5 max-w-lg text-base font-normal text-neutral-300 md:text-lg"
        >
          {heroData.description}
        </motion.p>

        <motion.div variants={item} className="mt-9 flex items-center justify-center gap-4">
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
            download="Zian Wang - Senior Full Stack Developer.pdf"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/50 px-6 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-neutral-600 hover:bg-neutral-800 lg:text-lg"
          >
            <Download className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>Resume</span>
          </a>
        </motion.div>

        <motion.div variants={item} className="mt-10 flex items-center justify-center gap-5">
          {contactData.social
            .filter((s) => s.title !== "Email")
            .map((s) => (
              <a
                key={s.title}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.title}
                className="h-5 w-5 opacity-50 transition-opacity duration-300 hover:opacity-100"
              >
                {s.icon}
              </a>
            ))}
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-neutral-600 transition-colors hover:text-neutral-300"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.span>
      </motion.button>

      <BackgroundBeams />
    </div>
  );
};
