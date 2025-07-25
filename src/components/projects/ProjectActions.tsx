import { Button } from '../ui/button'
import { Project } from '../../data/types.data'
import { Github, Globe, Video } from 'lucide-react'
import Link from 'next/link'

interface ProjectActionsProps {
  project: Project
  size?: 'sm' | 'default' | 'lg'
}

export function ProjectActions({ project, size = 'default' }: ProjectActionsProps) {
  // icon sizes keyed by our size prop
  const iconSizes = { sm: 16, default: 20, lg: 24 }
  const iconSize = iconSizes[size]

  // describe each possible action
  const actions = [
    {
      key: 'live',
      href: project.project_live_link,
      label: 'Live Demo',
      icon: Globe,
      variant: 'default' as const,
    },
    {
      key: 'code',
      href: project.project_repository,
      label: 'View Code',
      icon: Github,
      variant: 'outline' as const,
    },
    {
      key: 'video',
      href: project.project_video,
      label: 'Watch Demo',
      icon: Video,
      variant: 'outline' as const,
    },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {actions
        .filter((action) => !!action.href)
        .map(({ key, href, label, icon: Icon, variant }) => (
          <Link
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group"
          >
            <Button
              variant={variant}
              size={size}
              className="
                flex items-center gap-2
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                group-hover:bg-accent/10
              "
            >
              <Icon size={iconSize} className="flex-shrink-0 text-foreground" />
              <span className="whitespace-nowrap">{label}</span>
            </Button>
          </Link>
        ))}
    </div>
  )
}
