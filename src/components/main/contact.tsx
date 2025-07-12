import { useEffect, useState } from "react"
import { getCachedStats } from "@/lib/cache"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bar, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
import { 
  Github, 
  MapPin, 
  Users, 
  BookOpen, 
  Star, 
  Code, 
  Trophy, 
  TrendingUp,
  ExternalLink,
  User,
  Award,
  Activity
} from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

export default function Contact() {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const cachedLocal = localStorage.getItem("profile_stats")
    if (cachedLocal) {
      const parsed = JSON.parse(cachedLocal)
      setData(parsed)
    }

    getCachedStats().then((fresh) => {
      if (fresh) {
        localStorage.setItem("profile_stats", JSON.stringify(fresh))
        setData(fresh)
      }
    })
  }, [])

  const sortedCommits = (data.commits || []).sort((a: any, b: any) => a.date.localeCompare(b.date))

const languagePie = (() => {
  const langs = data.languages || {}
  const total = Object.values(langs).reduce((a: number, b: unknown) => a + (b as number), 0)

  // Convert map to sorted array by byte usage (desc)
  const sorted = Object.entries(langs)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5)

  const labels = sorted.map(([lang]) => lang)
  const values = sorted.map(([, bytes]) => Number((((bytes as number) / total) * 100).toFixed(2)))

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#2b7489", "#f1e05a", "#DA5B0B", "#3572A5", "#A91E50"
        ],
        borderWidth: 2,
        borderColor: "#111827",
        hoverBorderWidth: 2,
        hoverBorderColor: "#3b82f6"
      }
    ]
  }
})()



  const commitChart = {
    labels: sortedCommits.map((d: any) => d.date),
    datasets: [
      {
        label: "Commits",
        data: sortedCommits.map((d: any) => d.count),
        backgroundColor: "hsl(var(--chart-1) / 0.7)",
        borderColor: "hsl(var(--chart-1))",
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        hoverBackgroundColor: "hsl(var(--primary) / 0.8)",
        hoverBorderColor: "hsl(var(--primary))"
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
tooltip: {
  callbacks: {
    label: function(context: any) {
      return `${context.label}: ${context.raw}%`
    }
  },
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  titleColor: '#ffffff',
  bodyColor: '#ffffff',
  borderColor: 'rgba(59, 130, 246, 0.8)',
  borderWidth: 1,
  cornerRadius: 8,
}

    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280'
        }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#374151'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1,
        cornerRadius: 8,
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Developer Dashboard
          </h1>
          <p className="text-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
            Comprehensive overview of coding activities and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {data.github && (
            <Card className="shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Github className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    GitHub Profile
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-card-foreground">{data.github.name}</span>
                </div>
                
                {data.github.location && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="text-card-foreground">{data.github.location}</span>
                  </div>
                )}
                
                {data.github.bio && (
                  <div className="flex items-start gap-3 p-3 bg-accent/20 rounded-lg">
                    <BookOpen className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground text-sm leading-relaxed">{data.github.bio}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2 p-3 bg-chart-2/20 rounded-lg">
                    <Users className="w-4 h-4 text-chart-2" />
                    <div>
                      <p className="text-sm text-foreground">Followers</p>
                      <p className="font-semibold text-card-foreground">{data.github.followers}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-chart-3/20 rounded-lg">
                    <Code className="w-4 h-4 text-chart-3" />
                    <div>
                      <p className="text-sm text-foreground">Repositories</p>
                      <p className="font-semibold text-card-foreground">{data.github.public_repos}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-2 p-3 bg-chart-1/20 rounded-lg">
                  <Star className="w-4 h-4 text-chart-1" />
                  <div>
                    <p className="text-sm text-foreground">Total Stars</p>
                    <p className="font-semibold text-card-foreground">{data.stars}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {data.leetcode?.profile && data.leetcode?.submitStats && (
            <Card className="shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    LeetCode Stats
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="font-medium text-card-foreground">{data.leetcode.profile.realName}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                  <Award className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-sm text-foreground">Global Ranking</p>
                    <p className="font-semibold text-card-foreground">#{data.leetcode.profile.ranking}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 pt-4">
                  <div className="flex items-center justify-between p-3 bg-chart-1/20 rounded-lg border border-chart-1/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                      <span className="text-sm font-medium text-card-foreground">Easy</span>
                    </div>
                    <Badge className="bg-chart-1 text-chart-1 bg-opacity-20">
                      {data.leetcode.submitStats.acSubmissionNum[1]?.count || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-chart-2/20 rounded-lg border border-chart-2/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                      <span className="text-sm font-medium text-card-foreground">Medium</span>
                    </div>
                    <Badge className="bg-chart-2 text-chart-2 bg-opacity-20">
                      {data.leetcode.submitStats.acSubmissionNum[2]?.count || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-chart-3/20 rounded-lg border border-chart-3/30">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                      <span className="text-sm font-medium text-card-foreground">Hard</span>
                    </div>
                    <Badge className="bg-chart-3 text-yellow-700 dark:text-chart-3 bg-opacity-20">
                      {data.leetcode.submitStats.acSubmissionNum[3]?.count || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {sortedCommits.length > 0 && (
            <Card className="col-span-1 md:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-1 rounded-lg group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    Commits Over Time
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 p-4 bg-muted/30 rounded-lg">
                  <Bar data={commitChart} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}

{data.languages && Object.keys(data.languages).length > 0 && (
  <Card className="col-span-1 md:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-chart-3 rounded-lg group-hover:scale-110 transition-transform">
          <Code className="w-5 h-5 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
          Technology Stack
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 h-72">
          <Pie data={languagePie} options={pieOptions} />
        </div>
<div className="space-y-3 text-sm text-card-foreground">
   {languagePie.labels.slice(0, 5).map((lang, i) => {
    const usageMap: Record<string, string> = {
  "TypeScript": "Next.js Frontend, Node.js Backend",
  "JavaScript": "Node.js Backend",
  "HTML": "Autogenerated for OpenAPI/Swagger Testing",
  "C++": "Low-Level Design, Systems-Level Logic",
  "Go": "DevOps, Microservices, Backend, Scripting & Automation",
  "Python": "Scripting, Automation, Machine Learning, Data Science",
  "CSS": "Frontend Styling",
  "Jupyter Notebook": "Machine Learning Experimentation",
  "EJS": "Templating Engine"
    }

    return (
      <div key={lang} className="flex flex-col gap-1 border-b pb-2 border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languagePie.datasets[0].backgroundColor[i] }}
            ></div>
            <span className="font-medium">{lang}</span>
          </div>
          <span className="text-muted-foreground">{languagePie.datasets[0].data[i]}%</span>
        </div>
        {usageMap[lang] && (
          <div className="text-xs text-muted-foreground pl-5">Usage: {usageMap[lang]}</div>
        )}
      </div>
    )
  })}
</div>

      </div>
    </CardContent>
  </Card>
)}


          {data.topRepos && data.topRepos.length > 0 && (
            <Card className="col-span-1 md:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-chart-2 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    Top Repositories
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.topRepos.map((r: any, index: number) => (
                    <div key={r.name} className="group/repo">
                      <a 
                        href={r.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 group-hover/repo:shadow-md border border-border hover:border-primary"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`, opacity: 0.2 }}>
                            <BookOpen className="w-4 h-4" style={{ color: `hsl(var(--chart-${(index % 5) + 1}))` }} />
                          </div>
                          <span className="font-medium text-card-foreground group-hover/repo:text-primary transition-colors" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                            {r.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 px-2 py-1 bg-chart-1/20 rounded-full">
                            <Star className="w-4 h-4 text-chart-1" />
                            <span className="text-sm text-card-foreground font-medium">{r.stars}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-foreground group-hover/repo:text-primary transition-colors" />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}