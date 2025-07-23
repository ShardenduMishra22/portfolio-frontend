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
  Activity,
  Loader2
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
  const [loading, setLoading] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024

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
          borderWidth: isMobile ? 1 : 2,
          borderColor: "#111827",
          hoverBorderWidth: isMobile ? 2 : 3,
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
        borderWidth: isMobile ? 1 : 2,
        borderRadius: isMobile ? 4 : 6,
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
        titleFont: {
          size: isMobile ? 12 : 14
        },
        bodyFont: {
          size: isMobile ? 11 : 13
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: isMobile ? 10 : 12
          }
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
          padding: isMobile ? 15 : 20,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#374151',
          font: {
            size: isMobile ? 11 : 13
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 1,
        cornerRadius: 8,
        titleFont: {
          size: isMobile ? 12 : 14
        },
        bodyFont: {
          size: isMobile ? 11 : 13
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 pb-14 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-primary" />
          <p className="text-foreground/70 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 pb-14">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Developer Dashboard
          </h1>
          <p className="text-sm sm:text-base text-foreground/80 px-4 sm:px-0" style={{ fontFamily: 'var(--font-subheading)' }}>
            Comprehensive overview of coding activities and achievements
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {data.github && (
            <Card className="shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-primary rounded-lg group-hover:scale-110 transition-transform">
                    <Github className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    GitHub Profile
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <div className="flex items-center gap-3 p-2 sm:p-3 bg-muted rounded-lg">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-card-foreground text-sm sm:text-base truncate">{data.github.name}</span>
                </div>

                {data.github.location && (
                  <div className="flex items-center gap-3 p-2 sm:p-3 bg-secondary/20 rounded-lg">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-secondary flex-shrink-0" />
                    <span className="text-card-foreground text-sm sm:text-base truncate">{data.github.location}</span>
                  </div>
                )}

                {data.github.bio && (
                  <div className="flex items-start gap-3 p-2 sm:p-3 bg-accent/20 rounded-lg">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-card-foreground text-xs sm:text-sm leading-relaxed line-clamp-3">{data.github.bio}</span>
                  </div>
                )}

                {/* Stats Grid - Mobile responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-chart-2/20 rounded-lg">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-chart-2 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-foreground">Followers</p>
                      <p className="font-semibold text-card-foreground text-sm sm:text-base">{data.github.followers}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-chart-3/20 rounded-lg">
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 text-chart-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-foreground">Repositories</p>
                      <p className="font-semibold text-card-foreground text-sm sm:text-base">{data.github.public_repos}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-chart-1/20 rounded-lg">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-foreground">Total Stars</p>
                    <p className="font-semibold text-card-foreground text-sm sm:text-base">{data.stars}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {data.leetcode?.profile && data.leetcode?.submitStats && (
            <Card className="shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-secondary rounded-lg group-hover:scale-110 transition-transform">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    LeetCode Stats
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                <div className="flex items-center gap-3 p-2 sm:p-3 bg-muted rounded-lg">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="font-medium text-card-foreground text-sm sm:text-base truncate">{data.leetcode.profile.realName}</span>
                </div>

                <div className="flex items-center gap-3 p-2 sm:p-3 bg-accent/20 rounded-lg">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-foreground">Global Ranking</p>
                    <p className="font-semibold text-card-foreground text-sm sm:text-base">#{data.leetcode.profile.ranking}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:gap-3 pt-2 sm:pt-4">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-chart-1/20 rounded-lg border border-chart-1/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-1 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-card-foreground">Easy</span>
                    </div>
                    <Badge className="bg-chart-1 text-chart-1 bg-opacity-20 text-xs">
                      {data.leetcode.submitStats.acSubmissionNum[1]?.count || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-chart-2/20 rounded-lg border border-chart-2/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-2 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-card-foreground">Medium</span>
                    </div>
                    <Badge className="bg-chart-2 text-chart-2 bg-opacity-20 text-xs">
                      {data.leetcode.submitStats.acSubmissionNum[2]?.count || 0}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-chart-3/20 rounded-lg border border-chart-3/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-chart-3 rounded-full"></div>
                      <span className="text-xs sm:text-sm font-medium text-card-foreground">Hard</span>
                    </div>
                    <Badge className="bg-chart-3 text-yellow-700 dark:text-chart-3 bg-opacity-20 text-xs">
                      {data.leetcode.submitStats.acSubmissionNum[3]?.count || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {sortedCommits.length > 0 && (
            <Card className="col-span-1 lg:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-chart-1 rounded-lg group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    Commits Over Time
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="h-48 sm:h-64 p-2 sm:p-4 bg-muted/30 rounded-lg">
                  <Bar data={commitChart} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}

          {data.languages && Object.keys(data.languages).length > 0 && (
            <Card className="col-span-1 lg:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-chart-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    Technology Stack
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-center">
                  <div className="lg:col-span-2 h-56 sm:h-64 lg:h-72">
                    <Pie data={languagePie} options={pieOptions} />
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-card-foreground">
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
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: languagePie.datasets[0].backgroundColor[i] }}
                              ></div>
                              <span className="font-medium truncate">{lang}</span>
                            </div>
                            <span className="text-foreground font-medium">{languagePie.datasets[0].data[i]}%</span>
                          </div>
                          {usageMap[lang] && (
                            <div className="text-xs text-foreground/70 pl-4 sm:pl-5 leading-relaxed">
                              Usage: {usageMap[lang]}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Repositories */}
          {data.topRepos && data.topRepos.length > 0 && (
            <Card className="col-span-1 lg:col-span-2 shadow-lg border-border bg-card hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3 px-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-chart-2 rounded-lg group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-subheading)' }}>
                    Top Repositories
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                  {data.topRepos.map((r: any, index: number) => (
                    <div key={r.name} className="group/repo">
                      <a 
                        href={r.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors duration-200 group-hover/repo:shadow-md border border-border hover:border-primary touch-manipulation"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`, opacity: 0.2 }}>
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: `hsl(var(--chart-${(index % 5) + 1}))` }} />
                          </div>
                          <span className="font-medium text-card-foreground group-hover/repo:text-primary transition-colors text-sm sm:text-base truncate" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                            {r.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1 px-2 py-1 bg-chart-1/20 rounded-full">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-chart-1" />
                            <span className="text-xs sm:text-sm text-card-foreground font-medium">{r.stars}</span>
                          </div>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-foreground group-hover/repo:text-primary transition-colors" />
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
