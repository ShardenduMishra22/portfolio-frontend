import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { GitHubData } from '@/data/types.data'
import { Github, Users, Code, Star, User, MapPin, BookOpen } from 'lucide-react'
import { StatsCard } from './helper'

interface GitHubProfileCardProps {
  github: GitHubData
  stars: number
}

export const GitHubProfileCard = ({ github, stars }: GitHubProfileCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full"></div>

      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative p-3 bg-primary rounded-xl group-hover:scale-110 transition-transform">
              <Github className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">GitHub Profile</CardTitle>
            <p className="text-sm text-muted-foreground">Development Activity</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard
            icon={Users}
            label="Followers"
            value={github.followers}
            color="from-blue-500/20 to-blue-600/20"
            iconColor="text-blue-600"
          />
          <StatsCard
            icon={Code}
            label="Repositories"
            value={github.public_repos}
            color="from-green-500/20 to-green-600/20"
            iconColor="text-green-600"
          />
        </div>

        <StatsCard
          icon={Star}
          label="Total Stars"
          value={stars}
          color="from-yellow-500/20 to-yellow-600/20"
          iconColor="text-yellow-600"
          fullWidth
        />

        {github.name && (
          <div className="p-4 bg-muted/50 rounded-xl border backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{github.name}</span>
            </div>
          </div>
        )}

        {github.location && (
          <div className="p-4 bg-secondary/10 rounded-xl border backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-secondary" />
              <span className="text-foreground">{github.location}</span>
            </div>
          </div>
        )}

        {github.bio && (
          <div className="p-4 bg-accent/10 rounded-xl border backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-accent mt-1" />
              <p className="text-sm text-foreground/80 leading-relaxed">{github.bio}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
