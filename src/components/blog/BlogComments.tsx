'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  Send, 
  ThumbsUp, 
  Reply, 
  MoreHorizontal,
  Flag,
  Edit,
  Trash2,
  User
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  likes?: number
  replies?: Comment[]
  isLiked?: boolean
  isAuthor?: boolean
}

interface BlogCommentsProps {
  comments: Comment[]
  currentUserId?: string
  onAddComment: (content: string) => void
  onLikeComment?: (commentId: number) => void
  onReplyComment?: (commentId: number, content: string) => void
  onEditComment?: (commentId: number, content: string) => void
  onDeleteComment?: (commentId: number) => void
  onReportComment?: (commentId: number) => void
  loading?: boolean
}

const BlogComments: React.FC<BlogCommentsProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onLikeComment,
  onReplyComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  loading = false
}) => {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim())
      setNewComment('')
    }
  }

  const handleSubmitReply = (commentId: number) => {
    if (replyContent.trim()) {
      onReplyComment?.(commentId, replyContent.trim())
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  const handleEditComment = (commentId: number) => {
    if (editContent.trim()) {
      onEditComment?.(commentId, editContent.trim())
      setEditContent('')
      setEditingComment(null)
    }
  }

  const startReply = (commentId: number) => {
    setReplyingTo(commentId)
    setReplyContent('')
  }

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyContent('')
  }

  const cancelEdit = () => {
    setEditingComment(null)
    setEditContent('')
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`space-y-2 ${isReply ? 'ml-6 border-l-2 border-border pl-3' : ''}`}>
      <div className="flex items-start space-x-2">
        <Avatar className="w-7 h-7 flex-shrink-0">
          <AvatarImage src={comment.userProfile?.avatar || ''} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {getInitials(comment.userProfile?.firstName || '', comment.userProfile?.lastName || '')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-foreground text-sm">
                {comment.userProfile?.firstName} {comment.userProfile?.lastName}
              </p>
              {comment.isAuthor && (
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  Author
                </Badge>
              )}
              <p className="text-xs text-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currentUserId === comment.user.id ? (
                  <>
                    <DropdownMenuItem onClick={() => startEdit(comment)}>
                      <Edit className="w-3 h-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteComment?.(comment.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={() => onReportComment?.(comment.id)}>
                    <Flag className="w-3 h-3 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {editingComment === comment.id ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[60px] bg-background border-border resize-none"
                placeholder="Edit your comment..."
              />
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleEditComment(comment.id)}
                  disabled={!editContent.trim()}
                  className="h-7 px-3 text-xs"
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground text-sm leading-relaxed">{comment.content}</p>
          )}
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLikeComment?.(comment.id)}
              className={`flex items-center space-x-1 h-7 px-2 ${
                comment.isLiked ? 'text-destructive' : 'text-foreground'
              } hover:text-destructive hover:bg-destructive/10`}
            >
              <ThumbsUp className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{comment.likes || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startReply(comment.id)}
              className="text-foreground hover:text-foreground h-7 px-2"
            >
              <Reply className="w-3 h-3 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
          </div>
          
          {replyingTo === comment.id && (
            <div className="space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px] bg-background border-border resize-none"
                placeholder="Write a reply..."
              />
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(comment.id)}
                  disabled={!replyContent.trim()}
                  className="h-7 px-3 text-xs"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelReply}
                  className="h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base font-heading">
          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="w-3 h-3 text-primary" />
          </div>
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Add Comment */}
        {currentUserId && (
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[70px] bg-background border-border resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-foreground">
                    Press Ctrl+Enter to submit
                  </p>
                  <Button
                    onClick={handleSubmitComment}
                    disabled={loading || !newComment.trim()}
                    size="sm"
                    className="h-8 px-4"
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
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <p className="text-foreground text-sm">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => renderComment(comment))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default BlogComments