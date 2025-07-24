'use client';

import { useState } from 'react';
import { Share2, ExternalLink, Copy, Check } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Separator } from '../../../components/ui/separator';
import { ProjectHero } from '@/components/Projects/ProjectHero';
import { LoadingState } from '@/components/Projects/Load-Error';
import { useProject } from '@/components/Projects/hooks/useProject';
import { ProjectJsonLd } from '@/components/Projects/ProjectJsonLd';
import { ProjectActions } from '@/components/Projects/ProjectActions';
import { ProjectNotFound } from '@/components/Projects/ProjectNotFound';
import { ProjectDescription } from '@/components/Projects/ProjectDescription';
import { useProjectShare } from '@/components/Projects/hooks/useProjectShare.ts';
import { ProjectNavigation } from '../../../components/Projects/ProjectNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { project, loading, error } = useProject(params);
  const { handleShare, shareClicked } = useProjectShare(project);
  const skills = project?.skills || [];
  const [copyClicked, setCopyClicked] = useState(false);

  // Handle copying project info as markdown
  const handleCopyMarkdown = async () => {
    if (!project) return;
    
    const markdownContent = `# ${project.title}

${project.description || 'No description available.'}

## Technologies Used
${skills.map(skill => `- ${skill}`).join('\n')}

## Project Links
${project.project_live_link ? `- **Live Demo:** ${project.project_live_link}` : ''}
${project.project_repository ? `- **Source Code:** ${project.project_repository}` : ''}
${project.project_video ? `- **Video Demo:** ${project.project_video}` : ''}

---
*Generated from project portfolio*`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = markdownContent;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Unable to copy', err);
        }
        document.body.removeChild(textArea);
      }
      setCopyClicked(true);
      setTimeout(() => setCopyClicked(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) return <LoadingState />;
  if (error || !project) return <ProjectNotFound error={error} />;

  return (
    <>
      <ProjectJsonLd project={project} />
      
      <div className="min-h-screen bg-background">
        <ProjectNavigation 
          onShare={handleShare} 
          shareClicked={shareClicked}
          title={project.title}
        />
        
        <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
          {/* Hero Section */}
          <section className="mb-8 w-full">
            <ProjectHero project={project} />
          </section>

          {/* Balanced Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12 w-full">
            {/* Main Content - Left Side (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Project */}
              <Card className="border border-border/50 bg-card/50 min-h-[600px]">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  <ProjectDescription 
                    description={project.description}  
                    showCard={false}
                  />
                </CardContent>
              </Card>

              {/* Technologies Section - Full width under description */}
              <Card className="border border-border/50 bg-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Technologies Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                {/* Quick Actions - Split Button */}
                <Card className="border border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Share Button - Left */}
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="justify-center hover:bg-accent text-xs"
                        size="sm"
                        disabled={shareClicked}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        {shareClicked ? 'Copied!' : 'Share'}
                      </Button>
                      
                      {/* Copy Markdown Button - Right */}
                      <Button
                        variant="outline"
                        onClick={handleCopyMarkdown}
                        className="justify-center hover:bg-accent text-xs"
                        size="sm"
                        disabled={copyClicked}
                      >
                        {copyClicked ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy MD
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Interested in This Project */}
                <Card className="border border-border/50 bg-muted/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Interested in This Project?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Explore the live demo or browse the source code to understand the implementation details.
                    </p>
                    <div className="space-y-2">
                      <ProjectActions project={project} size="sm" />
                    </div>
                  </CardContent>
                </Card>

                {/* Project Highlights Card */}
                <Card className="border border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Project Highlights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Tech Stack Count */}
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {skills.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Technologies
                        </div>
                      </div>
                      
                      {/* Available Links Count */}
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {[project.project_live_link, project.project_repository, project.project_video].filter(Boolean).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Resources
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Features */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {project.project_live_link && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Live Demo
                          </Badge>
                        )}
                        {project.project_repository && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Open Source
                          </Badge>
                        )}
                        {project.project_video && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Video Demo
                          </Badge>
                        )}
                        {skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            ✓ Multi-tech
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Explore More Projects */}
                <Card className="border border-border/50 bg-card/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      Explore More Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Browse through my complete portfolio of projects
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.history.back()}
                      className="w-full justify-start group hover:bg-accent"
                      size="sm"
                    >
                      <span>Back to Projects</span>
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Project Stats (if available) */}
                {project.stats && (
                  <Card className="border border-border/50 bg-card/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Views</span>
                          <span className="font-medium">{project.stats.views || '0'}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Likes</span>
                          <span className="font-medium">{project.stats.likes || '0'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Share Button */}
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <Button
            size="lg"
            onClick={handleShare}
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
            disabled={shareClicked}
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
