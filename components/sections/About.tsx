"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { aboutData } from "@/data/portfolio-data";
import NumberTicker from "@/components/ui/number-ticker";
import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from "@/components/ui/glowing-stars";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Meteors } from "@/components/ui/meteors";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10 mb-10">
         <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{aboutData.title}</h2>
         <p className="text-neutral-400 text-lg max-w-3xl">{aboutData.description}</p>
         
         <div className="flex gap-10 mt-8">
             {aboutData.stats.map((stat, idx) => (
                 <div key={idx} className="flex flex-col">
                     <div className="text-3xl font-bold text-white flex items-center">
                        <NumberTicker value={stat.value} className="text-white" />
                        <span>+</span>
                     </div>
                     <span className="text-neutral-500">{stat.label}</span>
                 </div>
             ))}
         </div>
      </div>

      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            icon={item.icon}
          />
        ))}
      </BentoGrid>
    </section>
  );
};

const items = [
  {
    title: "Continuous Learning",
    description: "Always exploring new technologies and frameworks.",
    header: (
      <GlowingStarsBackgroundCard>
        <div className="flex flex-col items-start gap-2 h-full justify-end pb-4">
             <div className="flex flex-row flex-wrap gap-2 mb-4">
                {["React", "Next.js", "TS", "AWS", "Docker"].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white backdrop-blur-sm">
                        {tech}
                    </span>
                ))}
             </div>
             <GlowingStarsTitle text="Tech Stack" />
             <GlowingStarsDescription text="Constantly expanding my knowledge." />
        </div>
      </GlowingStarsBackgroundCard>
    ),
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "User Centric",
    description: "Designing with the user in mind at every step.",
    header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:20px_20px]" />
             <div className="relative z-10 text-6xl">🧘</div>
             <p className="text-neutral-400 text-xs mt-2 font-mono">Empathetic Design</p>
        </div>
    ),
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Clean Code",
    description: "Writing maintainable, scalable, and efficient code.",
    header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-[#1e1e1e] border border-white/10 p-4 relative overflow-hidden">
            <div className="font-mono text-xs text-neutral-400 opacity-80">
                <p><span className="text-pink-500">const</span> <span className="text-blue-400">cleanCode</span> = () <span className="text-pink-500">=&gt;</span> {"{"}</p>
                <p className="pl-4"><span className="text-pink-500">return</span> {"{"}</p>
                <p className="pl-8">readability: <span className="text-green-400">true</span>,</p>
                <p className="pl-8">modular: <span className="text-green-400">true</span>,</p>
                <p className="pl-8">efficient: <span className="text-green-400">true</span></p>
                <p className="pl-4">{"}"};</p>
                <p>{"}"};</p>
            </div>
        </div>
    ),
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Team Collaboration",
    description: "Believing in the power of teamwork and open communication.",
    header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 items-center justify-center">
            <div className="flex flex-row items-center justify-center w-full">
                <AnimatedTooltip
                    items={[
                    {
                        id: 1,
                        name: "John Doe",
                        designation: "Software Engineer",
                        image:
                        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
                    },
                    {
                        id: 2,
                        name: "Robert Johnson",
                        designation: "Product Manager",
                        image:
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
                    },
                    {
                        id: 3,
                        name: "Jane Smith",
                        designation: "Data Scientist",
                        image:
                        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
                    },
                    ]}
                />
            </div>
        </div>
    ),
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Problem Solver",
    description: "Approaching challenges with a logical and creative mindset.",
    header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-neutral-900 border border-white/10 relative overflow-hidden items-center justify-center">
            <Meteors number={20} />
            <div className="relative z-10 text-4xl transform -rotate-12 bg-white text-black font-bold px-2 py-1">
                SOLVED
            </div>
        </div>
    ),
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];
