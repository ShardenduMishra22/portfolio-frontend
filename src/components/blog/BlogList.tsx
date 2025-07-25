'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Eye, Heart, MessageCircle, ArrowRight, BookOpen } from 'lucide-react'
import { Blog } from '@/services/types'

interface BlogListProps {
  blogs: Blog[]
  onReadMore?: (blogId: string) => void
  layout?: 'grid' | 'list'
  showStats?: boolean
  emptyMessage?: string
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onReadMore,
  layout = 'grid',
  showStats = true,
  emptyMessage = 'No blogs found',
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold font-heading text-foreground mb-2">{emptyMessage}</h3>
        <p className="text-sm text-foreground">Start creating your first blog post</p>
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="space-y-3">
        {blogs.map((blog) => (
          <Card key={blog.id} className="bg-card border-border hover:bg-accent/5 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={blog.author?.avatar || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {blog.author?.name
                      ? blog.author.name
                          .split(' ')
                          .map((n) => n.charAt(0))
                          .join('')
                          .toUpperCase()
                      : blog.author?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-foreground">
                        {blog.author.name && blog.author?.name
                          ? `${blog.author.name} ${blog.author.name}`
                          : blog.author?.email || 'Unknown Author'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-foreground text-sm mb-3 line-clamp-2">
                    {truncateText(blog.content, 200)}
                  </p>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {showStats && (
                      <div className="flex items-center space-x-3 text-xs text-foreground">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>
                            {Array.isArray(blog.views) ? blog.views.length : blog.views || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>
                            {Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>
                            {Array.isArray(blog.comments)
                              ? blog.comments.length
                              : blog.comments || 0}
                          </span>
                        </div>
                      </div>
                    )}

                    {onReadMore && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onReadMore(blog.id.toString())}
                        className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                      >
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className="bg-card border-border hover:bg-accent/5 hover:border-primary/20 transition-all group"
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={blog.author?.avatar || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {blog.author?.name
                    ? blog.author.name
                        .split(' ')
                        .map((n) => n.charAt(0))
                        .join('')
                        .toUpperCase()
                    : blog.author?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {blog.author?.name ? blog.author.name : blog.author?.email || 'Unknown Author'}
                </p>
                <p className="text-xs text-foreground flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(blog.createdAt)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors font-heading">
              {blog.title}
            </CardTitle>
            <CardDescription className="line-clamp-3 text-sm mb-3">
              {truncateText(blog.content)}
            </CardDescription>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
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

            <div className="flex items-center justify-between">
              {showStats && (
                <div className="flex items-center space-x-3 text-xs text-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{Array.isArray(blog.views) ? blog.views.length : blog.views || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>
                      {Array.isArray(blog.comments) ? blog.comments.length : blog.comments || 0}
                    </span>
                  </div>
                </div>
              )}

              {onReadMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReadMore(blog.id.toString())}
                  className="text-primary hover:text-primary-foreground hover:bg-primary h-8 px-3"
                >
                  Read More
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default BlogList
