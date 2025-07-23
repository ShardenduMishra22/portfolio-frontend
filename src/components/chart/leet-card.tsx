import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LeetCodeData } from "@/data/types.data"
import { Trophy, User, Award } from "lucide-react"
import { DifficultyCard } from "./helper"

interface LeetCodeStatsCardProps {
  leetcode: LeetCodeData
}

export const LeetCodeStatsCard = ({ leetcode }: LeetCodeStatsCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-0">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5"></div>
      
      <CardHeader className="relative pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
            <div className="relative p-3 bg-secondary rounded-xl group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-secondary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">LeetCode Stats</CardTitle>
            <p className="text-sm text-muted-foreground">Problem Solving</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {leetcode.profile.realName && (
          <div className="p-4 bg-muted/50 rounded-xl border">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{leetcode.profile.realName}</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-accent/10 rounded-xl border">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Global Ranking</p>
              <p className="text-lg font-bold text-foreground">#{leetcode.profile.ranking}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <DifficultyCard 
            difficulty="Easy" 
            count={leetcode.submitStats.acSubmissionNum[1]?.count || 0}
            color="bg-green-500"
          />
          <DifficultyCard 
            difficulty="Medium" 
            count={leetcode.submitStats.acSubmissionNum[2]?.count || 0}
            color="bg-yellow-500"
          />
          <DifficultyCard 
            difficulty="Hard" 
            count={leetcode.submitStats.acSubmissionNum[3]?.count || 0}
            color="bg-red-500"
          />
        </div>
      </CardContent>
    </Card>
  )
}
