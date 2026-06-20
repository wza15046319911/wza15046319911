"use client";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconClipboardCopy,
  IconTableColumn,
  IconFileBroken,
  IconSignature,
  IconBrandGithub,
  IconChartBar,
  IconCpu,
  IconUsers,
  IconGitPullRequest,
  IconMessageCircle,
  IconBox,
} from "@tabler/icons-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
} from "react-icons/si";
import { aboutData } from "@/data/portfolio-data";
import NumberTicker from "@/components/ui/number-ticker";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/components/ui/glowing-stars";
import { Meteors } from "@/components/ui/meteors";

export const About = () => {
  return (
    <section id="about" className="bg-black py-20">
      <div className="mx-auto mb-10 max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">{aboutData.title}</h2>
        <p className="max-w-3xl text-lg text-neutral-400">{aboutData.description}</p>

        <div className="mt-8 flex gap-10">
          {aboutData.stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center text-3xl font-bold text-white">
                <NumberTicker value={stat.value} className="text-white" />
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <span className="text-neutral-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <BentoGrid className="mx-auto max-w-7xl md:auto-rows-[20rem]">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            className={item.className}
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
        <div className="flex h-full flex-col items-start justify-end gap-2 pb-4">
          <div className="mb-4 flex flex-row flex-wrap gap-2">
            {["React", "Next.js", "TS", "AWS", "Docker"].map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-white/10 px-2 py-1 text-xs text-white backdrop-blur-sm"
              >
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
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
        <div className="bg-grid-white/[0.03] absolute inset-0 bg-[length:20px_20px]" />
        <div className="relative z-10 text-6xl">🧘</div>
        <p className="mt-2 font-mono text-xs text-neutral-400">Empathetic Design</p>
      </div>
    ),
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Clean Code",
    description: "Writing maintainable, scalable, and efficient code.",
    header: (
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] p-4">
        <div className="font-mono text-xs text-neutral-400 opacity-80">
          <p>
            <span className="text-pink-500">const</span>{" "}
            <span className="text-blue-400">cleanCode</span> = (){" "}
            <span className="text-pink-500">=&gt;</span> {"{"}
          </p>
          <p className="pl-4">
            <span className="text-pink-500">return</span> {"{"}
          </p>
          <p className="pl-8">
            readability: <span className="text-green-400">true</span>,
          </p>
          <p className="pl-8">
            modular: <span className="text-green-400">true</span>,
          </p>
          <p className="pl-8">
            efficient: <span className="text-green-400">true</span>
          </p>
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
      <div className="flex h-full min-h-[6rem] w-full flex-1 items-center justify-center rounded-xl border border-white/10 bg-neutral-900">
        <div className="flex items-center -space-x-3">
          {[IconUsers, IconGitPullRequest, IconMessageCircle, IconBox].map((Icon, i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 bg-gradient-to-br from-neutral-700 to-neutral-800 ring-1 ring-white/10"
            >
              <Icon className="h-5 w-5 text-neutral-200" />
            </div>
          ))}
        </div>
      </div>
    ),
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Problem Solver",
    description: "Approaching challenges with a logical and creative mindset.",
    header: (
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
        <Meteors number={20} />
        <div className="relative z-10 -rotate-12 transform bg-white px-2 py-1 text-4xl font-bold text-black">
          SOLVED
        </div>
      </div>
    ),
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "GitHub Stats",
    description: "A quick summary of my open source contributions.",
    header: (
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-4">
        <img
          src="/assets/github-stats/tokyonight/0-profile-details.svg"
          alt="GitHub Profile Details"
          className="h-full w-full object-contain"
        />
      </div>
    ),
    icon: <IconChartBar className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-2",
  },
  {
    title: "Top Languages",
    description: "The languages I use the most.",
    header: (
      <div className="flex h-full min-h-[6rem] w-full flex-1 flex-wrap items-center justify-center gap-4 rounded-xl border border-white/10 bg-neutral-900 p-4">
        <SiReact className="h-8 w-8 text-blue-400" />
        <SiNextdotjs className="h-8 w-8 text-white" />
        <SiTypescript className="h-8 w-8 text-blue-600" />
        <SiPython className="h-8 w-8 text-yellow-400" />
        <SiNodedotjs className="h-8 w-8 text-green-500" />
        <SiPostgresql className="h-8 w-8 text-blue-300" />
      </div>
    ),
    icon: <IconCpu className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-1",
  },
  {
    title: "Code Contributions",
    description: "My coding activity over the last year.",
    header: (
      <div className="relative flex h-full min-h-[6rem] w-full flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-4">
        <img
          src="/assets/github-snake.svg"
          alt="GitHub Contributions Snake"
          className="h-full w-full object-contain"
        />
      </div>
    ),
    icon: <IconBrandGithub className="h-4 w-4 text-neutral-500" />,
    className: "md:col-span-3",
  },
];
