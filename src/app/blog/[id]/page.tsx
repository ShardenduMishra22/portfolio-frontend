'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  User,
  Send,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  BookOpen
} from 'lucide-react'
import { blogsService } from '@/services/blogs'
import { Blog } from '@/services/types'

interface Comment {
  id: number
  content: string
  createdAt: string
  user: {
    id: string
    email: string
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-foreground">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground mb-2">Blog not found</h2>
          <p className="text-foreground text-sm mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/blog/landing')}>
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {session?.data?.user && blog.authorId === session.data.user.id && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push(`/blog/${resolvedParams.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blog Content */}
          <div className="lg:col-span-2">
            {/* Blog Header */}
            <Card className="bg-card border-border mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={blog.authorProfile?.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(blog.authorProfile?.firstName || '', blog.authorProfile?.lastName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {blog.authorProfile?.firstName} {blog.authorProfile?.lastName}
                    </p>
                    <p className="text-xs text-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <h1 className="text-3xl font-bold text-foreground font-heading mb-4">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div 
                  className="prose prose-sm max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>

            {/* Interaction Bar */}
            <Card className="bg-card border-border mb-6">
              <CardContent className="py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      onClick={handleLike}
                      size="sm"
                      className={`flex items-center space-x-1 ${isLiked ? 'text-destructive' : 'text-foreground'} hover:text-destructive`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{likesCount}</span>
                    </Button>
                    
                    <div className="flex items-center space-x-1 text-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{viewsCount}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{commentsCount}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={handleBookmark}
                    size="sm"
                    className={isBookmarked ? 'text-primary' : 'text-foreground'}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base font-heading">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 text-primary" />
                  </div>
                  <span>Comments ({commentsCount})</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-4">
                {/* Add Comment */}
                {session?.data?.user && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={session.data.user.image || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(session.data.user.name?.split(' ')[0] || '', session.data.user.name?.split(' ')[1] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[80px] bg-background border-border resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-foreground">
                            Press Ctrl+Enter to submit
                          </p>
                          <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            size="sm"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.userProfile?.avatar || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(comment.userProfile?.firstName || '', comment.userProfile?.lastName || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-foreground text-sm">
                            {comment.userProfile?.firstName} {comment.userProfile?.lastName}
                          </p>
                          <p className="text-xs text-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                        <p className="text-foreground text-sm mb-2">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-foreground text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Author Info */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">About the Author</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={blog.authorProfile?.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(blog.authorProfile?.firstName || '', blog.authorProfile?.lastName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {blog.authorProfile?.firstName} {blog.authorProfile?.lastName}
                    </p>
                    <p className="text-xs text-foreground">
                      {blog.author?.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Tags</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {blog.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">Related Posts</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-2 text-sm">Sample Related Post</h4>
                    <p className="text-xs text-foreground mb-2">
                      This is a sample related post that would appear here...
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-foreground">
                      <Eye className="w-3 h-3" />
                      <span>1.2k views</span>
                      <MessageCircle className="w-3 h-3" />
                      <span>5 comments</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default BlogPostPage