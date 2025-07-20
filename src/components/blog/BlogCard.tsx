'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { 
  Heart, 
  Bookmark, 
  Eye, 
  MessageCircle, 
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Blog } from '@/services/types'

interface BlogCardProps {
  blog: Blog
  onLike?: (blogId: string) => void
  onBookmark?: (blogId: string) => void
  onReadMore?: (blogId: string) => void
  isLiked?: boolean
  isBookmarked?: boolean
  showActions?: boolean
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onLike,
  onBookmark,
  onReadMore,
  isLiked = false,
  isBookmarked = false,
  showActions = true
}) => {
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

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={blog.authorProfile?.avatar || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {blog.authorProfile?.firstName && blog.authorProfile?.lastName
                  ? getInitials(blog.authorProfile.firstName, blog.authorProfile.lastName)
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
          {showActions && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onBookmark?.(blog.id.toString())}
            >
              <Bookmark className={`w-4 h-4 ${
                isBookmarked ? 'fill-current text-primary' : 'text-foreground'
              }`} />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3">
        <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors font-heading">
          {blog.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm mb-3">
          {truncateText(blog.content)}
        </CardDescription>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {blog.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {blog.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{blog.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>
              {Array.isArray(blog.views)
                ? blog.views.length
                : blog.views ?? 0}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current text-destructive' : ''}`} />
            <span>
              {Array.isArray(blog.likes)
                ? blog.likes.length
                : blog.likes ?? 0}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>
              {Array.isArray(blog.comments)
                ? blog.comments.length
                : blog.comments ?? 0}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {showActions && onLike && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(blog.id.toString())}
              className={`h-8 w-8 p-0 ${
                isLiked ? 'text-destructive' : 'text-foreground'
              } hover:text-destructive`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReadMore?.(blog.id.toString())}
            className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
          >
            Read More
            <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCard
