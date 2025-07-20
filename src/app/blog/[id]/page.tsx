'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft, 
  Heart, 
  Bookmark, 
  Eye, 
  MessageCircle, 
  Share2,
  Calendar,
  Send,
  BookOpen,
  Clock
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'
import ReactMarkdown from 'react-markdown'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: string
    email: string
    avatar: string
    name: string
  }
  userProfile: {
    firstName: string
    lastName: string
    avatar: string
  }
}

const BlogPostPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = React.use(params)
  const session = authClient.useSession()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [viewsCount, setViewsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)

  useEffect(() => {
    if (resolvedParams.id) {
      fetchBlogPost()
      fetchComments()
      addView()
    }
  }, [resolvedParams.id])

  const fetchBlogPost = async () => {
    try {
      setLoading(true)
      const response = await blogsService.getBlogById(resolvedParams.id)
      if (response.success && response.data) {
        setBlog(response.data)
        setLikesCount(typeof response.data.likes === 'number' ? response.data.likes : 0)
        setViewsCount(typeof response.data.views === 'number' ? response.data.views : 0)
        setCommentsCount(typeof response.data.comments === 'number' ? response.data.comments : 0)
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await blogsService.getBlogComments(resolvedParams.id)
      if (response.success && response.data) {
        setComments(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const addView = async () => {
    try {
      if (session?.data?.user?.id) {
        await blogsService.addBlogView(resolvedParams.id, {
          userId: session.data.user.id,
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent
        })
      }
    } catch (error) {
      console.error('Error adding view:', error)
    }
  }

  const handleLike = async () => {
    if (!session?.data?.user?.id) return
    
    try {
      if (isLiked) {
        await blogsService.unlikeBlog(resolvedParams.id, { userId: session.data.user.id })
        setLikesCount(prev => prev - 1)
      } else {
        await blogsService.likeBlog(resolvedParams.id, { userId: session.data.user.id })
        setLikesCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleBookmark = async () => {
    if (!session?.data?.user?.id) return
    
    try {
      if (isBookmarked) {
        await blogsService.unbookmarkBlog(resolvedParams.id, { userId: session.data.user.id })
      } else {
        await blogsService.bookmarkBlog(resolvedParams.id, { userId: session.data.user.id })
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const handleAddComment = async () => {
    if (!session?.data?.user?.id || !newComment.trim()) return
    
    try {
      const response = await blogsService.addBlogComment(resolvedParams.id, {
        content: newComment.trim(),
        userId: session.data.user.id
      })
      
      if (response.success) {
        setNewComment('')
        fetchComments()
        setCommentsCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full space-y-8 px-6 py-8">
          {/* Header Skeleton */}
          <div className="space-y-6">
            <div className="h-16 w-2/3 bg-muted/50 rounded animate-pulse" />
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-muted/50 rounded-full animate-pulse" />
              <div>
                <div className="h-5 w-40 bg-muted/50 rounded animate-pulse mb-2" />
                <div className="h-4 w-32 bg-muted/50 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-5 w-full bg-muted/50 rounded animate-pulse" />
            ))}
          </div>

          {/* Actions Skeleton */}
          <div className="flex items-center space-x-6 pt-8 border-t">
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-12 w-24 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-20 h-20 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground mb-4">Blog not found</h2>
          <p className="text-foreground text-base mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Button size="lg" onClick={() => router.push('/blog/landing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              size="default"
              className="hover:bg-muted/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="default">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Blog Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-foreground font-heading mb-8 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div>
                  <div className="flex items-center space-x-6 text-sm text-foreground mt-1">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {getReadingTime(blog.content)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-foreground">
                <span className="flex items-center bg-muted/50 px-3 py-2 rounded-full">
                  <Eye className="w-4 h-4 mr-2" />
                  {viewsCount} views
                </span>
                <span className="flex items-center bg-muted/50 px-3 py-2 rounded-full">
                  <Heart className="w-4 h-4 mr-2" />
                  {likesCount} likes
                </span>
              </div>
            </div>
            
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Blog Content with ReactMarkdown */}
          <div className="mb-8">
            <div className="prose prose-xl max-w-none dark:prose-invert prose-headings:font-heading prose-headings:text-foreground prose-p:text-foreground prose-p:leading-relaxed prose-li:text-foreground prose-strong:text-foreground prose-em:text-foreground">
              <ReactMarkdown>
                {blog.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Interaction Bar */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  onClick={handleLike}
                  size="lg"
                  className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-foreground'} hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-base font-medium">{likesCount}</span>
                </Button>
                
                <div className="flex items-center space-x-2 text-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <Eye className="w-5 h-5" />
                  <span className="text-base font-medium">{viewsCount}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-base font-medium">{commentsCount}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={handleBookmark}
                size="lg"
                className={`${isBookmarked ? 'text-primary bg-primary/10' : 'text-foreground'} hover:bg-primary/20`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
            <div className="p-6 pb-4 border-b border-border/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-heading">Comments ({commentsCount})</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Add Comment */}
              {session?.data?.user && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={session.data.user.image || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(session.data.user.name?.split(' ')[0] || '', session.data.user.name?.split(' ')[1] || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Write a thoughtful comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px] bg-background border-border resize-none text-base"
                      />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-foreground">
                          Press Ctrl+Enter to submit
                        </p>
                        <Button
                          onClick={handleAddComment}
                          disabled={!newComment.trim()}
                          size="default"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.user?.avatar || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(
                          comment.user?.name?.split(' ')[0] || '',
                          comment.user?.name?.split(' ')[1] || ''
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-semibold text-foreground text-base">
                          {comment.user?.name}
                        </p>
                        <p className="text-sm text-foreground">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                      <p className="text-foreground text-base leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">No comments yet</h4>
                    <p className="text-foreground text-base">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogPostPage