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
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">Blog Dashboard</h1>
                  <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Manage and monitor your blog posts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/create')}
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-3" />
                Create New Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
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
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">{blogs.length}</div>
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
              <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">{stats.totalViews}</div>
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
              <div className="text-4xl font-bold text-rose-700 dark:text-rose-300 mb-2">{stats.totalLikes}</div>
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
              <div className="text-4xl font-bold text-violet-700 dark:text-violet-300 mb-2">{stats.totalComments}</div>
              <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">User engagement</p>
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-500/10 rounded-full -translate-y-10 translate-x-10"></div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-10">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Search blogs by title, content, or author..."
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="popular">Most Popular</option>
                </select>
                
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-sm">
                  {filteredAndSortedBlogs.length} of {blogs.length} posts
                </div>
              </div>
            </div>
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
          <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2 shadow-lg">
            <TabsTrigger value="all" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              All Posts
            </TabsTrigger>
            <TabsTrigger value="technology" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Technology
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Lifestyle
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg data-[state=active]:font-semibold transition-all duration-300">
              Tutorial
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredAndSortedBlogs.length === 0 ? (
              <div className="text-center py-20">
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <BookOpen className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white dark:border-slate-800"></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {searchTerm ? 'No blogs found' : 'No blogs yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto text-lg">
                  {searchTerm ? 'Try adjusting your search terms or browse all posts' : 'Start your blogging journey by creating your first post'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => router.push('/blog/create')}
                    className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    Create First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedBlogs.map((blog) => (
                  <Card key={blog.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group overflow-hidden rounded-2xl">
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-14 h-14 ring-4 ring-blue-100 dark:ring-blue-900/20">
                            <AvatarImage src={blog.authorProfile?.avatar || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                              {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                                ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                                : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                              }
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-base">
                              {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                                ? `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`
                                : blog.author?.email || 'Unknown Author'
                              }
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              {formatDate(blog.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-6">
                      <CardTitle className="text-xl mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold text-slate-900 dark:text-white">
                        {blog.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        {truncateText(blog.content)}
                      </CardDescription>
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-6">
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
                    </CardContent>
                    
                    <CardContent className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8 text-sm">
                          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
                            <Eye className="w-5 h-5" />
                            <span className="font-bold text-slate-900 dark:text-white">{Array.isArray(blog.views) ? blog.views.length : (blog.views || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                            <div className="w-3 h-3 bg-rose-500 rounded-full shadow-sm"></div>
                            <Heart className="w-5 h-5" />
                            <span className="font-bold text-slate-900 dark:text-white">{Array.isArray(blog.likes) ? blog.likes.length : (blog.likes || 0)}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-bold text-slate-900 dark:text-white">{Array.isArray(blog.comments) ? blog.comments.length : (blog.comments || 0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/blog/${blog.id}`)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-xl font-semibold h-10 px-4"
                          >
                            <span className="mr-2">Read More</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                          
                          {isAuthor(blog.authorId) && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 rounded-xl h-10 w-10"
                                  disabled={deletingBlogId === blog.id}
                                >
                                  {deletingBlogId === blog.id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                  ) : (
                                    <Trash2 className="w-5 h-5" />
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