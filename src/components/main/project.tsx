'use client';

import { Project } from '@/data/types.data';
import { ExternalLink, Github, Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useState } from 'react';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const getCurrentPageProjects = () =>
    projects.slice(currentPage * projectsPerPage, (currentPage + 1) * projectsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-card via-card/90 to-secondary/5 relative overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/4),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.secondary/4),transparent_70%)]"></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors shadow-lg backdrop-blur-sm">
              <Star className="mr-2 h-4 w-4 text-primary" />
              Featured Work
            </Badge>
          </div>

          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Best
            </span>{' '}
            <span className="text-foreground">Projects</span>
          </h2>

          <div className="mt-4 mx-auto w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg"></div>

          <p className="mt-8 text-lg leading-8 text-foreground max-w-2xl mx-auto font-medium">
            Showcasing top projects demonstrating technical expertise and creative problem-solving
          </p>
        </div>

        {/* Projects grid */}
        <div className="mx-auto mt-20 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {getCurrentPageProjects().map((project, index) => (
              <Card
                key={project.inline?.id || project.inline.id}
                className="group relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100 min-h-[420px]"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Number badge */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-xl border-2 border-primary/20">
                  {String(currentPage * projectsPerPage + index + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="flex-1 space-y-6">
                    <div className="pr-12">
                      <CardTitle className="text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight mb-4">
                        {project.project_name}
                      </CardTitle>
                      <CardDescription className="font-semibold text-lg text-foreground/80 flex items-center mb-4">
                        {project.small_description}
                      </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 4).map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs px-3 py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 4 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-3 py-1 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors font-medium"
                        >
                          +{project.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    {project.project_live_link && (
                      <a
                        href={project.project_live_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          size="default"
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-medium"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
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
                          size="default"
                          className="w-full border border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 font-medium"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </Button>
                      </a>
                    )}
                  </div>

                  <Link href={`/projects/${project.inline?.id || project.inline.id}`} className="mt-6 w-full">
                    <Button
                      variant="ghost"
                      size="default"
                      className="w-full group/btn relative overflow-hidden hover:bg-secondary/10 transition-all duration-300 font-medium"
                    >
                      <span className="relative flex items-center justify-center text-foreground group-hover/btn:text-secondary">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              <Button
                onClick={prevPage}
                variant="outline"
                size="lg"
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                        : 'bg-card hover:bg-primary/5 border border-primary/20 hover:border-primary/30 text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={nextPage}
                variant="outline"
                size="lg"
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300"
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}

          {/* Summary info */}
          <div className="mt-12 text-center">
            <p className="text-foreground/60 text-sm">
              Showing {getCurrentPageProjects().length} of {projects.length} projects
            </p>
          </div>

          {projects.length > 4 && (
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-card via-card/90 to-card rounded-2xl border border-border/50 backdrop-blur-sm shadow-lg">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">More Projects</h3>
                  <p className="text-sm text-foreground/70 mt-1">
                    Explore {projects.length - 4} additional projects
                  </p>
                </div>
                <Link href="/projects">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:border-primary/50 transition-all duration-300"
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
