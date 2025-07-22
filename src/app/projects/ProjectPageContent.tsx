'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Project } from '../../data/types.data';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { projectsAPI } from '../../util/apiResponse.util';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Github, ExternalLink, Play, Sparkles, Code2, Zap, ChevronLeft, ChevronRight, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Input } from '@/components/ui/input';


export default function ProjectPageContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 4;
  const [selectedSkill, setSelectedSkill] = useState<string>("__all__");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('name_has')?.toLowerCase() || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
    

  const allSkills = Array.from(new Set(projects.flatMap(p => p.skills)));

  const filteredProjects = projects.filter(project => {
    const matchesSkill = selectedSkill !== "__all__" ? project.skills.includes(selectedSkill) : true;
    const matchesName = project.project_name.toLowerCase().includes(searchTerm);
    return matchesSkill && matchesName;
  });

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-destructive/5 flex items-center justify-center">
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-4">
          <Link href="/">
            <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {/* Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Portfolio Showcase</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Projects
          </h1>
          
          <p className="text-base text-foreground max-w-3xl mx-auto leading-relaxed">
            A curated collection of my latest work, experiments, and contributions to the world of code
          </p>

          {/* Stats Bar */}
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
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 items-center justify-center mb-6 px-4 py-3 rounded-lg bg-muted/50 border">
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="min-w-[140px]">
              <SelectValue placeholder="Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All Skills</SelectItem>
              {allSkills.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedSkill !== "__all__" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSelectedSkill("__all__") }}
            >
              Clear Filters
            </Button>
          )}
          
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);

              const params = new URLSearchParams(window.location.search);
              if (val) {
                params.set('name_has', val);
              } else {
                params.delete('name_has');
              }
              router.push(`?${params.toString()}`);
            }}
            className="min-w-[200px]"
          />
        </div>
        
        {/* Main Content */}
        {projects.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Card className="max-w-xl mx-auto border-2 border-dashed border-muted-foreground/25">
              <CardContent className="text-center py-12 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Code2 className="w-8 h-8 text-foreground" />
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
            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {currentProjects.map((project, index) => (
                <Card 
                  key={project.inline?.id || project.inline.id} 
                  className="group relative overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <CardTitle className="text-lg font-heading group-hover:text-primary transition-colors duration-300 leading-tight">
                          {project.project_name}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed line-clamp-2">
                          {project.small_description}
                        </CardDescription>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Code2 className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 6).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {project.skills.length > 6 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.skills.length - 6} more
                        </Badge>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        {project.project_repository && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={project.project_repository}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Repository"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.project_live_link && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={project.project_live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.project_video && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={project.project_video}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Watch Video"
                            >
                              <Play className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>

                      <Link href={`/projects/${project.inline?.id || project.inline.id}`}>
                        <Button variant="default" size="sm">
                          Details
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <>
                <div className="flex justify-center items-center space-x-2 py-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber as number)}
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
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="text-center text-sm text-foreground">
                  Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
} 