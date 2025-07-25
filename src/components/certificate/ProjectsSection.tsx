'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, FolderOpen, Code2, Rocket, Star } from 'lucide-react'
import { Certification } from '@/data/types.data'
import { CanvasCard } from './canva'

interface ProjectsSectionProps {
  certification: Certification
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ certification }) => {
  if (!certification.projects || certification.projects.length === 0) {
    return null
  }

  return (
    <Card className="border border-border/50 bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="w-1 h-5 bg-primary rounded-full" />
          Related Projects
        </CardTitle>
        <CardDescription>Projects completed during this certification journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certification.projects.map((id, index) => (
            <CanvasCard
              key={id}
              title={`Project ${index + 1}`}
              icon={<FolderOpen className="h-6 w-6 text-emerald-400" />}
              animationSpeed={2.5 + index * 0.3}
              containerClassName="bg-emerald-900"
              colors={[
                [34, 197, 94],
                [16, 185, 129],
              ]}
              dotSize={1.6}
            >
              <div className="space-y-4">
                <div className="w-full h-48 bg-background/20 rounded-lg border border-white/20 overflow-hidden">
                  <iframe
                    src={`/projects/${id}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title={`Project ${id}`}
                    className="w-full h-full"
                    style={{
                      border: 'none',
                      transform: 'scale(0.45)',
                      transformOrigin: 'top left',
                      width: '220%',
                      height: '250%',
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-white/20 text-white border-white/30">
                      <Code2 className="w-3 h-3 mr-1" />
                      Implementation
                    </Badge>
                    <Badge className="text-xs bg-white/20 text-white border-white/30">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <p className="text-white/80 text-sm">
                    Practical application of certification concepts and methodologies.
                  </p>

                  <Link href={`/projects/${id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/30 text-white hover:bg-white/20"
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Explore Project
                    </Button>
                  </Link>
                </div>
              </div>
            </CanvasCard>
          ))}
        </div>

        {certification.projects.length > 6 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              And {certification.projects.length - 6} more projects showcasing advanced
              implementations...
            </p>
            <Link href="/projects">
              <Button variant="outline" className="flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                View All Projects
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
