import { Sparkles } from 'lucide-react'
import { ProjectHeaderProps } from '@/data/static_link'

export default function ProjectHeader({
  totalProjects,
  totalPages,
  currentPage,
}: ProjectHeaderProps) {
  return (
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
          <div className="text-xl font-bold text-primary">{totalProjects}</div>
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
  )
}
