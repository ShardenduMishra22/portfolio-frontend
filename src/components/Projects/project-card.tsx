import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectCardProps } from '@/data/static_link';
import { Github, ExternalLink, Play, Code2, Sparkles } from 'lucide-react';

export default function ProjectCards({
  title,
  description,
  link,
  skills,
  repository,
  liveLink,
  video,
}: ProjectCardProps) {
  return (
    <div className="rounded-2xl h-full w-full overflow-hidden bg-gradient-to-br from-card/90 via-card to-card/80 border border-border/60 hover:border-primary/40 relative z-20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 backdrop-blur-sm group hover:scale-[1.02]">
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.02] to-secondary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-50 h-full flex flex-col p-6">
        
        {/* Header Section - More Compact */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {title}
              </h4>
              <Sparkles className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
              {description}
            </p>
          </div>
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:via-secondary/25 group-hover:to-accent/25 transition-all duration-300 group-hover:scale-105 border border-primary/20 group-hover:border-primary/40">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Skills Section - Compact */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 6).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-3 py-1 bg-background/60 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 6 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs px-3 py-1 bg-muted/60 group-hover:bg-primary/20 transition-all duration-300"
                >
                  +{skills.length - 6}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6 group-hover:via-primary/30 transition-colors duration-300" />

        {/* Action Buttons Section - Compact */}
        <div className="mt-auto">
          <div className="flex items-center justify-between gap-3">
            
            {/* Quick Actions - Smaller buttons */}
            <div className="flex items-center gap-2">
              {repository && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 hover:scale-110"
                >
                  <Link
                    href={repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Repository"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              
              {liveLink && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 group-hover:border-secondary/50 group-hover:bg-secondary/10 group-hover:text-secondary transition-all duration-300 hover:scale-110"
                >
                  <Link
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Live Demo"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              
              {video && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 group-hover:border-accent/50 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-300 hover:scale-110"
                >
                  <Link
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Watch Video"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Play className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Main CTA - Compact */}
            <Button 
              variant="default" 
              size="sm" 
              asChild
              className="h-9 px-6 bg-gradient-to-r from-primary via-secondary to-accent group-hover:from-primary/90 group-hover:via-secondary/90 group-hover:to-accent/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 text-white font-medium hover:scale-105"
            >
              <Link href={link} className="flex items-center gap-2">
                Details
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
