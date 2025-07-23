import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Repository } from "@/data/types.data"
import { TrendingUp } from "lucide-react"
import { RepoCard } from "./helper"


interface TopRepositoriesCardProps {
  topRepos: Repository[]
}

export const TopRepositoriesCard = ({ topRepos }: TopRepositoriesCardProps) => {
  return (
    <Card className="col-span-1 lg:col-span-2 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 to-chart-5/5"></div>
      
      <CardHeader className="relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-chart-2/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative p-3 bg-chart-2 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Top Repositories</CardTitle>
            <p className="text-sm text-muted-foreground">Most Popular Projects</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topRepos.map((repo, index) => (
            <RepoCard key={repo.name} repo={repo} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
