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
    <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 relative z-10 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
             <h2 className="text-lg md:text-xl font-bold text-neutral-400 mb-4 tracking-widest uppercase">
                {heroData.title}
             </h2>
        </motion.div>
       
        <TextGenerateEffect
          words={heroData.subtitle}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300"
        />
        
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-4 font-normal text-base text-neutral-300 max-w-lg mx-auto"
        >
          {heroData.description}
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="mt-8 flex justify-center gap-4"
        >
            <ShimmerButton className="shadow-2xl" onClick={() => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}>
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    {heroData.cta}
                </span>
            </ShimmerButton>
            
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 bg-neutral-900/50 text-white text-sm lg:text-lg font-medium hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 shadow-lg backdrop-blur-sm"
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
