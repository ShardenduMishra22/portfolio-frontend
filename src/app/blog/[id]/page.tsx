'use client'

import { authClient } from '@/lib/authClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Trash2
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
      if (response.success) {
        setBlog(response.data)
        setLikesCount(response.data.likes || 0)
        setViewsCount(response.data.views || 0)
        setCommentsCount(response.data.comments || 0)
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
        // The API returns comments directly in data array, not data.data
        setComments(Array.isArray(response.data) ? response.data : [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const addView = async () => {
    try {
      if (session?.user?.id) {
        await blogsService.addBlogView(resolvedParams.id, {
          userId: session.user.id,
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent
        })
      }
    } catch (error) {
      console.error('Error adding view:', error)
    }
  }

  const handleLike = async () => {
    if (!session?.user?.id) return
    
    try {
      if (isLiked) {
        await blogsService.unlikeBlog(resolvedParams.id, { userId: session.user.id })
        setLikesCount(prev => prev - 1)
      } else {
        await blogsService.likeBlog(resolvedParams.id, { userId: session.user.id })
        setLikesCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleBookmark = async () => {
    if (!session?.user?.id) return
    
    try {
      if (isBookmarked) {
        await blogsService.unbookmarkBlog(resolvedParams.id, { userId: session.user.id })
      } else {
        await blogsService.bookmarkBlog(resolvedParams.id, { userId: session.user.id })
      }
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const handleAddComment = async () => {
    if (!session?.user?.id || !newComment.trim()) return
    
    try {
      const response = await blogsService.addBlogComment(resolvedParams.id, {
        content: newComment.trim(),
        userId: session.user.id
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Blog not found</h2>
          <p className="text-foreground mb-4">The blog post you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/blog/landing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
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
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {session && blog.authorId === session.user?.id && (
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog Content */}
          <div className="lg:col-span-3">
            {/* Blog Header */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={blog.author?.avatar || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(blog.author?.firstName || '', blog.author?.lastName || '')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {blog.author?.firstName} {blog.author?.lastName}
                      </p>
                      <p className="text-sm text-foreground flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <h1 className="text-4xl font-bold text-foreground font-heading mb-4">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {blog.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div 
                  className="prose prose-lg max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </CardContent>
            </Card>

            {/* Interaction Bar */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50 mb-8">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <Button
                      variant="ghost"
                      onClick={handleLike}
                      className={`flex items-center space-x-2 ${isLiked ? 'text-destructive' : 'text-foreground'}`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{likesCount}</span>
                    </Button>
                    
                    <div className="flex items-center space-x-2 text-foreground">
                      <Eye className="w-5 h-5" />
                      <span>{viewsCount}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-foreground">
                      <MessageCircle className="w-5 h-5" />
                      <span>{commentsCount}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    onClick={handleBookmark}
                    className={isBookmarked ? 'text-primary' : 'text-foreground'}
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>Comments ({commentsCount})</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Add Comment */}
                {session && (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={session.user?.image || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(session.user?.name?.split(' ')[0] || '', session.user?.name?.split(' ')[1] || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px] bg-card/60 backdrop-blur-sm border-border/50"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-foreground">
                            Press Enter to submit
                          </p>
                          <Button
                            onClick={handleAddComment}
                            disabled={!newComment.trim()}
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Comment
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
                    <div key={comment.id} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.userProfile?.avatar || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(comment.userProfile?.firstName || '', comment.userProfile?.lastName || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="font-medium text-foreground">
                            {comment.userProfile?.firstName} {comment.userProfile?.lastName}
                          </p>
                          <p className="text-xs text-foreground">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                        <p className="text-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center space-x-4">
                          <Button variant="ghost" size="sm" className="text-foreground hover:text-foreground">
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm" className="text-foreground hover:text-foreground">
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-foreground mx-auto mb-4" />
                      <p className="text-foreground">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={blog.author?.avatar || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(blog.author?.firstName || '', blog.author?.lastName || '')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {blog.author?.firstName} {blog.author?.lastName}
                    </p>
                    <p className="text-sm text-foreground">
                      {blog.author?.email}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Related Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Sample Related Post</h4>
                    <p className="text-sm text-foreground mb-2">
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

            {/* Tags */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer hover:bg-primary/10">
                      {tag}
                    </Badge>
                  ))}
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