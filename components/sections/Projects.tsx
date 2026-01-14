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

export const Projects = () => {
  // We want to order the projects specifically: Piggyway (0), Nothing But Fun (1), StudyPilot (2)
  // But render order for grid: 0 (2 cols), 1 (1 col, 2 rows), 2 (2 cols)
  const piggyway = projectsData.find((p) => p.title === "Piggyway");
  const nothingButFun = projectsData.find((p) => p.title === "Nothing But Fun");
  const studyPilot = projectsData.find((p) => p.title === "StudyPilot");

  // Reconstruct the array in the render order we want (which happens to be the same as data order 0, 1, 2)
  // But we need to be explicit about it for the layout logic
  const projects = [piggyway, nothingButFun, studyPilot].filter(Boolean) as typeof projectsData;

  return (
    <section id="projects" className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="mb-10 text-center text-3xl font-bold text-white md:text-5xl">
          Featured Projects
        </h2>

        <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem]">
          {projects.map((project, i) => {
            const isMobileApp = project.title === "Nothing But Fun";
            
            // Define column and row spans
            // Piggyway (0): col-span-2
            // Nothing But Fun (1): col-span-1 row-span-2
            // StudyPilot (2): col-span-2
            
            let containerClass = "";
            let minHeightClass = "";
            
            if (project.title === "Piggyway") {
              containerClass = "col-span-1 md:col-span-2 bg-pink-900/20";
              minHeightClass = "min-h-[300px]";
            } else if (project.title === "Nothing But Fun") {
              containerClass = "col-span-1 md:col-span-1 md:row-span-2 bg-indigo-900/20";
              minHeightClass = "min-h-[500px] md:min-h-full";
            } else if (project.title === "StudyPilot") {
              containerClass = "col-span-1 md:col-span-2 bg-blue-900/20";
              minHeightClass = "min-h-[300px]";
            }

            // Image Override for Mobile App
            const imgSrc = isMobileApp 
              ? "https://res.cloudinary.com/davy7cgyi/image/upload/v1768392592/427shots_so_sz1apq.png"
              : project.img;

            return (
              <WobbleCard
                key={project.id}
                containerClassName={containerClass}
                className=""
              >
                <div className={`h-full flex flex-col ${isMobileApp ? 'justify-between' : 'justify-between'}`}>
                  
                  {/* Content Header */}
                  <div className={`relative z-10 ${isMobileApp ? "" : "max-w-[55%]"}`}>
                    <h3 className="text-left text-base/tight font-bold text-white md:text-xl lg:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-left text-base/tight text-neutral-200">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack - simplified */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.slice(0, 4).map((t, idx) => (
                        <span key={idx} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                          {t}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                          +{project.tech.length - 4}
                        </span>
                      )}
                    </div>

                     {/* Links */}
                    <div className="mt-4 flex items-center gap-4">
                      {project.link ? (
                        <LinkPreview
                          url={project.link}
                          className="flex items-center gap-2 text-sm font-medium text-white hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" /> Live Demo
                        </LinkPreview>
                      ) : (project as any).wechatInfo ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          <span>{(project as any).wechatInfo}</span>
                        </div>
                      ) : null}
                      <Link
                        href={project.github}
                        target="__blank"
                        className="flex items-center gap-2 text-sm font-medium text-white hover:underline"
                      >
                        <SiGithub className="h-4 w-4" /> GitHub
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  {isMobileApp ? (
                    <div className="relative mt-10 h-full w-full">
                       <Image
                        src={imgSrc}
                        alt={project.title}
                        width={500}
                        height={800}
                        className="absolute -right-10 -bottom-10 w-[80%] rounded-2xl object-cover md:-right-[20%] lg:-right-[10%]"
                      />
                      {/* Fake QR Code */}
                       <div className="absolute bottom-4 left-4 h-16 w-16 bg-white p-1 rounded-lg flex items-center justify-center">
                          <div className="w-full h-full border-2 border-black border-dashed flex items-center justify-center text-[8px] text-black font-bold text-center">
                             QR CODE
                          </div>
                       </div>
                    </div>
                  ) : (
                    <Image
                      src={imgSrc}
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
