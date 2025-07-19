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
        return <Eye className="w-4 h-4 text-secondary" />
      case 'like':
        return <Heart className="w-4 h-4 text-destructive" />
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-accent" />
      case 'bookmark':
        return <BookOpen className="w-4 h-4 text-primary" />
      default:
        return <Star className="w-4 h-4 text-foreground" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'view':
        return 'text-secondary'
      case 'like':
        return 'text-destructive'
      case 'comment':
        return 'text-accent'
      case 'bookmark':
        return 'text-primary'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{formatNumber(totalPosts)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-secondary" />
              <span className="text-2xl font-bold text-foreground">{formatNumber(totalViews)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-destructive" />
              <span className="text-2xl font-bold text-foreground">{formatNumber(totalLikes)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold text-foreground">{formatNumber(totalComments)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold text-foreground">{formatNumber(totalFollowers)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Bookmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <span className="text-xl font-bold text-foreground">{formatNumber(totalBookmarks)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Avg. Views/Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              <span className="text-xl font-bold text-foreground">{formatNumber(averageViews)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Post */}
      {topPerformingPost && (
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground line-clamp-1">
                  {topPerformingPost.title}
                </h4>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {formatNumber(topPerformingPost.views)} views
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-foreground">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>Most viewed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>Top performer</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.count} {activity.type}
                        {activity.count !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-foreground">
                        {activity.timeAgo}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getActivityColor(activity.type)} border-current`}
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Rate */}
      <Card className="bg-card/60 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {totalPosts > 0 ? ((totalLikes / totalPosts) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-sm text-foreground">Like Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {totalPosts > 0 ? ((totalComments / totalPosts) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-sm text-foreground">Comment Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {totalPosts > 0 ? ((totalBookmarks / totalPosts) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-sm text-foreground">Bookmark Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogStats 