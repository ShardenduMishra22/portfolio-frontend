import { Badge } from '@/components/ui/badge'
import { Repository } from '@/data/types.data'
import { BookOpen, Star, ExternalLink } from 'lucide-react'

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  color: string
  iconColor: string
  fullWidth?: boolean
}

export const StatsCard = ({
  icon: Icon,
  label,
  value,
  color,
  iconColor,
  fullWidth = false,
}: StatsCardProps) => (
  <div
    className={`p-4 bg-gradient-to-r ${color} rounded-xl border backdrop-blur-sm hover:scale-105 transition-transform ${fullWidth ? 'col-span-full' : ''}`}
  >
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-bold text-foreground">{value}</p>
      </div>
    </div>
  </div>
)

interface DifficultyCardProps {
  difficulty: string
  count: number
  color: string
}

export const DifficultyCard = ({ difficulty, count, color }: DifficultyCardProps) => (
  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors">
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 ${color} rounded-full`}></div>
      <span className="font-medium text-foreground">{difficulty}</span>
    </div>
    <Badge variant="secondary" className="font-bold">
      {count}
    </Badge>
  </div>
)

interface LanguageBarProps {
  language: {
    id: string
    label: string
    value: number
    color: string
  }
}

export const LanguageBar = ({ language }: LanguageBarProps) => {
  const usageDescriptions: Record<string, string> = {
    TypeScript: 'Frontend & Backend Development',
    JavaScript: 'Web Development & Scripting',
    Python: 'Data Science & Backend',
    Go: 'Microservices & DevOps',
    Java: 'Enterprise Applications',
    'C++': 'System Programming',
    HTML: 'Web Structure',
    CSS: 'Web Styling',
  }

  return (
    <div className="group p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: language.color }} />
          <span className="font-medium text-foreground text-sm">{language.label}</span>
        </div>
        <span className="text-sm font-bold text-foreground">{language.value}%</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-1">
        <div
          className="h-2 rounded-full transition-all duration-500 group-hover:shadow-lg"
          style={{
            width: `${language.value}%`,
            backgroundColor: language.color,
          }}
        />
      </div>

      {usageDescriptions[language.label] && (
        <p className="text-xs text-muted-foreground">{usageDescriptions[language.label]}</p>
      )}
    </div>
  )
}

interface RepoCardProps {
  repo: Repository
  index: number
}

export const RepoCard = ({ repo, index }: RepoCardProps) => (
  <a
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group/repo block p-4 bg-card/50 rounded-xl border hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2 bg-primary/10 rounded-lg group-hover/repo:bg-primary/20 transition-colors">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-foreground group-hover/repo:text-primary transition-colors truncate">
            {repo.name}
          </p>
          <p className="text-sm text-muted-foreground">Repository</p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
          <Star className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-foreground">{repo.stars}</span>
        </div>
        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover/repo:text-primary transition-colors" />
      </div>
    </div>
  </a>
)
