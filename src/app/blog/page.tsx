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
      router.push('/blog/dashboard')
      return
    }
    
    try {
      await blogsService.likeBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs()
    } catch (error) {
      console.error('Error liking blog:', error)
    }
  }

  const handleBookmark = async (blogId: string) => {
    if (!session?.data?.user?.id) {
      router.push('/blog/dashboard')
      return
    }
    
    try {
      await blogsService.bookmarkBlog(blogId, { userId: session.data.user.id })
      await fetchBlogs()
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

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-foreground">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-heading text-foreground">All Blogs</h1>
                <p className="text-sm text-foreground">Discover amazing stories</p>
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
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground w-4 h-4" />
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 bg-background border-border"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <span className="text-xs text-foreground bg-muted px-2 py-1 rounded">
                {filteredBlogs.length} results
              </span>
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
        <div className="mb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-foreground">
              Showing <span className="font-medium text-foreground">{filteredBlogs.length}</span> of <span className="font-medium text-foreground">{blogs.length}</span> blogs
            </span>
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              {searchTerm ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-foreground text-sm mb-6 max-w-md mx-auto">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first blog post to share your thoughts'}
            </p>
            {!searchTerm && (
              <Button onClick={() => router.push('/blog/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="bg-card border border-border rounded-lg hover:bg-accent/5 hover:border-primary/20 transition-all group">
                {/* Featured Image Placeholder */}
                <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden rounded-t-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

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
                      <p className="font-medium text-foreground text-sm truncate">
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
                
                <div className="px-4 pb-3">
                  <h3 className="text-lg font-bold font-heading text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-foreground line-clamp-3 mb-3">
                    {truncateText(blog.content)}
                  </p>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-secondary/20 text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-muted text-foreground">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{typeof blog.views === 'number' ? blog.views : 0}</span>
                      </div>
                      <button
                        onClick={() => handleLike(blog.id.toString())}
                        className="flex items-center space-x-1 hover:text-destructive transition-colors"
                      >
                        <Heart className="w-3 h-3" />
                        <span>{typeof blog.likes === 'number' ? blog.likes : 0}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-3 h-3" />
                        <span>{typeof blog.comments === 'number' ? blog.comments : 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(blog.id.toString())}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Bookmark className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default BlogPage
