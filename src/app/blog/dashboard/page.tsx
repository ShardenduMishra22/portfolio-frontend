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
  Plus, 
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
  Edit,
  Trash2,
  BarChart3,
  AlertTriangle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { authClient } from '@/lib/authClient'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'

const BlogDashboardPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [error, setError] = useState('')
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchBlogs()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    try {
      const session = await authClient.getSession()
      if (session.data?.user) {
        setCurrentUser(session.data.user)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const isAuthor = (blogAuthorId: string) => {
    return currentUser?.id === blogAuthorId
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await blogsService.getBlogs()
      console.log('Blog fetch response:', response)
      
      if (response.success && response.data) {
        console.log('Blogs data:', response.data)
        // Fix: The API returns blogs directly in data array, not data.data
        setBlogs(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.error || 'Failed to fetch blogs')
        console.error('Blog fetch failed:', response.error)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const sortBlogs = (blogs: Blog[]) => {
    switch (sortBy) {
      case 'newest':
        return [...blogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return [...blogs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'title':
        return [...blogs].sort((a, b) => a.title.localeCompare(b.title))
      case 'popular':
        return [...blogs].sort((a, b) => {
          const aViews = Array.isArray(a.views) ? a.views.length : (a.views || 0)
          const bViews = Array.isArray(b.views) ? b.views.length : (b.views || 0)
          return bViews - aViews
        })
      default:
        return blogs
    }
  }

  const filteredAndSortedBlogs = sortBlogs(
    blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesTab = activeTab === 'all' || blog.tags?.includes(activeTab)
      return matchesSearch && matchesTab
    })
  )

  const getTotalStats = () => {
    const totalViews = blogs.reduce((sum, blog) => {
      const views = Array.isArray(blog.views) ? blog.views.length : (blog.views || 0)
      return sum + views
    }, 0)
    
    const totalLikes = blogs.reduce((sum, blog) => {
      const likes = Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0)
      return sum + likes
    }, 0)
    
    const totalComments = blogs.reduce((sum, blog) => {
      const comments = Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0)
      return sum + comments
    }, 0)

    return { totalViews, totalLikes, totalComments }
  }

  const stats = getTotalStats()

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setDeletingBlogId(blogId)
      const response = await blogsService.deleteBlog(blogId)
      
      if (response.success) {
        toast.success('Blog post deleted successfully')
        // Remove the blog from the local state
        setBlogs(blogs.filter(blog => blog.id !== blogId))
      } else {
        toast.error(response.error || 'Failed to delete blog post')
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      toast.error('Failed to delete blog post')
    } finally {
      setDeletingBlogId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading blog dashboard...</p>
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
                <h1 className="text-2xl font-bold text-foreground font-heading">Blog Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/stats')}
                variant="outline"
                className="border-border/50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Stats
              </Button>
              <Button
                onClick={() => router.push('/blog/create')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
              <Input
                placeholder="Search blogs..."
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
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 backdrop-blur-sm border-border/50">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredAndSortedBlogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'No blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first blog post to get started'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => router.push('/blog/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedBlogs.map((blog) => (
                  <Card key={blog.id} className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
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
                            <p className="font-medium text-foreground">
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
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardTitle className="text-xl mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                        {truncateText(blog.content)}
                      </CardDescription>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
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
                    </CardContent>
                    
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{Array.isArray(blog.views) ? blog.views.length : (blog.views || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/blog/${blog.id}`)}
                            className="text-primary hover:text-primary/80 group-hover:bg-primary/10"
                          >
                            <span className="mr-1">Read More</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          
                          {isAuthor(blog.authorId) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive/80 group-hover:bg-destructive/10"
                                  disabled={deletingBlogId === blog.id}
                                >
                                  {deletingBlogId === blog.id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-destructive"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-destructive" />
                                    Delete Blog Post
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{blog.title}&quot;? This action cannot be undone and will permanently remove the blog post and all its associated data (likes, comments, views).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBlog(blog.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete Post
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default BlogDashboardPage 