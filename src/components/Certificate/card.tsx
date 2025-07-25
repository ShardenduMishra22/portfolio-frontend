import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Award, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface CertificationCardProps {
  title: string
  issuer: string
  description: string
  link: string
  skills?: string[]
  certificateUrl?: string
  issueDate: string
}

export default function CertificationCards({
  title,
  issuer,
  description,
  link,
  skills,
  certificateUrl,
  issueDate,
}: CertificationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  return (
    <div className="rounded-2xl h-full w-full overflow-hidden bg-gradient-to-br from-card/90 via-card to-card/80 border border-border/60 hover:border-primary/40 relative z-20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/15 backdrop-blur-sm group hover:scale-[1.02]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/[0.02] to-secondary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-50 h-full flex flex-col p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                {title}
              </h4>
              <Calendar className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
            </div>
            <p className="text-sm font-medium text-secondary">{issuer}</p>
            <p className="text-xs text-muted-foreground">{formatDate(issueDate)}</p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 flex items-center justify-center flex-shrink-0 group-hover:from-primary/25 group-hover:via-secondary/25 group-hover:to-accent/25 transition-all duration-300 group-hover:scale-105 border border-primary/20 group-hover:border-primary/40">
            <Award className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6 flex-1">
          <div className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
            <ReactMarkdown>
              {description.length > 120 ? `${description.substring(0, 120)}...` : description}
            </ReactMarkdown>
          </div>
        </div>

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs px-3 py-1 bg-background/60 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge
                  variant="secondary"
                  className="text-xs px-3 py-1 bg-muted/60 group-hover:bg-primary/20 transition-all duration-300"
                >
                  +{skills.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6 group-hover:via-primary/30 transition-colors duration-300" />

        {/* Action Buttons Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between gap-3">
            {/* Certificate Button */}
            <div className="flex items-center gap-2">
              {certificateUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 group-hover:border-secondary/50 group-hover:bg-secondary/10 group-hover:text-secondary transition-all duration-300 hover:scale-110"
                >
                  <Link
                    href={certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View Certificate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Main CTA */}
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
  )
}
