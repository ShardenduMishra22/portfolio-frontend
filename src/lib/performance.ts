import dynamic from 'next/dynamic'
import React from 'react'

// Performance optimization utilities

// Debounce function for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Check if device is low-end
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false

  const isMobile = window.innerWidth < 768
  const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
  const hasSlowConnection = (navigator as any).connection && 
    ((navigator as any).connection.effectiveType === 'slow-2g' || 
     (navigator as any).connection.effectiveType === '2g' ||
     (navigator as any).connection.effectiveType === '3g')
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return prefersReducedMotion || (isMobile && (hasLowMemory || hasSlowConnection))
}

// Preload critical resources
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return

  const criticalResources = [
    '/Professional.webp',
    '/static/fonts/fredoka-latin-600-normal.woff2',
    '/static/fonts/poppins-latin-400-normal.woff2',
  ]

  criticalResources.forEach((resource) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = resource.endsWith('.woff2') ? 'font' : 'image'
    link.href = resource
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Optimize images based on device
export function getOptimizedImageProps(
  src: string,
  alt: string,
  sizes?: string
): {
  src: string
  alt: string
  sizes: string
  priority: boolean
  placeholder: 'blur' | 'empty'
  blurDataURL?: string
} {
  const isLowEnd = isLowEndDevice()
  
  return {
    src,
    alt,
    sizes: sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority: src.includes('Professional.webp'), // Only prioritize hero image
    placeholder: 'blur',
    blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==',
  }
}

// Lazy load components with intersection observer
export function createLazyLoader<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => fallback || React.createElement('div', { className: 'min-h-[200px] flex items-center justify-center' },
      React.createElement('div', { className: 'text-muted-foreground' }, 'Loading...')
    ),
  })
}

// Optimize animations based on device performance
export function getAnimationConfig() {
  const isLowEnd = isLowEndDevice()
  
  return {
    shootingStars: {
      enabled: !isLowEnd,
      maxStars: isLowEnd ? 1 : 3,
      minDelay: isLowEnd ? 4000 : 2000,
      maxDelay: isLowEnd ? 8000 : 4000,
    },
    starsBackground: {
      enabled: !isLowEnd,
      maxStars: isLowEnd ? 20 : 50,
      starDensity: isLowEnd ? 0.00004 : 0.00008,
      allStarsTwinkle: false,
      twinkleProbability: isLowEnd ? 0.1 : 0.3,
    },
    scrollBehavior: isLowEnd ? 'auto' : 'smooth',
  }
}

// Cache management
export class PerformanceCache {
  private static cache = new Map<string, any>()
  private static maxSize = 100

  static set(key: string, value: any, ttl: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) {
        this.cache.delete(firstKey)
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    })
  }

  static get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  static clear(): void {
    this.cache.clear()
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void): void {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`${name} took ${(end - start).toFixed(2)}ms`)
  } else {
    fn()
  }
}

// Optimize bundle size by conditionally importing heavy libraries
export async function loadHeavyLibrary<T>(
  importFn: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    if (isLowEndDevice()) {
      return fallback || ({} as T)
    }
    return await importFn()
  } catch (error) {
    console.warn('Failed to load heavy library:', error)
    return fallback || ({} as T)
  }
}