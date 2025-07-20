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
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
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
import ReactMarkdown from 'react-markdown'

const BlogDashboardPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [error, setError] = useState('')
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null)
  const session = authClient.useSession()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const currentUser = session.data?.user

  const isAuthor = (blogAuthorId: string) => {
    return currentUser?.id === blogAuthorId
  }

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('Fetching blogs...')
      const response = await blogsService.getBlogs()
      console.log('Blog fetch response:', response)
      
      if (response.success && response.data) {
        console.log('Blogs data:', response.data)
        const blogsArray = Array.isArray(response.data) ? response.data : []
        console.log('Setting blogs:', blogsArray)
        setBlogs(blogsArray)
      } else {
        const errorMsg = response.error || 'Failed to fetch blogs'
        setError(errorMsg)
        console.error('Blog fetch failed:', errorMsg)
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs. Please check your connection and try again.')
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

  const truncateText = (text: string, maxLength: number = 120) => {
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
        setBlogs(blogs.filter(blog => String(blog.id) !== String(blogId)))
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

  if (loading || session.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted/50 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-muted/50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
          </div>

          {/* Tabs Skeleton */}
          <div className="flex space-x-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Search Skeleton */}
          <div className="max-w-2xl">
            <div className="h-10 w-full bg-muted/50 rounded-lg animate-pulse" />
          </div>

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
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
                    <div className="h-5 w-14 bg-muted/50 rounded-full animate-pulse" />
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

  // Redirect if not authenticated
  if (!session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Authentication Required</h2>
          <p className="text-foreground mb-6 text-sm">Please log in to access your blog dashboard.</p>
          <Button 
            onClick={() => authClient.signIn.social({ provider: 'google' })} 
            className="h-10 px-6"
          >
            Login with Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">Blog Dashboard</h1>
                <p className="text-sm text-foreground">Manage your blog posts</p>
              </div>
            </div>
            
            <Button
              onClick={() => router.push('/blog/create')}
              className="h-9 px-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Posts</CardTitle>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">{blogs.length}</div>
              <p className="text-xs text-foreground">Published articles</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-secondary/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Views</CardTitle>
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">{stats.totalViews}</div>
              <p className="text-xs text-foreground">Page visits</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-destructive/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Likes</CardTitle>
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Heart className="h-4 w-4 text-destructive" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">{stats.totalLikes}</div>
              <p className="text-xs text-foreground">User reactions</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:bg-accent/5 hover:border-accent/40 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-foreground">Comments</CardTitle>
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-foreground mb-1">{stats.totalComments}</div>
              <p className="text-xs text-foreground">User engagement</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
                <Input
                  placeholder="Search blogs..."
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="popular">Most Popular</option>
                </select>
                
                <div className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm">
                  {filteredAndSortedBlogs.length} of {blogs.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/50 p-1 text-foreground shadow-sm">
            <TabsTrigger 
              value="all"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              All Posts
            </TabsTrigger>
            <TabsTrigger 
              value="technology"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Technology
            </TabsTrigger>
            <TabsTrigger 
              value="lifestyle"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Lifestyle
            </TabsTrigger>
            <TabsTrigger 
              value="tutorial"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50"
            >
              Tutorial
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredAndSortedBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading text-foreground mb-2">
                  {searchTerm ? 'No blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-foreground text-sm max-w-md mx-auto mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : 'Start your blogging journey by creating your first post'}
                </p>
                {!searchTerm && (
                  <Button onClick={() => router.push('/blog/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAndSortedBlogs.map((blog) => (
                  <Card key={blog.id} className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={blog.authorProfile?.avatar || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                              ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                              : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
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
                    
                    <CardContent className="pt-0 pb-3">
                      <CardTitle className="text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors font-heading">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm mb-3">
                        <ReactMarkdown>
                          {truncateText(blog.content)}
                        </ReactMarkdown>
                      </CardDescription>
                      
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
                    </CardContent>
                    
                    <CardContent className="pt-0 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-foreground">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{Array.isArray(blog.views) ? blog.views.length : (blog.views || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-3 h-3" />
                            <span>{Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-3 h-3" />
                            <span>{Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/blog/${blog.id}`)}
                            className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                          >
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                          
                          {isAuthor(blog.authorId) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive h-8 w-8 p-0"
                                  disabled={deletingBlogId === String(blog.id)}
                                >
                                  {deletingBlogId === String(blog.id) ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-destructive" />
                                    Delete Blog Post
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{blog.title}&quot;? This action cannot be undone and will permanently remove the blog post and all its associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteBlog(blog.id.toString())}
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
