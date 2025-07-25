import { Heart, Coffee, Code } from 'lucide-react'
import { GoLangIcon, FedoraIcon } from '@/data/static_link'
import { techStack } from './data'

interface ProfileInfoProps {
  currentYear: number
}

export const ProfileInfo = ({ currentYear }: ProfileInfoProps) => {
  return (
    <div className="lg:col-span-1 flex flex-col h-full justify-between text-center lg:text-left">
      <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg border border-primary/20">
          <Code className="h-6 w-6 text-primary-foreground" />
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
          Shardendu Mishra
        </h3>
      </div>

      <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
        Software Engineer engineering innovative and absolutely 
      </p>
      <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6">
        awesome solutions and giving amazing user experiences.
      </p>

      <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-muted-foreground mb-6">
        <span>Made with</span>
        <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
        <span>and</span>
        <Coffee className="h-4 w-4 text-amber-600" />
        <span>by Shardendu</span>
      </div>

      <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-6">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-[11px] font-medium tracking-wide text-primary"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-center lg:justify-start space-y-2 lg:space-y-0 lg:space-x-6 flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Shardendu Mishra. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              Made <GoLangIcon /> in mind and <FedoraIcon /> in Machine.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
