'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Search, 
  Filter,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Star,
  BarChart3,
  Users,
  Activity,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'

interface BlogStats {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  averageViewsPerPost: number
  averageLikesPerPost: number
  averageCommentsPerPost: number
  topPerformingPost: Blog | null
  recentPosts: Blog[]
  postsByTag: Record<string, number>
  postsByAuthor: Record<string, { count: number; totalViews: number; totalLikes: number }>
}

const BlogStatsPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [sortBy, setSortBy] = useState('views')
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState('all')
  const [apiStats, setApiStats] = useState<any>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await blogsService.getBlogStats()
      console.log('Stats fetch response:', response)
      
      if (response.success && response.data) {
        console.log('Stats data:', response.data)
        setApiStats(response.data)
        // Also fetch all blogs for the posts tab
        const blogsResponse = await blogsService.getBlogs()
        if (blogsResponse.success && blogsResponse.data) {
          setBlogs(Array.isArray(blogsResponse.data) ? blogsResponse.data : [])
        }
      } else {
        setError(response.error || 'Failed to fetch statistics')
        console.error('Stats fetch failed:', response.error)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (): BlogStats => {
    if (!apiStats) {
      return {
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        averageViewsPerPost: 0,
        averageLikesPerPost: 0,
        averageCommentsPerPost: 0,
        topPerformingPost: null,
        recentPosts: [],
        postsByTag: {},
        postsByAuthor: {}
      }
    }

    // Convert API stats to the expected format
    const postsByTag: Record<string, number> = {}
    if (apiStats.tagStats) {
      apiStats.tagStats.forEach((tagStat: any) => {
        postsByTag[tagStat.tag] = tagStat.count
      })
    }

    const postsByAuthor: Record<string, { count: number; totalViews: number; totalLikes: number }> = {}
    if (apiStats.authorStats) {
      apiStats.authorStats.forEach((authorStat: any) => {
        const authorName = authorStat.firstName && authorStat.lastName
          ? `${authorStat.firstName} ${authorStat.lastName}`
          : authorStat.authorEmail || 'Unknown Author'
        
        postsByAuthor[authorName] = {
          count: authorStat.postCount,
          totalViews: authorStat.totalViews,
          totalLikes: authorStat.totalLikes
        }
      })
    }

    return {
      totalPosts: apiStats.totalPosts || 0,
      totalViews: apiStats.totalViews || 0,
      totalLikes: apiStats.totalLikes || 0,
      totalComments: apiStats.totalComments || 0,
      averageViewsPerPost: apiStats.averageViewsPerPost || 0,
      averageLikesPerPost: apiStats.averageLikesPerPost || 0,
      averageCommentsPerPost: apiStats.averageCommentsPerPost || 0,
      topPerformingPost: apiStats.topPerformingPost || null,
      recentPosts: apiStats.recentPosts || [],
      postsByTag,
      postsByAuthor
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getGrowthIndicator = (current: number, previous: number) => {
    if (current > previous) {
      return { icon: ArrowUpRight, color: 'text-green-500', text: `+${((current - previous) / previous * 100).toFixed(1)}%` }
    } else if (current < previous) {
      return { icon: ArrowDownRight, color: 'text-red-500', text: `${((current - previous) / previous * 100).toFixed(1)}%` }
    } else {
      return { icon: Minus, color: 'text-gray-500', text: '0%' }
    }
  }

  const sortBlogs = (blogs: Blog[]) => {
    switch (sortBy) {
      case 'views':
        return [...blogs].sort((a, b) => {
          const aViews = Array.isArray(a.views) ? a.views.length : (a.views || 0)
          const bViews = Array.isArray(b.views) ? b.views.length : (b.views || 0)
          return bViews - aViews
        })
      case 'likes':
        return [...blogs].sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : (a.likes || 0)
          const bLikes = Array.isArray(b.likes) ? b.likes.length : (b.likes || 0)
          return bLikes - aLikes
        })
      case 'comments':
        return [...blogs].sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments.length : (a.comments || 0)
          const bComments = Array.isArray(b.comments) ? b.comments.length : (b.comments || 0)
          return bComments - aComments
        })
      case 'newest':
        return [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return [...blogs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      default:
        return blogs
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (blog.authorProfile?.firstName && blog.authorProfile?.lastName &&
                            `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
      return matchesSearch
    })
  )

  const calculatedStats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading blog statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white dark:border-slate-800 shadow-sm"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Blog Analytics</h1>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Comprehensive insights and performance metrics</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/dashboard')}
                variant="outline"
                className="h-12 px-6 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-10">
        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300">Total Posts</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">{formatNumber(calculatedStats.totalPosts)}</div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Published articles</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Total Views</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">{formatNumber(calculatedStats.totalViews)}</div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Page visits</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border-rose-200 dark:border-rose-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-rose-700 dark:text-rose-300">Total Likes</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-rose-700 dark:text-rose-300 mb-2">{formatNumber(calculatedStats.totalLikes)}</div>
              <p className="text-sm text-rose-600 dark:text-rose-400 font-medium">User reactions</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/20 dark:to-violet-800/20 border-violet-200 dark:border-violet-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-violet-700 dark:text-violet-300">Total Comments</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-violet-700 dark:text-violet-300 mb-2">{formatNumber(calculatedStats.totalComments)}</div>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">User engagement</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
        </div>

        {/* Average Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-cyan-200 dark:border-cyan-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-cyan-700 dark:text-cyan-300">Avg Views/Post</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">{formatNumber(calculatedStats.averageViewsPerPost)}</div>
              <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">Per post average</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-orange-700 dark:text-orange-300">Avg Likes/Post</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-orange-700 dark:text-orange-300 mb-2">{formatNumber(calculatedStats.averageLikesPerPost)}</div>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Per post average</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 border-pink-200 dark:border-pink-700 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative">
              <CardTitle className="text-lg font-bold text-pink-700 dark:text-pink-300">Avg Comments/Post</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-4xl font-bold text-pink-700 dark:text-pink-300 mb-2">{formatNumber(calculatedStats.averageCommentsPerPost)}</div>
              <p className="text-sm text-pink-600 dark:text-pink-400 font-medium">Per post average</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Post */}
        {calculatedStats.topPerformingPost && (
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-800/20 border-amber-200 dark:border-amber-700 shadow-xl mb-10 hover:shadow-2xl transition-all duration-500 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-700 dark:text-amber-300 text-xl font-bold">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                Top Performing Post
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-16 h-16 ring-4 ring-amber-200 dark:ring-amber-800">
                    <AvatarImage src={calculatedStats.topPerformingPost.authorProfile?.avatar || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-500 text-white font-bold text-lg">
                      {calculatedStats.topPerformingPost.authorProfile?.firstName && calculatedStats.topPerformingPost.authorProfile?.lastName
                        ? `${calculatedStats.topPerformingPost.authorProfile.firstName.charAt(0)}${calculatedStats.topPerformingPost.authorProfile.lastName.charAt(0)}`
                        : calculatedStats.topPerformingPost.author?.email?.charAt(0).toUpperCase() || 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-2xl text-slate-900 dark:text-white mb-2">{calculatedStats.topPerformingPost.title}</h3>
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      by {calculatedStats.topPerformingPost.authorProfile?.firstName && calculatedStats.topPerformingPost.authorProfile?.lastName
                        ? `${calculatedStats.topPerformingPost.authorProfile.firstName} ${calculatedStats.topPerformingPost.authorProfile.lastName}`
                        : calculatedStats.topPerformingPost.author?.email || 'Unknown Author'
                      } • {formatDate(calculatedStats.topPerformingPost.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      {formatNumber(calculatedStats.topPerformingPost.viewCount || 0)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Total Views</div>
                  </div>
                  <Button
                    onClick={() => router.push(`/blog/${calculatedStats.topPerformingPost.id}`)}
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl font-semibold"
                  >
                    View Post
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lg">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Overview
            </TabsTrigger>
            <TabsTrigger value="posts" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="authors" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Authors
            </TabsTrigger>
            <TabsTrigger value="tags" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Tags
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Posts */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                  <CardDescription>Latest blog posts published</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calculatedStats.recentPosts.map((blog) => (
                      <div key={blog.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={blog.authorProfile?.avatar || ''} />
                            <AvatarFallback className="text-xs">
                              {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                                ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                                : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                              }
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{blog.title}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(blog.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>0</span>
                          <Heart className="w-3 h-3" />
                          <span>0</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Authors */}
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Top Authors</CardTitle>
                  <CardDescription>Authors with most engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(calculatedStats.postsByAuthor)
                      .sort(([, a], [, b]) => b.totalViews - a.totalViews)
                      .slice(0, 5)
                      .map(([authorName, authorStats]) => (
                        <div key={authorName} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium text-sm">{authorName}</p>
                            <p className="text-xs text-muted-foreground">{authorStats.count} posts</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatNumber(authorStats.totalViews)} views</p>
                            <p className="text-xs text-muted-foreground">{formatNumber(authorStats.totalLikes)} likes</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            {/* Search and Filter */}
            <div className="mb-8">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      placeholder="Search posts by title, content, or author..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-14 h-14 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 rounded-xl text-base"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-14 px-6 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 cursor-pointer text-base font-medium"
                    >
                      <option value="views">Most Views</option>
                      <option value="likes">Most Likes</option>
                      <option value="comments">Most Comments</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    
                    <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-sm">
                      {filteredAndSortedBlogs.length} of {blogs.length} posts
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAndSortedBlogs.map((blog) => (
                <Card key={blog.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden rounded-2xl">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 ring-2 ring-blue-100 dark:ring-blue-900/20">
                        <AvatarImage src={blog.authorProfile?.avatar || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                            : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`
                            : blog.author?.email || 'Unknown Author'
                          }
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-6">
                    <CardTitle className="text-lg mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold text-slate-900 dark:text-white">
                      {blog.title}
                    </CardTitle>
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50 font-medium px-3 py-1">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-sm border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium px-3 py-1">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <Eye className="w-4 h-4" />
                          <span className="font-bold text-slate-900 dark:text-white">{formatNumber(Array.isArray(blog.views) ? blog.views.length : (blog.views || 0))}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                          <Heart className="w-4 h-4" />
                          <span className="font-bold text-slate-900 dark:text-white">{formatNumber(Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0))}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-bold text-slate-900 dark:text-white">{formatNumber(Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0))}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-xl font-semibold h-10 px-4"
                      >
                        <span className="mr-2">View</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedBlogs.length === 0 && (
              <div className="text-center py-20">
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white dark:border-slate-800"></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto text-lg">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors" className="mt-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Author Statistics</CardTitle>
                <CardDescription>Detailed breakdown by author</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(calculatedStats.postsByAuthor)
                    .sort(([, a], [, b]) => b.totalViews - a.totalViews)
                    .map(([authorName, authorStats]) => (
                      <div key={authorName} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {authorName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{authorName}</h3>
                            <p className="text-sm text-muted-foreground">{authorStats.count} posts published</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-500">{formatNumber(authorStats.totalViews)}</div>
                            <div className="text-xs text-muted-foreground">Total Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-500">{formatNumber(authorStats.totalLikes)}</div>
                            <div className="text-xs text-muted-foreground">Total Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-500">{formatNumber(Math.round(authorStats.totalViews / authorStats.count))}</div>
                            <div className="text-xs text-muted-foreground">Avg Views/Post</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tags Tab */}
          <TabsContent value="tags" className="mt-6">
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Tag Statistics</CardTitle>
                <CardDescription>Posts categorized by tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(calculatedStats.postsByTag)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tag, count]) => (
                      <div key={tag} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <Badge variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                        <div className="text-right">
                          <div className="text-lg font-bold">{count}</div>
                          <div className="text-xs text-muted-foreground">posts</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default BlogStatsPage 