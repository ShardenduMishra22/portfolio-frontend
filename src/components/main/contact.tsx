import { useEffect, useState } from "react"
import { getCachedStats } from "@/lib/cache"
import { DashboardData } from "@/data/types.data"
import { LoadingScreen } from "../chart/loader-chart"
import { DashboardHeader } from "../chart/dash-heaed"
import { GitHubProfileCard } from "../chart/github"
import { LeetCodeStatsCard } from "../chart/leet-card"
import { EnhancedCommitsChart } from "../chart/commit"
import { TechnologyStackCard } from "../chart/tech"
import { TopRepositoriesCard } from "../chart/repo"


export default function ModernDeveloperDashboard() {
  const [data, setData] = useState<DashboardData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cachedLocal = localStorage.getItem("profile_stats")
    if (cachedLocal) {
      const parsed = JSON.parse(cachedLocal)
      setData(parsed)
      setLoading(false)
    }

    getCachedStats().then((fresh) => {
      if (fresh) {
        localStorage.setItem("profile_stats", JSON.stringify(fresh))
        setData(fresh)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data.github && (
            <GitHubProfileCard github={data.github} stars={data.stars || 0} />
          )}

          {data.leetcode?.profile && data.leetcode?.submitStats && (
            <LeetCodeStatsCard leetcode={data.leetcode} />
          )}

          {data.commits && data.commits.length > 0 && (
            <EnhancedCommitsChart commits={data.commits} />
          )}

          {data.languages && Object.keys(data.languages).length > 0 && (
            <TechnologyStackCard languages={data.languages} />
          )}

          {data.topRepos && data.topRepos.length > 0 && (
            <TopRepositoriesCard topRepos={data.topRepos} />
          )}
        </div>
      </div>
    </div>
  )
}
