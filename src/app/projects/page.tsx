'use client';

import { useEffect, useState } from 'react';
import { projectsAPI } from '../../util/apiResponse.util';
import { Project } from '../../data/types.data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Github, ExternalLink, Play, Sparkles, Code2, Zap, ChevronLeft, ChevronRight, MoreHorizontal, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4; // 2 per row × 5 rows
  const [selectedSkill, setSelectedSkill] = useState<string>("__all__");

  // Extract unique skills and years from projects
  const allSkills = Array.from(new Set(projects.flatMap(p => p.skills)));


  // Filter logic
  const filteredProjects = projects.filter(project => {
    const matchesSkill = selectedSkill !== "__all__" ? project.skills.includes(selectedSkill) : true;
    return matchesSkill;
  });

  // Pagination on filteredProjects
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsAPI.getAllProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Page changed to ${page}`);
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Loading Projects</h2>
            <p className="text-foreground">Fetching amazing work...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Zap className="w-8 h-8 text-destructive" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Oops! Something went wrong</h2>
            <p className="text-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-7xl flex-1 flex flex-col">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        {/* Compact Header */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Portfolio Showcase</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Projects
          </h1>
          
          <p className="text-base text-foreground max-w-2xl mx-auto leading-relaxed">
            A curated collection of my latest work, experiments, and contributions to the world of code
          </p>

          {/* Compact Stats Bar */}
          <div className="flex justify-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{projects.length}</div>
              <div className="text-xs text-foreground">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-secondary">{totalPages}</div>
              <div className="text-xs text-foreground">Pages</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{currentPage}</div>
              <div className="text-xs text-foreground">Current Page</div>
            </div>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center justify-center mb-6 px-4 py-3 rounded-lg bg-muted/40 border border-border/30 shadow-sm">
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="min-w-[140px] px-2 py-2 rounded-md border border-border/30 bg-background focus:ring-2 focus:ring-primary/30">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Skills</SelectItem>
              {allSkills.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(selectedSkill !== "__all__" ) && (
            <Button
              variant="secondary"
              size="sm"
              className="ml-2 px-3 py-2 rounded-md border border-border/30"
              onClick={() => { setSelectedSkill("__all__")}}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Main content area - flex-1 to fill remaining space */}
        <div className="flex-1 flex flex-col">
          {projects.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <Card className="max-w-xl mx-auto border-2 border-dashed border-muted hover:border-primary/50 transition-colors duration-300">
                <CardContent className="text-center py-12 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-secondary-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading text-foreground">No projects yet</h3>
                    <p className="text-foreground text-sm">
                      Amazing projects will appear here soon. Stay tuned for updates!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Projects Grid - optimized for viewport */}
              <div className="flex-1 grid gap-4 md:grid-cols-2 mb-6">
                {currentProjects.map((project, index) => (
                  <Card 
                    key={project.inline?.id || project.inline.id} 
                    className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardHeader className="relative z-10 pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                            {project.project_name}
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed text-foreground line-clamp-2">
                            {project.small_description}
                          </CardDescription>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <Code2 className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10 flex-1 flex flex-col justify-between space-y-4">
                      {/* Skills with compact spacing */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.skills.slice(0, 6).map((skill, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 hover:border-primary/40 hover:bg-primary/20 transition-all duration-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 6 && (
                          <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/50">
                            +{project.skills.length - 6} more
                          </Badge>
                        )}
                      </div>

                      {/* Action buttons with compact styling */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {project.project_repository && (
                            <a
                              href={project.project_repository}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110 transition-all duration-300 border border-border/20 hover:border-border/40"
                              title="View Repository"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.project_live_link && (
                            <a
                              href={project.project_live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary hover:scale-110 transition-all duration-300 border border-primary/20 hover:border-primary/40"
                              title="View Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {project.project_video && (
                            <a
                              href={project.project_video}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10 hover:bg-secondary/20 text-secondary hover:scale-110 transition-all duration-300 border border-secondary/20 hover:border-secondary/40"
                              title="Watch Video"
                            >
                              <Play className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        {/* Compact CTA button */}
                        <Link href={`/projects/${project.inline?.id || project.inline.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="group/button border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-4 py-2 text-sm font-medium rounded-lg"
                          >
                            <span className="mr-2">Details</span>
                            <ExternalLink className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Compact Pagination at bottom */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border-2 border-border/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex space-x-1">
                    {getPaginationNumbers().map((pageNumber, index) => (
                      <div key={index}>
                        {pageNumber === '...' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="px-2 py-2 text-foreground"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber as number)}
                            className={`px-3 py-2 rounded-lg border-2 transition-all duration-300 ${
                              currentPage === pageNumber
                                ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                                : 'border-border/20 hover:border-primary/40 hover:bg-primary/10'
                            }`}
                          >
                            {pageNumber}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border-2 border-border/20 hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Compact page info */}
              <div className="text-center text-xs text-foreground pb-2">
                Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}