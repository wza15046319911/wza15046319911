"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { projectsData } from "@/data/portfolio-data";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Image from "next/image";

export const Projects = () => {
  return (
    <section id="projects" className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-5xl">
          Featured Projects
        </h2>

        <div className="space-y-20">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;

            // Different 3D effects and directions for each project
            const effects = [
              {
                imgZ: 120,
                titleZ: 50,
                descZ: 60,
                btnZ: 25,
                rotateY: 0,
                direction: "normal" as const,
              }, // First: standard
              {
                imgZ: 100,
                titleZ: 40,
                descZ: 50,
                btnZ: 20,
                rotateY: 5,
                direction: "reverse" as const,
              }, // Second: reverse
              {
                imgZ: 140,
                titleZ: 60,
                descZ: 70,
                btnZ: 30,
                rotateY: -5,
                direction: "alternate" as const,
              }, // Third: alternate
            ];
            const effect = effects[index % effects.length];

            return (
              <CardContainer
                key={project.id}
                className="inter-var w-full"
                direction={effect.direction}
              >
                <div
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
                >
                  {/* Image Section */}
                  <div className={`w-full md:w-1/2 ${isEven ? "md:order-1" : "md:order-2"}`}>
                    <CardItem translateZ={effect.imgZ} rotateY={effect.rotateY} className="w-full">
                      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-neutral-800 group-hover/card:shadow-xl md:h-80">
                        {project.img ? (
                          <Image
                            src={project.img}
                            height={800}
                            width={1200}
                            className="h-full w-full rounded-xl object-cover group-hover/card:shadow-xl"
                            alt={`${project.title} screenshot`}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-500">
                            <span>Project Image</span>
                          </div>
                        )}
                      </div>
                    </CardItem>
                  </div>

                  {/* Content Section */}
                  <div className={`w-full md:w-1/2 ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <CardBody className="group/card relative h-auto w-full rounded-xl border border-black/[0.1] bg-neutral-900 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
                      <CardItem
                        translateZ={effect.titleZ}
                        rotateY={-effect.rotateY * 0.5}
                        className="mb-4 text-2xl font-bold text-neutral-600 md:text-3xl dark:text-white"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ={effect.descZ}
                        rotateY={-effect.rotateY * 0.3}
                        className="mt-2 mb-6 max-w-sm text-sm text-neutral-500 md:text-base dark:text-neutral-300"
                      >
                        {project.description}
                      </CardItem>

                      <div className="mb-6 flex flex-wrap gap-2">
                        {project.tech.map((t, i) => (
                          <span
                            key={i}
                            className="rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {project.link ? (
                          <CardItem
                            translateZ={effect.btnZ}
                            rotateY={-effect.rotateY * 0.2}
                            as={Link}
                            href={project.link}
                            target="__blank"
                            className="rounded-xl px-4 py-2 text-xs font-normal hover:underline dark:text-white"
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" /> Live Demo
                            </div>
                          </CardItem>
                        ) : (project as any).wechatInfo ? (
                          <CardItem
                            translateZ={effect.btnZ}
                            rotateY={-effect.rotateY * 0.2}
                            className="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
                          >
                            <div className="flex items-center gap-2">
                              <span>{(project as any).wechatInfo}</span>
                            </div>
                          </CardItem>
                        ) : null}
                        <CardItem
                          translateZ={effect.btnZ}
                          rotateY={-effect.rotateY * 0.2}
                          as={Link}
                          href={project.github}
                          target="__blank"
                          className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
                        >
                          <div className="flex items-center gap-2">
                            <SiGithub className="h-4 w-4" /> GitHub
                          </div>
                        </CardItem>
                      </div>
                    </CardBody>
                  </div>
                </div>
              </CardContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
};
