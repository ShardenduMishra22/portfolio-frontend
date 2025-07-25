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
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  BarChart3,
  Activity,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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
  const [apiStats, setApiStats] = useState<any>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await blogsService.getBlogStats()

      if (response.success && response.data) {
        setApiStats(response.data)
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
        postsByAuthor: {},
      }
    }

    // Convert API stats to the expected format
    const postsByTag: Record<string, number> = {}
    if (apiStats.tagStats) {
      apiStats.tagStats.forEach((tagStat: any) => {
        postsByTag[tagStat.tag] = tagStat.count
      })
    }

    const postsByAuthor: Record<string, { count: number; totalViews: number; totalLikes: number }> =
      {}
    if (apiStats.authorStats) {
      apiStats.authorStats.forEach((authorStat: any) => {
        const authorName =
          authorStat.firstName && authorStat.lastName
            ? `${authorStat.firstName} ${authorStat.lastName}`
            : authorStat.authorEmail || 'Unknown Author'

        postsByAuthor[authorName] = {
          count: authorStat.postCount,
          totalViews: authorStat.totalViews,
          totalLikes: authorStat.totalLikes,
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
      postsByAuthor,
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      return {
        icon: ArrowUpRight,
        color: 'text-green-500',
        text: `+${(((current - previous) / previous) * 100).toFixed(1)}%`,
      }
    } else if (current < previous) {
      return {
        icon: ArrowDownRight,
        color: 'text-red-500',
        text: `${(((current - previous) / previous) * 100).toFixed(1)}%`,
      }
    } else {
      return { icon: Minus, color: 'text-gray-500', text: '0%' }
    }
  }

  const sortBlogs = (blogs: Blog[]) => {
    switch (sortBy) {
      case 'views':
        return [...blogs].sort((a, b) => {
          const aViews = Array.isArray(a.views) ? a.views.length : a.views || 0
          const bViews = Array.isArray(b.views) ? b.views.length : b.views || 0
          return bViews - aViews
        })
      case 'likes':
        return [...blogs].sort((a, b) => {
          const aLikes = Array.isArray(a.likes) ? a.likes.length : a.likes || 0
          const bLikes = Array.isArray(b.likes) ? b.likes.length : b.likes || 0
          return bLikes - aLikes
        })
      case 'comments':
        return [...blogs].sort((a, b) => {
          const aComments = Array.isArray(a.comments) ? a.comments.length : a.comments || 0
          const bComments = Array.isArray(b.comments) ? b.comments.length : b.comments || 0
          return bComments - aComments
        })
      case 'newest':
        return [...blogs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'oldest':
        return [...blogs].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      default:
        return blogs
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.author.name &&
          blog.author.name &&
          `${blog.author.name} ${blog.author.name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
      return matchesSearch
    })
  )

  const calculatedStats = calculateStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
              <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="h-6 w-24 bg-muted/50 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-muted/50 rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="flex space-x-1 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg">
                <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden rounded-t-lg" />

                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>

                  <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-muted/50 rounded animate-pulse mb-1" />
                  <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse mb-3" />

                  <div className="flex flex-wrap gap-1 mb-4">
                    <div className="h-5 w-12 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted/50 rounded-full animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-4 bg-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-muted/50 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">Blog Analytics</h1>
                <p className="text-sm text-foreground">Performance insights and metrics</p>
              </div>
            </div>

            <Button
              onClick={() => router.push('/blog/dashboard')}
              variant="outline"
              className="h-9 px-4 border-border hover:bg-accent/10"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-10">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Posts</CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">
                {formatNumber(calculatedStats.totalPosts)}
              </div>
              <p className="text-xs text-foreground">Published articles</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/5 hover:border-secondary/20 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Views</CardTitle>
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">
                {formatNumber(calculatedStats.totalViews)}
              </div>
              <p className="text-xs text-foreground">Page visits</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/5 hover:border-destructive/20 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Likes</CardTitle>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">
                {formatNumber(calculatedStats.totalLikes)}
              </div>
              <p className="text-xs text-foreground">User reactions</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/5 hover:border-accent/40 transition-all group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Comments</CardTitle>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">
                {formatNumber(calculatedStats.totalComments)}
              </div>
              <p className="text-xs text-foreground">User engagement</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-secondary/20 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground">Avg Views/Post</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(calculatedStats.averageViewsPerPost)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground">Avg Likes/Post</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(calculatedStats.averageLikesPerPost)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:bg-accent/5 hover:border-accent/40 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground">Avg Comments/Post</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatNumber(calculatedStats.averageCommentsPerPost)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {calculatedStats.topPerformingPost && (
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-foreground text-base font-heading">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                Top Performing Post
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={calculatedStats.topPerformingPost.author?.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {calculatedStats.topPerformingPost.author?.name
                        ? `${calculatedStats.topPerformingPost.author.name.charAt(0)}${calculatedStats.topPerformingPost.author.name.charAt(0)}`
                        : calculatedStats.topPerformingPost.author?.email
                            ?.charAt(0)
                            .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground mb-1 line-clamp-1">
                      {calculatedStats.topPerformingPost.title}
                    </h3>
                    <p className="text-sm text-foreground">
                      by{' '}
                      {calculatedStats.topPerformingPost.author?.name
                        ? `${calculatedStats.topPerformingPost.author.name}`
                        : calculatedStats.topPerformingPost.author?.email || 'Unknown Author'}{' '}
                      • {formatDate(calculatedStats.topPerformingPost.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary mb-1">
                      {formatNumber(
                        Array.isArray(calculatedStats.topPerformingPost.views)
                          ? calculatedStats.topPerformingPost.views.length
                          : calculatedStats.topPerformingPost.views || 0
                      )}
                    </div>
                    <div className="text-xs text-foreground">Views</div>
                  </div>
                  <Button
                    onClick={() => router.push(`/blog/${calculatedStats.topPerformingPost?.id}`)}
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-border hover:bg-accent/10"
                  >
                    View Post
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-foreground shadow-sm">
            <TabsTrigger
              value="overview"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="posts"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger
              value="authors"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Authors
            </TabsTrigger>
            <TabsTrigger
              value="tags"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent Posts */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heading">Recent Posts</CardTitle>
                  <CardDescription className="text-sm">Latest published posts</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {calculatedStats.recentPosts.map((blog) => (
                      <div
                        key={blog.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={blog.author?.avatar || ''} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {blog.author?.name
                                ? `${blog.author.name.charAt(0)}${blog.author.name.charAt(0)}`
                                : blog.author?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{blog.title}</p>
                            <p className="text-xs text-foreground">{formatDate(blog.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-foreground">
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

              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-heading">Top Authors</CardTitle>
                  <CardDescription className="text-sm">Most engaged authors</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {Object.entries(calculatedStats.postsByAuthor)
                      .sort(([, a], [, b]) => b.totalViews - a.totalViews)
                      .slice(0, 5)
                      .map(([authorName, authorStats]) => (
                        <div
                          key={authorName}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        >
                          <div>
                            <p className="font-medium text-sm">{authorName}</p>
                            <p className="text-xs text-foreground">{authorStats.count} posts</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {formatNumber(authorStats.totalViews)} views
                            </p>
                            <p className="text-xs text-foreground">
                              {formatNumber(authorStats.totalLikes)} likes
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* All Posts Tab */}
          <TabsContent value="posts" className="mt-4">
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 bg-background border-border"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 px-3 bg-background border border-border rounded-md text-sm"
                    >
                      <option value="views">Most Views</option>
                      <option value="likes">Most Likes</option>
                      <option value="comments">Most Comments</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>

                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                      {filteredAndSortedBlogs.length} of {blogs.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSortedBlogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={blog.author?.avatar || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {blog.author?.name
                            ? `${blog.author.name.charAt(0)}${blog.author.name.charAt(0)}`
                            : blog.author?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {blog.author?.name
                            ? blog.author.name
                            : blog.author?.email || 'Unknown Author'}
                        </p>
                        <p className="text-xs text-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardTitle className="text-base mb-3 line-clamp-2 group-hover:text-primary transition-colors font-heading">
                      {blog.title}
                    </CardTitle>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>
                            {formatNumber(
                              Array.isArray(blog.views) ? blog.views.length : blog.views || 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>
                            {formatNumber(
                              Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>
                            {formatNumber(
                              Array.isArray(blog.comments)
                                ? blog.comments.length
                                : blog.comments || 0
                            )}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                      >
                        View
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedBlogs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-foreground text-sm max-w-md mx-auto">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Create your first blog post to get started'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Authors Tab */}
          <TabsContent value="authors" className="mt-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Author Statistics</CardTitle>
                <CardDescription className="text-sm">Performance by author</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {Object.entries(calculatedStats.postsByAuthor)
                    .sort(([, a], [, b]) => b.totalViews - a.totalViews)
                    .map(([authorName, authorStats]) => (
                      <div
                        key={authorName}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {authorName
                                .split(' ')
                                .map((n) => n.charAt(0))
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-sm">{authorName}</h3>
                            <p className="text-xs text-foreground">{authorStats.count} posts</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-bold text-secondary">
                              {formatNumber(authorStats.totalViews)}
                            </div>
                            <div className="text-xs text-foreground">Views</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-destructive">
                              {formatNumber(authorStats.totalLikes)}
                            </div>
                            <div className="text-xs text-foreground">Likes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-primary">
                              {formatNumber(Math.round(authorStats.totalViews / authorStats.count))}
                            </div>
                            <div className="text-xs text-foreground">Avg/Post</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags" className="mt-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Tag Statistics</CardTitle>
                <CardDescription className="text-sm">Posts by category</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(calculatedStats.postsByTag)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tag, count]) => (
                      <div
                        key={tag}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <Badge variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-bold">{count}</div>
                          <div className="text-xs text-foreground">posts</div>
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
