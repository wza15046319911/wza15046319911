"use client";
import React from "react";
import { skillsData } from "@/data/portfolio-data";
import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiAmazon,
  SiGooglecloud,
  SiGit,
  SiPostman,
} from "react-icons/si";
import { Code2, Workflow } from "lucide-react";

// Skill icon mapping
const skillIcons: Record<string, React.ReactNode> = {
  "React.js": <SiReact className="h-4 w-4" />,
  "Next.js": <SiNextdotjs className="h-4 w-4" />,
  TypeScript: <SiTypescript className="h-4 w-4" />,
  "Tailwind CSS": <SiTailwindcss className="h-4 w-4" />,
  Redux: <SiRedux className="h-4 w-4" />,
  "Framer Motion": <Code2 className="h-4 w-4" />,
  "Radix UI": <Code2 className="h-4 w-4" />,
  "Node.js": <SiNodedotjs className="h-4 w-4" />,
  "Express.js": <SiExpress className="h-4 w-4" />,
  Python: <SiPython className="h-4 w-4" />,
  PostgreSQL: <SiPostgresql className="h-4 w-4" />,
  MongoDB: <SiMongodb className="h-4 w-4" />,
  "Drizzle ORM": <Code2 className="h-4 w-4" />,
  Docker: <SiDocker className="h-4 w-4" />,
  Kubernetes: <SiKubernetes className="h-4 w-4" />,
  "CI/CD": <Workflow className="h-4 w-4" />,
  "GitHub Actions": <SiGithubactions className="h-4 w-4" />,
  AWS: <SiAmazon className="h-4 w-4" />,
  GCP: <SiGooglecloud className="h-4 w-4" />,
  Git: <SiGit className="h-4 w-4" />,
  Postman: <SiPostman className="h-4 w-4" />,
};

const SkillCategory = ({ title, skills }: { title: string; skills: string[] }) => {
  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="flex cursor-default items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-blue-500 hover:text-blue-400"
          >
            {skillIcons[skill] || <Code2 className="h-4 w-4" />}
            {skill}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  return (
    <section id="skills" className="bg-neutral-950 py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-5xl">
          My Tech Stack
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <SkillCategory title="Frontend" skills={skillsData.frontend} />
          <SkillCategory title="Backend" skills={skillsData.backend} />
          <SkillCategory title="Tools & DevOps" skills={skillsData.tools} />
        </div>
      </div>
    </section>
  );
};
