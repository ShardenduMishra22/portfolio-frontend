import dynamic from 'next/dynamic'
import React from 'react'

// Dynamic imports for heavy components
export const DynamicShootingStars = dynamic(
  () => import('@/components/ui/shooting-stars').then((mod) => ({ default: mod.ShootingStars })),
  {
    ssr: false,
    loading: () => null,
  }
)

export const DynamicStarsBackground = dynamic(
  () => import('@/components/ui/stars-background').then((mod) => ({ default: mod.StarsBackground })),
  {
    ssr: false,
    loading: () => null,
  }
)

export const DynamicProjectsSection = dynamic(
  () => import('@/components/lazy/proj').then((mod) => ({ default: mod.LazyProjectsSection })),
  {
    ssr: false,
    loading: () => React.createElement('div', { className: 'min-h-[400px] flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading projects...')
    ),
  }
)

export const DynamicExperienceSection = dynamic(
  () => import('@/components/lazy/exp').then((mod) => ({ default: mod.LazyExperienceSection })),
  {
    ssr: false,
    loading: () => React.createElement('div', { className: 'min-h-[400px] flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading experience...')
    ),
  }
)

export const DynamicCertificationsSection = dynamic(
  () => import('@/components/lazy/cert').then((mod) => ({ default: mod.LazyCertificationsSection })),
  {
    ssr: false,
    loading: () => React.createElement('div', { className: 'min-h-[400px] flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading certifications...')
    ),
  }
)

// Heavy UI components
export const DynamicCanvasRevealEffect = dynamic(
  () => import('@/components/ui/canvas-reveal-effect').then((mod) => ({ default: mod.CanvasRevealEffect })),
  {
    ssr: false,
    loading: () => null,
  }
)

export const DynamicSparklesCore = dynamic(
  () => import('@/components/ui/sparkles').then((mod) => ({ default: mod.SparklesCore })),
  {
    ssr: false,
    loading: () => null,
  }
)

// Chart components
export const DynamicTechnologyStackCard = dynamic(
  () => import('@/components/chart/tech').then((mod) => ({ default: mod.TechnologyStackCard })),
  {
    ssr: false,
    loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading chart...')
    ),
  }
)

export const DynamicEnhancedCommitsChart = dynamic(
  () => import('@/components/chart/commit').then((mod) => ({ default: mod.EnhancedCommitsChart })),
  {
    ssr: false,
    loading: () => React.createElement('div', { className: 'h-64 flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading chart...')
    ),
  }
)