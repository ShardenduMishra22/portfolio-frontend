import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Blog Card Skeleton
export const BlogCardSkeleton = () => {
  return (
    <Card className="bg-card border-border hover:bg-accent/5 transition-all group">
      {/* Featured Image Placeholder */}
      <div className="aspect-[16/10] bg-muted/50 relative overflow-hidden rounded-t-lg">
        <Skeleton className="absolute inset-0" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-4 w-24 mb-1" />
            <div className="flex items-center space-x-1">
              <Skeleton className="w-3 h-3 rounded" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-8" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  )
}

// Blog List Skeleton
export const BlogListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Blog Dashboard Skeleton
export const BlogDashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex space-x-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-lg" />
        ))}
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Blog Grid */}
      <BlogListSkeleton count={9} />
    </div>
  )
}

// Blog Post Skeleton
export const BlogPostSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-32 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-6 border-t">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
      </div>
    </div>
  )
}

// Blog Comments Skeleton
export const BlogCommentsSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex space-x-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
} 