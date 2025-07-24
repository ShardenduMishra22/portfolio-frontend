'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project } from '@/data/types.data';
import { projectsAPI } from '@/util/apiResponse.util';
import { EmptyState, ErrorState, LoadingState } from './Load-Error';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import ProjectGrid from './project-grid';
import ProjectPagination from './project-pagination';

export default function ProjectPageContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
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

  const transformedProjects = currentProjects.map(project => ({
    title: project.project_name,
    description: project.small_description,
    link: `/projects/${project.inline?.id || project.inline.id}`,
    skills: project.skills,
    repository: project.project_repository,
    liveLink: project.project_live_link,
    video: project.project_video,
  }));

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
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set('name_has', value);
    } else {
      params.delete('name_has');
    }
    router.push(`?${params.toString()}`);
  };

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    toast.error(error, {
      style: { zIndex: 30 },
    });
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      
      {/* Top Header Bar - Left: Title, Middle: Search, Right: Navigation */}
      <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 max-w-full">
          <div className="flex items-center justify-between gap-8">
            
            {/* Left Side: Back Button + Title + Stats */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
                    Projects
                  </h1>
                </div>
                
                {/* Compact Stats */}
                <div className="hidden lg:flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-primary">{projects.length}</span>
                    <span className="text-muted-foreground">Total</span>
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-secondary">{currentPage}</span>
                    <span className="text-muted-foreground">of</span>
                    <span className="font-semibold text-secondary">{totalPages}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <Input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-10 w-full border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors bg-background/50"
              />
            </div>

            {/* Right Side: Pagination */}
            <div className="flex-shrink-0">
              {totalPages > 1 && (
                <ProjectPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={filteredProjects.length}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Filter Bar */}
      <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-3 max-w-full">
          <div className="flex items-center justify-center gap-4">
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Filter by Skill" />
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
                onClick={() => setSelectedSkill("__all__")}
                className="h-9"
              >
                Clear Filters
              </Button>
            )}
            
            {/* Mobile Stats */}
            <div className="lg:hidden flex items-center gap-3 text-sm ml-4">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-primary">{projects.length}</span>
                <span className="text-muted-foreground">Total</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1">
                <span className="font-semibold text-secondary">{currentPage}</span>
                <span className="text-muted-foreground">of</span>
                <span className="font-semibold text-secondary">{totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8 max-w-full">
          {projects.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <EmptyState />
            </div>
          ) : (
            <div className="mb-8">
              <ProjectGrid 
                items={transformedProjects} 
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              />
            </div>
          )}

          {/* Bottom Info Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-border/30 text-sm text-muted-foreground">
            <p>
              Showing {filteredProjects.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            </p>
            <p className="text-xs">
              A curated collection of my latest work and contributions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
