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

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-800" />
);

const items = [
  {
    title: "Continuous Learning",
    description: "Always exploring new technologies and frameworks.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "User Centric",
    description: "Designing with the user in mind at every step.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Clean Code",
    description: "Writing maintainable, scalable, and efficient code.",
    header: <Skeleton />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Team Collaboration",
    description: "Believing in the power of teamwork and open communication.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Problem Solver",
    description: "Approaching challenges with a logical and creative mindset.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
];
