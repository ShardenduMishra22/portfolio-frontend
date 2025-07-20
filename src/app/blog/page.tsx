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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center">
          <div className="relative mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-lg font-medium">Loading blogs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white dark:border-slate-800 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold  dark:text-white font-heading bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">All Blogs</h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Discover amazing stories and insights from our community</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/create')}
                className="h-14 px-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-2xl font-bold transition-all duration-300 hover:scale-105 text-lg"
              >
                <Plus className="w-6 h-6 mr-3" />
                Create New Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-10">
        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
              <Search className="text-slate-400 w-6 h-6" />
            </div>
            <Input
              placeholder="Search blogs by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 h-16 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 transition-all duration-300 rounded-2xl text-lg font-medium shadow-lg"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="text-sm text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                {filteredBlogs.length} results
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl max-w-2xl mx-auto">
            <p className="text-red-700 dark:text-red-300 font-medium text-center">{error}</p>
          </div>
        )}

        {/* Blog Count */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 px-8 py-4 rounded-2xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                Showing <span className="font-bold text-slate-900 dark:text-white">{filteredBlogs.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{blogs.length}</span> blogs
              </span>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mx-auto mb-10 w-32 h-32 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-200 dark:border-blue-700">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {searchTerm ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
              {searchTerm ? 'Try adjusting your search terms or browse all blogs' : 'Create your first blog post to share your thoughts with the world'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => router.push('/blog/create')}
                className="h-14 px-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-xl shadow-blue-500/25 rounded-2xl font-bold transition-all duration-300 hover:scale-105 text-lg"
              >
                <Plus className="w-6 h-6 mr-3" />
                Create First Post
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <article key={blog.id} className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] rounded-3xl overflow-hidden">
                {/* Featured Image Placeholder */}
                <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12 ring-2 ring-slate-100 dark:ring-slate-700">
                        <AvatarImage src={blog.authorProfile?.avatar || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName.charAt(0)}${blog.authorProfile.lastName.charAt(0)}`
                            : blog.author?.email?.charAt(0).toUpperCase() || 'U'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                            ? `${blog.authorProfile.firstName} ${blog.authorProfile.lastName}`
                            : blog.author?.email || 'Unknown Author'
                          }
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                      {truncateText(blog.content)}
                    </p>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-600">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <Eye className="w-4 h-4" />
                        <span className="font-semibold">{typeof blog.views === 'number' ? blog.views : 0}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(blog.id.toString())}
                        className="flex items-center space-x-2 p-2 h-auto text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="font-semibold">{typeof blog.likes === 'number' ? blog.likes : 0}</span>
                      </Button>
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-semibold">{typeof blog.comments === 'number' ? blog.comments : 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(blog.id.toString())}
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-2 transition-all duration-300 hover:scale-105"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/blog/${blog.id}`)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl p-2 font-semibold transition-all duration-300 group-hover:scale-105"
                      >
                        <span className="mr-2">Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
