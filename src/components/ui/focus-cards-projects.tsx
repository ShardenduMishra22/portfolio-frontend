"use client";

import Link from 'next/link'
import { Badge } from './badge'
import { Button } from './button'
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Project } from '@/data/types.data'
import { Card, CardDescription, CardTitle } from './card'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'

export const ProjectFocusCard = React.memo(
  ({
    project,
    index,
    hovered,
    setHovered,
    startIndex,
    windowWidth,
  }: {
    project: Project;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    startIndex: number;
    windowWidth: number;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-70"
      )}
    >
      <Card className="group relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100 min-h-[380px] sm:min-h-[420px]">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Responsive number badge */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-lg sm:shadow-xl border border-primary/20 sm:border-2">
          {String(startIndex + index + 1).padStart(2, '0')}
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 h-full flex flex-col">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="pr-10 sm:pr-12">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight mb-2 sm:mb-4">
                {project.project_name}
              </CardTitle>
              <CardDescription className="font-medium sm:font-semibold text-sm sm:text-base lg:text-lg text-foreground/80 flex items-center mb-3 sm:mb-4 line-clamp-2">
                {project.small_description}
              </CardDescription>
            </div>

            {/* Responsive skills badges */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.skills.slice(0, windowWidth < 640 ? 3 : 4).map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors font-medium"
                >
                  {skill}
                </Badge>
              ))}
              {project.skills.length > (windowWidth < 640 ? 3 : 4) && (
                <Badge
                  variant="outline"
                  className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors font-medium"
                >
                  +{project.skills.length - (windowWidth < 640 ? 3 : 4)} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons - responsive layout */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <div className="flex gap-2 sm:gap-3">
              {project.project_live_link && (
                <a
                  href={project.project_live_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    size={windowWidth < 640 ? "sm" : "default"}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-medium touch-manipulation"
                  >
                    <ExternalLink className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Live Demo</span>
                  </Button>
                </a>
              )}

              {project.project_repository && (
                <a
                  href={project.project_repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    size={windowWidth < 640 ? "sm" : "default"}
                    className="w-full border border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 font-medium touch-manipulation"
                  >
                    <Github className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Code</span>
                  </Button>
                </a>
              )}
            </div>

            <Link href={`/projects/${project.inline?.id || project.inline.id}`} className="w-full sm:mt-0">
              <Button
                variant="ghost"
                size={windowWidth < 640 ? "sm" : "default"}
                className="w-full group/btn relative overflow-hidden hover:bg-secondary/10 transition-all duration-300 font-medium touch-manipulation"
              >
                <span className="relative flex items-center justify-center text-foreground group-hover/btn:text-secondary text-xs sm:text-sm">
                  View Details
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
);

ProjectFocusCard.displayName = "ProjectFocusCard";

export function ProjectFocusCards({ 
  projects, 
  startIndex, 
  windowWidth 
}: { 
  projects: Project[];
  startIndex: number;
  windowWidth: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-8 sm:mt-16 lg:mt-20 max-w-7xl">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectFocusCard
            key={project.inline?.id || project.inline.id}
            project={project}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            startIndex={startIndex}
            windowWidth={windowWidth}
          />
        ))}
      </div>
    </div>
  );
}
