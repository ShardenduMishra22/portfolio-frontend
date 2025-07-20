'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  PenTool, 
  Eye, 
  Heart, 
  MessageCircle, 
  TrendingUp,
  Users,
  BookOpen,
  Star
} from 'lucide-react'

interface BlogStatsProps {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalFollowers?: number
  totalBookmarks?: number
  averageViews?: number
  topPerformingPost?: {
    title: string
    views: number
  }
  recentActivity?: {
    type: 'view' | 'like' | 'comment' | 'bookmark'
    count: number
    timeAgo: string
  }[]
}

const BlogStats: React.FC<BlogStatsProps> = ({
  totalPosts,
  totalViews,
  totalLikes,
  totalComments,
  totalFollowers = 0,
  totalBookmarks = 0,
  averageViews = 0,
  topPerformingPost,
  recentActivity = []
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view':
        return <Eye className="w-3 h-3 text-secondary" />
      case 'like':
        return <Heart className="w-3 h-3 text-destructive" />
      case 'comment':
        return <MessageCircle className="w-3 h-3 text-accent" />
      case 'bookmark':
        return <BookOpen className="w-3 h-3 text-primary" />
      default:
        return <Star className="w-3 h-3 text-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view':
        return 'text-secondary border-secondary/20'
      case 'like':
        return 'text-destructive border-destructive/20'
      case 'comment':
        return 'text-accent border-accent/20'
      case 'bookmark':
        return 'text-primary border-primary/20'
      default:
        return 'text-foreground border-border'
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Posts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalPosts)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Views</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-secondary" />
              </div>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalViews)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Likes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalLikes)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-foreground">Comments</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalComments)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">Followers</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(totalFollowers)}</p>
              </div>
              <Users className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">Bookmarks</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(totalBookmarks)}</p>
              </div>
              <BookOpen className="w-5 h-5 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-foreground">Avg. Views</p>
                <p className="text-lg font-bold text-foreground">{formatNumber(averageViews)}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Top Performing Post */}
        {topPerformingPost && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-heading">Top Post</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground text-sm line-clamp-2">
                  {topPerformingPost.title}
                </h4>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {formatNumber(topPerformingPost.views)} views
                  </Badge>
                  <div className="flex items-center space-x-1 text-xs text-foreground">
                    <Star className="w-3 h-3" />
                    <span>Best performer</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Engagement Metrics */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Engagement</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {totalPosts > 0 ? ((totalLikes / totalPosts) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-foreground">Likes</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-secondary">
                  {totalPosts > 0 ? ((totalComments / totalPosts) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-foreground">Comments</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-accent">
                  {totalPosts > 0 ? ((totalBookmarks / totalPosts) * 100).toFixed(1) : '0'}%
                </div>
                <p className="text-xs text-foreground">Bookmarks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-heading">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {recentActivity.slice(0, 4).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <div className="flex items-center space-x-2">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.count} {activity.type}{activity.count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-foreground">{activity.timeAgo}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BlogStats