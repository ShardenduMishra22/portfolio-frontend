'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  User,
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

  const handleLike = async (blogId: string) => {
    if (!session?.data?.user?.id) {
      router.push('/blog/dashboard') // Redirect to login
      return
    }
    
    try {
      await blogsService.likeBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs() // Refresh the blog list
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleBookmark = async (blogId: string) => {
    if (!session?.data?.user?.id) {
      router.push('/blog/dashboard') // Redirect to login
      return
    }
    
    try {
      await blogsService.bookmarkBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs() // Refresh the blog list
    } catch (error) {
      console.error('Error bookmarking blog:', error)
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

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted/20">
      {!session.data?.user && (
        <div className="flex items-center justify-center py-12">
          <p className="text-foreground">Please log in to create a blog post.</p>
          <Button onClick={() => authClient.signIn.social({ provider: 'google' })} className="ml-4">
            Login
          </Button>
        </div>
      )}
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground font-heading">All Blogs</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/60 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Blog Count */}
        <div className="mb-6">
          <p className="text-foreground">
            Showing {filteredBlogs.length} of {blogs.length} blogs
          </p>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
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
            {filteredBlogs.map((blog) => (
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
                        <span>{typeof blog.views === 'number' ? blog.views : 0}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(blog.id.toString())}
                        className="flex items-center space-x-1 p-1 h-auto text-foreground hover:text-destructive"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{typeof blog.likes === 'number' ? blog.likes : 0}</span>
                      </Button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{typeof blog.comments === 'number' ? blog.comments : 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(blog.id.toString())}
                        className="text-foreground hover:text-primary"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-primary hover:text-primary/80 group-hover:bg-primary/10"
                      >
                        <span className="mr-1">Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default BlogPage
