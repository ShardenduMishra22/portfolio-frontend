'use client'

import { useState } from 'react'
import {
  Share2,
  ExternalLink,
  Copy,
  Check,
  ScrollText,
  ArrowDown,
  Sparkles,
  Code2,
  Rocket,
  Star,
  Github,
  Play,
  Link,
} from 'lucide-react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { Separator } from '../../../components/ui/separator'
import { ProjectHero } from '@/components/projects/ProjectHero'
import { LoadingState } from '@/components/projects/Load-Error'
import { useProject } from '@/components/projects/hooks/useProject'
import { ProjectJsonLd } from '@/components/projects/ProjectJsonLd'
import { ProjectActions } from '@/components/projects/ProjectActions'
import { ProjectNotFound } from '@/components/projects/ProjectNotFound'
import { ProjectDescription } from '@/components/projects/ProjectDescription'
import { useProjectShare } from '@/components/projects/hooks/useProjectShare.ts'
import { ProjectNavigation } from '../../../components/projects/ProjectNavigation'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { SkillsLens } from '@/components/ui/skill-lens'
import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect'
import { AnimatePresence, motion } from 'motion/react'
import { CanvasCard } from '@/components/projects/canva'

export default function ProjectDetailPage({ params }: any) {
  const { project, loading, error } = useProject(params)
  const { handleShare, shareClicked } = useProjectShare(project)
  const skills = project?.skills || []
  const [copyClicked, setCopyClicked] = useState(false)

  // Check if description is short (less than 500 characters as example)
  const isShortDescription = (project?.description?.length || 0) < 500

  // Handle copying project info as markdown
  const handleCopyMarkdown = async () => {
    if (!project) return

    const markdownContent = `# ${project.title}

${project.description || 'No description available.'}

## Technologies Used
${skills.map((skill) => `- ${skill}`).join('\n')}

## Project Links
${project.project_live_link ? `- **Live Demo:** ${project.project_live_link}` : ''}
${project.project_repository ? `- **Source Code:** ${project.project_repository}` : ''}
${project.project_video ? `- **Video Demo:** ${project.project_video}` : ''}

---
*Generated from project portfolio*`

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = markdownContent
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback: Unable to copy', err)
        }
        document.body.removeChild(textArea)
      }
      setCopyClicked(true)
      setTimeout(() => setCopyClicked(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (loading) return <LoadingState />
  if (error || !project) return <ProjectNotFound error={error} />

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
              <Card className="border border-border/50 bg-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-3">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Project Overview
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={`${isShortDescription ? 'min-h-[400px]' : 'min-h-[600px]'} flex flex-col`}
                >
                  {/* Main Description Content */}
                  <div className="flex-grow">
                    <ProjectDescription description={project.description} showCard={false} />
                  </div>

                  {/* Filler Content for Short Descriptions */}
                  {isShortDescription && (
                    <div className="mt-auto pt-8 space-y-6">
                      {/* Decorative Separator */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="h-px bg-border flex-1 max-w-20" />
                          <ScrollText className="w-4 h-4" />
                          <div className="h-px bg-border flex-1 max-w-20" />
                        </div>
                      </div>

                      {/* Project Quick Facts */}
                      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                          Project Quick Facts
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center p-3 bg-background/50 rounded-md">
                            <div className="font-semibold text-primary">{skills.length}</div>
                            <div className="text-muted-foreground">Technologies</div>
                          </div>
                          <div className="text-center p-3 bg-background/50 rounded-md">
                            <div className="font-semibold text-primary">
                              {
                                [
                                  project.project_live_link,
                                  project.project_repository,
                                  project.project_video,
                                ].filter(Boolean).length
                              }
                            </div>
                            <div className="text-muted-foreground">Resources</div>
                          </div>
                        </div>
                      </div>

                      {/* Scroll Hint */}
                      <div className="flex items-center justify-center text-muted-foreground">
                        <div className="flex items-center gap-2 text-sm">
                          <span>More details below</span>
                          <ArrowDown className="w-4 h-4 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
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
                  <SkillsLens skills={skills} />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side (1/3 width) with Canvas Effects */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-24 space-y-6">
                <CanvasCard
                  title="Get Involved"
                  icon={<Star className="h-6 w-6 text-amber-400" />}
                  canvasProps={{
                    animationSpeed: 3,
                    containerClassName: 'bg-amber-900 dark:bg-amber-900',
                    colors: [
                      [245, 158, 11],
                      [217, 119, 6],
                    ],
                    dotSize: 2,
                  }}
                >
                  <div className="space-y-4">
                    <p className="text-sm text-white/90 leading-relaxed">
                      Explore the live demo or browse the source code to understand the
                      implementation details.
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Share Button - Left */}
                      <Button
                        variant="outline"
                        onClick={handleShare}
                        className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
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
                        className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
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
                  </div>
                </CanvasCard>

                <CanvasCard
                  title="Interested in This Project?"
                  icon={<Star className="h-6 w-6" />}
                  canvasProps={{
                    animationSpeed: 2.5,
                    containerClassName: 'bg-emerald-900 dark:bg-emerald-900',
                    colors: [
                      [34, 197, 94],
                      [16, 185, 129],
                    ],
                    dotSize: 2,
                  }}
                >
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      Explore the live demo or browse the source code to understand the
                      implementation details.
                    </p>
                    <div className="space-y-2">
                      <ProjectActions project={project} size="sm" />
                    </div>
                  </div>
                </CanvasCard>

                {/* Project Highlights with Canvas Effect */}
                <CanvasCard
                  title="Project Highlights"
                  icon={<Code2 className="h-6 w-6" />}
                  canvasProps={{
                    animationSpeed: 4,
                    containerClassName: 'bg-purple-900 dark:bg-purple-900',
                    colors: [
                      [147, 51, 234],
                      [196, 181, 253],
                    ],
                    dotSize: 2.5,
                  }}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Tech Stack Count */}
                      <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">{skills.length}</div>
                        <div className="text-xs text-white/70">Technologies</div>
                      </div>

                      {/* Available Links Count */}
                      <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                        <div className="text-2xl font-bold text-white">
                          {
                            [
                              project.project_live_link,
                              project.project_repository,
                              project.project_video,
                            ].filter(Boolean).length
                          }
                        </div>
                        <div className="text-xs text-white/70">Resources</div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-white">Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {project.project_live_link && (
                          <Badge className="text-xs bg-white/20 text-white border-white/30">
                            ✓ Live Demo
                          </Badge>
                        )}
                        {project.project_repository && (
                          <Badge className="text-xs bg-white/20 text-white border-white/30">
                            ✓ Open Source
                          </Badge>
                        )}
                        {project.project_video && (
                          <Badge className="text-xs bg-white/20 text-white border-white/30">
                            ✓ Video Demo
                          </Badge>
                        )}
                        {skills.length > 5 && (
                          <Badge className="text-xs bg-white/20 text-white border-white/30">
                            ✓ Multi-tech
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CanvasCard>

                <CanvasCard
                  title="Explore All My Project And Work"
                  icon={<Link className="h-6 w-6" />}
                  canvasProps={{
                    animationSpeed: 2.5,
                    containerClassName: 'bg-pink-900 dark:bg-pink-900',
                    colors: [
                      [34, 197, 94],
                      [16, 185, 129],
                    ],
                    dotSize: 2,
                  }}
                >
                  <div className="space-y-4">
                    <p className="text-sm text-white/90 leading-relaxed">
                      Browse through my complete portfolio of projects and discover more innovative
                      solutions.
                    </p>

                    {/* Only 2 buttons - no repetition */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
                        size="sm"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Back
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = '/')}
                        className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
                        size="sm"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Home
                      </Button>
                    </div>
                  </div>
                </CanvasCard>

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
  )
}
