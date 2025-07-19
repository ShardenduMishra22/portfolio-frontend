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

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={blog.author?.avatar || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {getInitials(blog.author?.firstName || '', blog.author?.lastName || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">
                {blog.author?.firstName} {blog.author?.lastName}
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
              className="text-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onBookmark?.(blog.id.toString())}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-primary' : ''}`} />
            </Button>
          )}
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
      
      <CardFooter className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-4 text-sm text-foreground">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{blog.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-destructive' : ''}`} />
            <span>{blog.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{blog.comments || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showActions && onLike && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLike(blog.id.toString())}
              className={`${isLiked ? 'text-destructive' : 'text-foreground'} hover:text-destructive`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReadMore?.(blog.id.toString())}
            className="text-primary hover:text-primary/80 group-hover:bg-primary/10"
          >
            <span className="mr-1">Read More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default BlogCard 