// components/skeletons/SkeletonComponents.tsx
import React from 'react'
import { cn } from '@/lib/utils'

// Base skeleton component with enhanced animation
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-muted/40 via-muted/60 to-muted/40 backdrop-blur-sm bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

// Enhanced pulse animation keyframe (add to your global CSS)
// @keyframes shimmer {
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }

// Skills Section Skeleton - Mobile responsive
export const SkillsSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-8 w-32 sm:h-10 sm:w-40 lg:h-12 lg:w-48 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-4 w-64 sm:h-5 sm:w-80 lg:h-6 lg:w-96 mx-auto" />
          <Skeleton className="h-3 w-20 sm:w-24 mx-auto mt-2 sm:mt-3" />
        </div>

        {/* Skills Grid - Mobile first responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] flex flex-col items-center justify-center">
                <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 mb-2 sm:mb-3 mx-auto rounded-full" />
                <Skeleton className="h-3 w-12 sm:h-4 sm:w-14 lg:w-16 mx-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination skeleton */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 sm:mt-12 lg:mt-16">
          <Skeleton className="h-8 w-16 sm:h-10 sm:w-20 rounded-lg" />
          <div className="flex gap-1 sm:gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-16 sm:h-10 sm:w-20 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Projects Section Skeleton - Enhanced mobile layout
export const ProjectsSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-6 w-24 sm:h-8 sm:w-32 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-8 w-40 sm:h-10 sm:w-48 lg:h-12 lg:w-56 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-1 w-16 sm:w-20 lg:w-24 mx-auto mb-4 sm:mb-6" />
          <Skeleton className="h-4 w-64 sm:h-5 sm:w-80 lg:h-6 lg:w-96 mx-auto" />
        </div>

        {/* Projects Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 min-h-[380px] sm:min-h-[420px]">
                {/* Project number badge */}
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                  </div>
                </div>
                
                {/* Project Content */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                  <div className="pr-10 sm:pr-12">
                    <Skeleton className="h-6 w-3/4 sm:h-7 lg:h-8 mb-2 sm:mb-3" />
                    <Skeleton className="h-4 w-1/2 sm:h-5 mb-3 sm:mb-4" />
                  </div>
                  
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-6 w-12 sm:w-16 rounded-full" />
                    ))}
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <Skeleton className="h-8 w-full sm:h-9 sm:w-24 rounded-lg" />
                    <Skeleton className="h-8 w-full sm:h-9 sm:w-20 rounded-lg" />
                    <Skeleton className="h-8 w-full sm:h-9 sm:w-28 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-16">
          <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-none">
            <Skeleton className="h-8 w-16 sm:h-10 sm:w-20 rounded-lg" />
            <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-lg" />
          </div>
          <div className="flex gap-1 sm:gap-2 order-1 sm:order-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 sm:h-10 sm:w-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Experience Section Skeleton - Mobile optimized
export const ExperienceSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-6 w-32 sm:h-8 sm:w-40 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-8 w-48 sm:h-12 sm:w-64 lg:w-80 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-1 w-20 sm:w-32 mx-auto mb-4 sm:mb-6" />
          <Skeleton className="h-4 w-72 sm:h-5 sm:w-96 mx-auto" />
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 min-h-[380px] sm:min-h-[420px]">
                {/* Experience number badge */}
                <div className="absolute top-4 right-4">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
                </div>
                
                <div className="pr-10 sm:pr-12 mb-4 sm:mb-6">
                  <Skeleton className="h-6 w-3/4 sm:h-7 lg:h-8 mb-2 sm:mb-3" />
                  <Skeleton className="h-4 w-1/2 sm:h-5 mb-2 sm:mb-3" />
                  <Skeleton className="h-4 w-32 sm:w-40 rounded-lg" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                
                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-12 sm:w-16 rounded-full" />
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col gap-2 sm:gap-3">
                  <Skeleton className="h-8 w-full sm:h-9 rounded-lg" />
                  <Skeleton className="h-8 w-full sm:h-9 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-16">
          <div className="flex gap-2 sm:gap-4 order-2 sm:order-none">
            <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-lg" />
            <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-lg" />
          </div>
          <div className="flex gap-1 sm:gap-2 order-1 sm:order-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 sm:h-10 sm:w-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Certifications Section Skeleton - Enhanced mobile
export const CertificationsSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-6 w-24 sm:h-8 sm:w-32 mx-auto mb-3 rounded-full" />
          <Skeleton className="h-8 w-48 sm:h-12 sm:w-64 mx-auto mb-3 sm:mb-4" />
          <Skeleton className="h-4 w-64 sm:h-5 sm:w-80 mx-auto" />
        </div>

        {/* Certifications Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group">
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 min-h-[300px] sm:min-h-[350px]">
                {/* Certificate number badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                </div>
                
                <div className="pr-8 sm:pr-10 mb-4">
                  <Skeleton className="h-5 w-3/4 sm:h-6 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-24 sm:w-32 rounded-full" />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-3 w-full sm:h-4" />
                  <Skeleton className="h-3 w-4/5 sm:h-4" />
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-12 sm:h-6 sm:w-16 rounded-full" />
                  ))}
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Skeleton className="h-8 w-full sm:h-9 sm:w-24 rounded-lg" />
                  <Skeleton className="h-8 w-full sm:h-9 sm:w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-8 sm:mt-16">
          <div className="flex gap-2 sm:gap-4 order-2 sm:order-none">
            <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-lg" />
            <Skeleton className="h-8 w-12 sm:h-10 sm:w-16 rounded-lg" />
          </div>
          <div className="flex gap-1 sm:gap-2 order-1 sm:order-none">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-7 sm:h-10 sm:w-10 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Education Section Skeleton - Mobile responsive
export const EducationSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <Skeleton className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 mx-auto mb-3 sm:mb-4 rounded-full" />
          <Skeleton className="h-8 w-32 sm:h-10 sm:w-40 lg:h-12 lg:w-48 mx-auto mb-2 sm:mb-3" />
          <Skeleton className="h-4 w-64 sm:h-5 sm:w-80 mx-auto" />
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* College */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
                <div className="min-w-0">
                  <Skeleton className="h-5 w-32 sm:h-6 sm:w-40 mb-1 sm:mb-2" />
                  <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-12 sm:h-8 sm:w-16 rounded-full" />
            </div>
            
            <Skeleton className="h-4 w-full sm:h-5 mb-2" />
            <Skeleton className="h-3 w-3/4 sm:h-4 mb-3 sm:mb-4" />
            <Skeleton className="h-12 w-full sm:h-16 rounded-lg" />
          </div>

          {/* School */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <div className="min-w-0">
                <Skeleton className="h-5 w-32 sm:h-6 sm:w-36 mb-1 sm:mb-2" />
                <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              </div>
            </div>
            
            <Skeleton className="h-4 w-full sm:h-5 mb-2" />
            <Skeleton className="h-3 w-3/4 sm:h-4 mb-3 sm:mb-4" />
            
            {/* Grades grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Skeleton className="h-16 w-full sm:h-20 rounded-lg" />
              <Skeleton className="h-16 w-full sm:h-20 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Languages */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-20 sm:h-6 sm:w-24 mb-1" />
                <Skeleton className="h-3 w-16 sm:h-4 sm:w-20" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-12 sm:h-7 sm:w-16 rounded-full" />
              ))}
            </div>
          </div>

          {/* Resume section */}
          <div className="lg:col-span-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <Skeleton className="h-5 w-48 sm:h-6 sm:w-64 mb-1 sm:mb-2" />
                <Skeleton className="h-3 w-40 sm:h-4 sm:w-56" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Skeleton className="h-9 w-full sm:h-10 sm:w-28 rounded-full" />
                <Skeleton className="h-9 w-full sm:h-10 sm:w-32 rounded-full sm:hidden" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile stats */}
        <div className="mt-8 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-4 border border-border sm:hidden">
          <Skeleton className="h-5 w-32 mx-auto mb-3" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="space-y-1">
              <Skeleton className="h-6 w-12 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-6 w-8 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hero Section Skeleton
export const HeroSkeleton = () => {
  return (
    <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Image Section */}
          <div className="flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative">
              <Skeleton className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-xl sm:rounded-2xl" />
              <Skeleton className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
              <Skeleton className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
            </div>
          </div>

          {/* Content Section */}
          <div className="text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <Skeleton className="h-10 w-48 sm:h-12 sm:w-64 lg:h-16 lg:w-80 mx-auto lg:mx-0" />
                <Skeleton className="h-10 w-40 sm:h-12 sm:w-56 lg:h-16 lg:w-72 mx-auto lg:mx-0" />
                <Skeleton className="h-1 w-12 sm:w-16 mx-auto lg:mx-0" />
              </div>
              
              {/* Description */}
              <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
                <Skeleton className="h-4 w-full sm:h-5 max-w-lg mx-auto lg:mx-0" />
                <Skeleton className="h-4 w-4/5 sm:h-5 max-w-md mx-auto lg:mx-0" />
              </div>

              {/* Email */}
              <Skeleton className="h-10 w-64 sm:w-80 mx-auto lg:mx-0 rounded-full" />
              
              {/* Buttons */}
              <div className="flex flex-col gap-3 sm:gap-4 px-4 sm:px-0">
                <Skeleton className="h-10 w-full sm:h-12 sm:w-auto rounded-full" />
                <Skeleton className="h-10 w-full sm:h-12 sm:w-auto rounded-full" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="mt-12 sm:mt-20 flex justify-center space-x-4 sm:space-x-6">
          <Skeleton className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" />
          <Skeleton className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" />
          <Skeleton className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Footer Skeleton
export const FooterSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-card via-card/95 to-secondary/10 border-t border-border/50 py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
              <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
              <Skeleton className="h-6 w-40 sm:h-7 sm:w-48" />
            </div>
            <Skeleton className="h-4 w-full max-w-md mx-auto sm:mx-0 mb-2" />
            <Skeleton className="h-4 w-3/4 max-w-sm mx-auto sm:mx-0 mb-4" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
          </div>

          {/* Links sections */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center sm:text-left">
              <Skeleton className="h-5 w-24 sm:w-28 mb-4 mx-auto sm:mx-0" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-20 sm:w-24 mx-auto sm:mx-0" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-6 sm:pt-8 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Skeleton className="h-4 w-48 sm:w-64 order-2 sm:order-1" />
            <Skeleton className="h-8 w-28 sm:h-10 sm:w-32 rounded-full order-1 sm:order-2" />
          </div>
        </div>
      </div>
    </div>
  )
}
