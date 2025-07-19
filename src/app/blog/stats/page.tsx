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
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground font-heading">Blog Analytics</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/dashboard')}
                variant="outline"
                className="border-border/50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.totalPosts)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.totalViews)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.totalLikes)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.totalComments)}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Average Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Views/Post</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.averageViewsPerPost)}</div>
              <p className="text-xs text-muted-foreground">Per post average</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Likes/Post</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.averageLikesPerPost)}</div>
              <p className="text-xs text-muted-foreground">Per post average</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Comments/Post</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(calculatedStats.averageCommentsPerPost)}</div>
              <p className="text-xs text-muted-foreground">Per post average</p>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Post */}
        {calculatedStats.topPerformingPost && (
          <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Top Performing Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={calculatedStats.topPerformingPost.authorProfile?.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {calculatedStats.topPerformingPost.authorProfile?.firstName && calculatedStats.topPerformingPost.authorProfile?.lastName
                        ? `${calculatedStats.topPerformingPost.authorProfile.firstName.charAt(0)}${calculatedStats.topPerformingPost.authorProfile.lastName.charAt(0)}`
                        : calculatedStats.topPerformingPost.author?.email?.charAt(0).toUpperCase() || 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{calculatedStats.topPerformingPost.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      by {calculatedStats.topPerformingPost.authorProfile?.firstName && calculatedStats.topPerformingPost.authorProfile?.lastName
                        ? `${calculatedStats.topPerformingPost.authorProfile.firstName} ${calculatedStats.topPerformingPost.authorProfile.lastName}`
                        : calculatedStats.topPerformingPost.author?.email || 'Unknown Author'
                      } • {formatDate(calculatedStats.topPerformingPost.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {formatNumber(calculatedStats.topPerformingPost.viewCount || 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Views</div>
                  </div>
                  <Button
                    onClick={() => router.push(`/blog/${calculatedStats.topPerformingPost.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    View Post
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 backdrop-blur-sm border-border/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">All Posts</TabsTrigger>
            <TabsTrigger value="authors">Authors</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
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
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
                  <Input
                    placeholder="Search posts, authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card/60 backdrop-blur-sm border-border/50"
                  />
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-card/60 backdrop-blur-sm border border-border/50 rounded-md"
                >
                  <option value="views">Most Views</option>
                  <option value="likes">Most Likes</option>
                  <option value="comments">Most Comments</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedBlogs.map((blog) => (
                <Card key={blog.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={blog.authorProfile?.avatar || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                            : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`
                            : blog.author?.email || 'Unknown Author'
                          }
                        </p>
                        <p className="text-xs text-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <CardTitle className="text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(Array.isArray(blog.views) ? blog.views.length : (blog.views || 0))}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0))}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="font-medium">{formatNumber(Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0))}</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-primary hover:text-primary/80 group-hover:bg-primary/10"
                      >
                        <span className="mr-1">View</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedBlogs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'No posts found' : 'No posts yet'}
                </h3>
                <p className="text-foreground mb-4">
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