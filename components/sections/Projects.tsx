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
    <section id="projects" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 text-center">Featured Projects</h2>
        
        <div className="space-y-20">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;
            
            // Different 3D effects and directions for each project
            const effects = [
              { imgZ: 120, titleZ: 50, descZ: 60, btnZ: 25, rotateY: 0, direction: "normal" as const }, // First: standard
              { imgZ: 100, titleZ: 40, descZ: 50, btnZ: 20, rotateY: 5, direction: "reverse" as const }, // Second: reverse
              { imgZ: 140, titleZ: 60, descZ: 70, btnZ: 30, rotateY: -5, direction: "alternate" as const }, // Third: alternate
            ];
            const effect = effects[index % effects.length];
            
            return (
              <CardContainer key={project.id} className="inter-var w-full" direction={effect.direction}>
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                  {/* Image Section */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <CardItem 
                      translateZ={effect.imgZ} 
                      rotateY={effect.rotateY}
                      className="w-full"
                    >
                      <div className="h-64 md:h-80 w-full bg-neutral-800 rounded-xl group-hover/card:shadow-xl overflow-hidden relative">
                        {project.img ? (
                          <Image
                            src={project.img}
                            height={800}
                            width={1200}
                            className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
                            alt={`${project.title} screenshot`}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-neutral-500">
                            <span>Project Image</span>
                          </div>
                        )}
                      </div>
                    </CardItem>
                  </div>

                  {/* Content Section */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <CardBody className="bg-neutral-900 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
                      <CardItem
                        translateZ={effect.titleZ}
                        rotateY={-effect.rotateY * 0.5}
                        className="text-2xl md:text-3xl font-bold text-neutral-600 dark:text-white mb-4"
                      >
                        {project.title}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ={effect.descZ}
                        rotateY={-effect.rotateY * 0.3}
                        className="text-neutral-500 text-sm md:text-base max-w-sm mt-2 dark:text-neutral-300 mb-6"
                      >
                        {project.description}
                      </CardItem>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tech.map((t, i) => (
                          <span key={i} className="text-xs text-neutral-400 bg-neutral-800 px-3 py-1 rounded">{t}</span>
                        ))}
                      </div>

                      <div className="flex gap-4 items-center">
                        {project.link ? (
                          <CardItem
                            translateZ={effect.btnZ}
                            rotateY={-effect.rotateY * 0.2}
                            as={Link}
                            href={project.link}
                            target="__blank"
                            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white hover:underline"
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" /> Live Demo
                            </div>
                          </CardItem>
                        ) : (project as any).wechatInfo ? (
                          <CardItem
                            translateZ={effect.btnZ}
                            rotateY={-effect.rotateY * 0.2}
                            className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
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
                          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:opacity-80 transition-opacity"
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
