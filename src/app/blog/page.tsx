'use client'

import React, { useEffect, useState } from 'react'
import { CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  ArrowRight,
  Bookmark
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { authClient } from '@/lib/authClient'

const BlogPage = () => {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const session = authClient.useSession()

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Add a minimum loading time to prevent flickering
      const startTime = Date.now()
      const minLoadingTime = 800 // 800ms minimum loading time
      
      const response = await blogsService.getBlogs()
      console.log('Blog fetch response:', response)
      
      if (response.success && response.data) {
        console.log('Blogs data:', response.data)
        setBlogs(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.error || 'Failed to fetch blogs')
        console.error('Blog fetch failed:', response.error)
      }
      
      // Ensure minimum loading time
      const elapsedTime = Date.now() - startTime
      if (elapsedTime < minLoadingTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime))
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      setError('Failed to load blogs')
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const [updatingBlogs, setUpdatingBlogs] = useState<Set<string>>(new Set())

  const handleLike = async (blogId: string) => {
    if (!session?.data?.user?.id) {
      router.push('/blog/dashboard')
      return
    }
    
    try {
      setUpdatingBlogs(prev => new Set(prev).add(blogId))
      await blogsService.likeBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs()
    } catch (error) {
      console.error('Error liking blog:', error)
    } finally {
      setUpdatingBlogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(blogId)
        return newSet
      })
    }
  }

  const handleBookmark = async (blogId: string) => {
    if (!session?.data?.user?.id) {
      router.push('/blog/dashboard')
      return
    }
    
    try {
      setUpdatingBlogs(prev => new Set(prev).add(blogId))
      await blogsService.bookmarkBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs()
    } catch (error) {
      console.error('Error bookmarking blog:', error)
    } finally {
      setUpdatingBlogs(prev => {
        const newSet = new Set(prev)
        newSet.delete(blogId)
        return newSet
      })
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

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Show loading indicator only for initial load and when no blogs are available
  const showLoadingSkeleton = initialLoad && loading && blogs.length === 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-black dark:text-white">All Blogs</h1>
                <p className="text-sm text-black dark:text-white">Discover amazing stories and insights</p>
              </div>
            </div>
            
            <Button
              onClick={() => router.push('/blog/create')}
              className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search blogs by title, content, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-card/50 border-border rounded-xl text-base text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {loading && searchTerm ? (
                <div className="flex items-center space-x-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                  <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                  {filteredBlogs.length} results
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-xl mx-auto">
            <p className="text-destructive text-sm text-center">{error}</p>
          </div>
        )}

        {/* Blog Count */}
        <div className="mb-8 text-center">
          {showLoadingSkeleton ? (
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-3 rounded-full border border-primary/30">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <div className="h-4 w-48 bg-muted/50 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-6 py-3 rounded-full border border-primary/30">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-black dark:text-white">
                Showing <span className="text-primary font-semibold">{filteredBlogs.length}</span> of <span className="text-primary font-semibold">{blogs.length}</span> blogs
              </span>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && !showLoadingSkeleton && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <span>Updating blogs...</span>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {showLoadingSkeleton ? (
          // Skeleton Loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                {/* Featured Image Placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 relative overflow-hidden" />
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse ring-2 ring-primary/10" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-muted/50 rounded animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-muted/50 rounded animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-6 w-3/4 bg-muted/50 rounded animate-pulse mb-3" />
                    <div className="h-4 w-full bg-muted/50 rounded animate-pulse mb-1" />
                    <div className="h-4 w-5/6 bg-muted/50 rounded animate-pulse" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="h-6 w-12 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-6 w-16 bg-muted/50 rounded-full animate-pulse" />
                    <div className="h-6 w-14 bg-muted/50 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
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
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-muted/50 rounded animate-pulse" />
                      <div className="h-8 w-20 bg-muted/50 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <BookOpen className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-heading text-black dark:text-white mb-3">
              {searchTerm ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-black dark:text-white text-base mb-8 max-w-md mx-auto leading-relaxed">
              {searchTerm ? 'Try adjusting your search terms or browse all blogs' : 'Create your first blog post to share your thoughts and insights with the world'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => router.push('/blog/create')}
                className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => {
              const isUpdating = updatingBlogs.has(blog.id.toString())
              return (
                <article key={blog.id} className={`group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 ${isUpdating ? 'opacity-75 pointer-events-none' : ''}`}>
                {/* Featured Image Placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-muted/30 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Author and Date */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/10">
                      <AvatarImage src={blog.authorProfile?.avatar || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">
                        {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                          ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                          : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-black dark:text-white text-sm truncate">
                        {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                          ? `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`
                          : blog.author?.email || 'Unknown Author'
                        }
                      </p>
                      <p className="text-xs text-black dark:text-white flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-black dark:text-white" />
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Title and Content */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold font-heading text-black dark:text-white line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-3 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-black dark:text-white line-clamp-3 leading-relaxed">
                      {truncateText(blog.content, 150)}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-4 text-xs text-black dark:text-white">
                      <div className="flex items-center space-x-1 hover:text-foreground transition-colors">
                        <Eye className="w-4 h-4 text-black dark:text-white" />
                        <span className="font-medium">{typeof blog.views === 'number' ? blog.views : 0}</span>
                      </div>
                      <button
                        onClick={() => handleLike(blog.id.toString())}
                        disabled={isUpdating}
                        className="flex items-center space-x-1 text-black dark:text-white hover:text-destructive transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border border-destructive/30 border-t-destructive rounded-full animate-spin" />
                        ) : (
                          <Heart className="w-4 h-4 text-black dark:text-white" />
                        )}
                        <span className="font-medium">{typeof blog.likes === 'number' ? blog.likes : 0}</span>
                      </button>
                      <div className="flex items-center space-x-1 hover:text-foreground transition-colors">
                        <MessageCircle className="w-4 h-4 text-black dark:text-white" />
                        <span className="font-medium">{typeof blog.comments === 'number' ? blog.comments : 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(blog.id.toString())}
                        disabled={isUpdating}
                        className="h-8 w-8 p-0 text-black dark:text-white hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-black dark:text-white" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-4 font-medium"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </article>
              )
            })}
            </div>
        )}
      </main>
    </div>
  )
}

export default BlogPage
