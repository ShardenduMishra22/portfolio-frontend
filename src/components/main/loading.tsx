// components/skeletons/SkeletonComponents.tsx
import React from 'react'
import { cn } from '@/lib/utils'

// Base skeleton component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

// Skills Section Skeleton
export const SkillsSkeleton = () => {
  return (
    <div className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <Skeleton className="h-8 w-8 mb-3 mx-auto" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Projects Section Skeleton
export const ProjectsSkeleton = () => {
  return (
    <div className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Project Image */}
                <Skeleton className="h-48 w-full rounded-none" />
                
                {/* Project Content */}
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-20 rounded-lg" />
                    <Skeleton className="h-9 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Experience Section Skeleton
export const ExperienceSkeleton = () => {
  return (
    <div className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-muted/30" />
          
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="relative mb-12 last:mb-0">
              {/* Timeline Dot */}
              <div className="absolute left-6 w-4 h-4 bg-muted/50 rounded-full border-4 border-background" />
              
              {/* Experience Card */}
              <div className="ml-16 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-32 mt-2 md:mt-0" />
                </div>
                
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Certifications Section Skeleton
export const CertificationsSkeleton = () => {
  return (
    <div className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                {/* Certificate Icon/Image */}
                <div className="flex items-center justify-center mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                
                {/* Certificate Details */}
                <div className="text-center">
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto mb-3" />
                  <Skeleton className="h-4 w-20 mx-auto mb-4" />
                  
                  {/* Verify Button */}
                  <Skeleton className="h-8 w-24 mx-auto rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Education Section Skeleton
export const EducationSkeleton = () => {
  return (
    <div className="py-20 px-6 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Education Cards */}
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-4 w-24 mt-2 md:mt-0" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}