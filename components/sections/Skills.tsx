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
  "React.js": <SiReact className="w-4 h-4" />,
  "Next.js": <SiNextdotjs className="w-4 h-4" />,
  "TypeScript": <SiTypescript className="w-4 h-4" />,
  "Tailwind CSS": <SiTailwindcss className="w-4 h-4" />,
  "Redux": <SiRedux className="w-4 h-4" />,
  "Framer Motion": <Code2 className="w-4 h-4" />,
  "Radix UI": <Code2 className="w-4 h-4" />,
  "Node.js": <SiNodedotjs className="w-4 h-4" />,
  "Express.js": <SiExpress className="w-4 h-4" />,
  "Python": <SiPython className="w-4 h-4" />,
  "PostgreSQL": <SiPostgresql className="w-4 h-4" />,
  "MongoDB": <SiMongodb className="w-4 h-4" />,
  "Drizzle ORM": <Code2 className="w-4 h-4" />,
  "Docker": <SiDocker className="w-4 h-4" />,
  "Kubernetes": <SiKubernetes className="w-4 h-4" />,
  "CI/CD": <Workflow className="w-4 h-4" />,
  "GitHub Actions": <SiGithubactions className="w-4 h-4" />,
  "AWS": <SiAmazon className="w-4 h-4" />,
  "GCP": <SiGooglecloud className="w-4 h-4" />,
  "Git": <SiGit className="w-4 h-4" />,
  "Postman": <SiPostman className="w-4 h-4" />,
};

const SkillCategory = ({ title, skills }: { title: string; skills: string[] }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full text-neutral-300 text-sm hover:border-blue-500 hover:text-blue-400 transition-colors cursor-default flex items-center gap-2"
          >
            {skillIcons[skill] || <Code2 className="w-4 h-4" />}
            {skill}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  return (
    <section id="skills" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">My Tech Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <SkillCategory title="Frontend" skills={skillsData.frontend} />
           <SkillCategory title="Backend" skills={skillsData.backend} />
           <SkillCategory title="Tools & DevOps" skills={skillsData.tools} />
        </div>
      </div>
    </section>
  );
};
