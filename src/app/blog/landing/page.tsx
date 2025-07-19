'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Bookmark, 
  Eye, 
  MessageCircle, 
  Calendar,
  User,
  Settings,
  LogOut,
  PenTool,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import { BlogSearch, BlogCard, BlogStats } from '@/components/blog'

const Page = () => {
  const session = authClient.useSession()
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (session) {
      fetchBlogs()
    }
  }, [session])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogs()
      if (response.success) {
        setBlogs(response.data.data || [])
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/blog")
        },
      },
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === 'all' || blog.tags?.includes(activeTab)
    return matchesSearch && matchesTab
  })

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Please log in to access your blog.</p>
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
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground font-heading">Blog Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/blog/create')}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(session.user?.name?.split(' ')[0] || '', session.user?.name?.split(' ')[1] || '')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">{session.user?.name}</p>
                  <p className="text-xs text-foreground">{session.user?.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <BlogStats
          totalPosts={blogs.length}
          totalViews={blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
          totalLikes={blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
          totalComments={blogs.reduce((sum, blog) => sum + (blog.comments || 0), 0)}
          averageViews={blogs.length > 0 ? Math.round(blogs.reduce((sum, blog) => sum + (blog.views || 0), 0) / blogs.length) : 0}
          topPerformingPost={blogs.length > 0 ? {
            title: blogs[0].title,
            views: blogs[0].views || 0
          } : undefined}
        />

        {/* Search and Filter */}
        <BlogSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={activeTab}
          onCategoryChange={setActiveTab}
          selectedSort="newest"
          onSortChange={() => {}}
          selectedTags={[]}
          onTagsChange={() => {}}
          availableTags={['technology', 'lifestyle', 'tutorial', 'news', 'opinion']}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card/60 backdrop-blur-sm border-border/50">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No blogs found</h3>
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
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    onReadMore={(blogId) => router.push(`/blog/${blogId}`)}
                    onLike={(blogId) => {
                      // Handle like functionality
                      console.log('Like blog:', blogId)
                    }}
                    onBookmark={(blogId) => {
                      // Handle bookmark functionality
                      console.log('Bookmark blog:', blogId)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default Page
