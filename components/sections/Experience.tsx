"use client";
import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { experienceData } from "@/data/portfolio-data";

export const Experience = () => {
  const parseDescription = (description: string) => {
    const lines = description.split("\n");
    const projectDesc = lines[0];
    const techLine = lines.find((line) => line.startsWith("Technologies:"));
    const technologies = techLine ? techLine.replace("Technologies: ", "") : "";
    const bullets = lines
      .filter((line) => line.trim().startsWith("•"))
      .map((line) => line.trim().replace("•", "").trim())
      .slice(0, 5);

    return { projectDesc, technologies, bullets };
  };

  const data = experienceData.items.map((item) => {
    const { projectDesc, technologies, bullets } = parseDescription(item.description);

    return {
      title: item.period,
      content: (
        <div>
          <h3 className="mb-2 text-xl font-bold text-white">{item.title}</h3>
          <h4 className="mb-4 text-lg font-semibold text-blue-500">{item.company}</h4>
          {projectDesc && (
            <p className="mb-3 text-sm leading-relaxed text-neutral-300 md:text-base">
              {projectDesc}
            </p>
          )}
          {technologies && (
            <p className="mb-4 text-sm text-neutral-400 md:text-base">
              <span className="font-semibold text-neutral-300">Technologies:</span>{" "}
              <span className="text-neutral-400">{technologies}</span>
            </p>
          )}
          {bullets.length > 0 && (
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-neutral-400 md:text-base">
              {bullets.map((bullet, index) => (
                <li key={index} className="flex items-start">
                  <span className="mt-1.5 mr-3 flex-shrink-0 text-blue-500">•</span>
                  <span className="flex-1">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    };
  });

  return (
    <section id="experience" className="bg-neutral-950">
      <Timeline data={data} title={experienceData.title} description={experienceData.description} />
    </section>
  );
};
