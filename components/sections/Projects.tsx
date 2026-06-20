"use client";
import React from "react";
import { projectsData } from "@/data/portfolio-data";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import Image from "next/image";
import { BentoGrid } from "../ui/bento-grid";
import { WobbleCard } from "../ui/wobble-card";
import { LinkPreview } from "../ui/link-preview";

const layoutByTitle: Record<string, string> = {
  Piggyway: "col-span-1 md:col-span-2 bg-pink-900/20",
  "Nothing But Fun": "col-span-1 md:col-span-1 md:row-span-2 bg-indigo-900/20",
  StudyPilot: "col-span-1 md:col-span-2 bg-blue-900/20",
  "UQ Ask Anything": "col-span-1 md:col-span-3 md:row-span-2 bg-purple-900/20",
};

export const Projects = () => {
  return (
    <section id="projects" className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-5xl">
          Featured Projects
        </h2>

        <BentoGrid className="mx-auto max-w-7xl md:auto-rows-[20rem]">
          {projectsData.map((project) => {
            const isMobileApp = project.title === "Nothing But Fun";
            const isPortrait = project.title === "UQ Ask Anything";
            const containerClass = layoutByTitle[project.title] ?? "col-span-1 md:col-span-2";

            return (
              <WobbleCard key={project.id} containerClassName={containerClass}>
                <div className="flex h-full flex-col justify-between">
                  <div
                    className={`relative z-10 ${
                      isMobileApp ? "" : isPortrait ? "md:max-w-[55%]" : "max-w-[55%]"
                    }`}
                  >
                    <h3 className="text-left text-base/tight font-bold text-white md:text-xl lg:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-left text-base/tight text-neutral-200">
                      {project.description}
                    </p>

                    <div
                      className="group/marquee mt-4 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]"
                    >
                      <div
                        className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
                        style={
                          {
                            "--marquee-duration": `${project.tech.length * 2.2}s`,
                          } as React.CSSProperties
                        }
                      >
                        {[...project.tech, ...project.tech].map((t, idx) => (
                          <span
                            key={idx}
                            className="mr-2 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-xs text-white"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      {project.link ? (
                        <LinkPreview
                          url={project.link}
                          className="flex items-center gap-2 text-sm font-medium text-white hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </LinkPreview>
                      ) : project.wechatInfo ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <span>{project.wechatInfo}</span>
                        </div>
                      ) : null}
                      {project.github ? (
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm font-medium text-white hover:underline"
                        >
                          <SiGithub className="h-4 w-4" /> GitHub
                        </Link>
                      ) : null}
                    </div>
                  </div>

                  {isMobileApp ? (
                    <div className="relative mt-10 h-full w-full">
                      <Image
                        src={project.img}
                        alt={project.title}
                        width={500}
                        height={800}
                        className="absolute -right-10 -bottom-10 w-[80%] rounded-2xl object-cover md:-right-[20%] lg:-right-[10%]"
                      />
                      <div className="absolute bottom-4 left-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                        <Image
                          src="/IMG_6435.JPG"
                          alt="Mini Program QR Code"
                          width={100}
                          height={100}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  ) : isPortrait ? (
                    <div className="pointer-events-none absolute inset-y-8 right-4 hidden w-[40%] md:block lg:right-10">
                      <Image
                        src={project.img}
                        width={780}
                        height={903}
                        alt={project.title}
                        className="h-full w-full rounded-2xl object-cover object-top"
                      />
                    </div>
                  ) : (
                    <Image
                      src={project.img}
                      width={600}
                      height={400}
                      alt={project.title}
                      className="absolute -right-4 -bottom-10 w-1/2 rounded-2xl object-cover md:-right-[20%] lg:-right-[5%]"
                    />
                  )}
                </div>
              </WobbleCard>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
};
