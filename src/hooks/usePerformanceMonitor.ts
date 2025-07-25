import { useEffect, useState, useCallback, useRef } from 'react'

interface PerformanceMetrics {
  // Core Web Vitals
  FCP?: number // First Contentful Paint
  LCP?: number // Largest Contentful Paint
  FID?: number // First Input Delay
  CLS?: number // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number
  domContentLoaded?: number
  memoryUsage?: {
    used: number
    total: number
    usedPercent: number
  }
  renderCount?: number
  reRenderTime?: number
}

interface PerformanceConfig {
  enableWebVitals?: boolean
  enableMemoryMonitoring?: boolean
  enableRenderTracking?: boolean
  reportInterval?: number
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
}

export function usePerformanceMonitor(config: PerformanceConfig = {}) {
  const {
    enableWebVitals = true,
    enableMemoryMonitoring = true,
    enableRenderTracking = true,
    reportInterval = 5000,
    onMetricsUpdate,
  } = config

  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const renderCountRef = useRef(0)
  const renderStartRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Measure memory usage
  const measureMemory = useCallback((): PerformanceMetrics['memoryUsage'] | undefined => {
    if (!enableMemoryMonitoring || !(performance as any).memory) {
      return undefined
    }

    const memory = (performance as any).memory
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
      usedPercent: Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100),
    }
  }, [enableMemoryMonitoring])

  // Measure Web Vitals
  const measureWebVitals = useCallback((): Partial<PerformanceMetrics> => {
    if (!enableWebVitals || typeof window === 'undefined') {
      return {}
    }

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')

    const metrics: Partial<PerformanceMetrics> = {}

    // First Contentful Paint
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      metrics.FCP = Math.round(fcp.startTime)
    }

    // Time to First Byte
    if (navigation) {
      metrics.TTFB = Math.round(navigation.responseStart - navigation.requestStart)
      metrics.pageLoadTime = Math.round(navigation.loadEventEnd - navigation.fetchStart)
      metrics.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart)
    }

    return metrics
  }, [enableWebVitals])

  // Track render performance
  const trackRender = useCallback(() => {
    if (!enableRenderTracking) return

    renderCountRef.current += 1
    
    if (renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current
      setMetrics(prev => ({
        ...prev,
        renderCount: renderCountRef.current,
        reRenderTime: Math.round(renderTime * 100) / 100,
      }))
    }
    
    renderStartRef.current = performance.now()
  }, [enableRenderTracking])

  // Update all metrics
  const updateMetrics = useCallback(() => {
    const webVitals = measureWebVitals()
    const memory = measureMemory()

    const newMetrics: PerformanceMetrics = {
      ...webVitals,
      ...(memory && { memoryUsage: memory }),
      renderCount: renderCountRef.current,
    }

    setMetrics(prev => ({ ...prev, ...newMetrics }))
    onMetricsUpdate?.(newMetrics)
  }, [measureWebVitals, measureMemory, onMetricsUpdate])

  // Setup observers for advanced metrics
  useEffect(() => {
    if (!enableWebVitals || typeof window === 'undefined') return

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      setMetrics(prev => ({ ...prev, LCP: Math.round(lastEntry.startTime) }))
    })

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime
          setMetrics(prev => ({ ...prev, FID: Math.round(fid) }))
        }
      })
    })

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })

      setMetrics(prev => ({ ...prev, CLS: Math.round(clsValue * 1000) / 1000 }))
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      fidObserver.observe({ entryTypes: ['first-input'] })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('Performance observers not supported:', error)
    }

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [enableWebVitals])

  // Setup periodic reporting
  useEffect(() => {
    if (reportInterval > 0) {
      intervalRef.current = setInterval(updateMetrics, reportInterval)
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
    return () => {} // Return empty cleanup function when reportInterval is 0
  }, [reportInterval, updateMetrics])

  // Track renders
  useEffect(() => {
    trackRender()
    return () => {} // Empty cleanup function
  })

  // Initial measurement
  useEffect(() => {
    updateMetrics()
  }, [updateMetrics])

  // Performance utilities
  const measureFunction = useCallback(<T extends any[], R>(
    fn: (...args: T) => R,
    name?: string
  ) => {
    return (...args: T): R => {
      const start = performance.now()
      const result = fn(...args)
      const end = performance.now()
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name || 'Function'} execution time: ${(end - start).toFixed(2)}ms`)
      }
      
      return result
    }
  }, [])

  const mark = useCallback((name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name)
    }
  }, [])

  const measure = useCallback((name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        performance.measure(name, startMark, endMark)
        const entries = performance.getEntriesByName(name, 'measure')
        const latestEntry = entries[entries.length - 1]
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`${name}: ${latestEntry.duration.toFixed(2)}ms`)
        }
        
        return latestEntry.duration
      } catch (error) {
        console.warn('Performance measurement failed:', error)
        return 0
      }
    }
    return 0
  }, [])

  const getNavigationMetrics = useCallback(() => {
    if (typeof window === 'undefined') return {}
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (!navigation) return {}

    return {
      dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
      tcp: Math.round(navigation.connectEnd - navigation.connectStart),
      ssl: navigation.secureConnectionStart > 0 
        ? Math.round(navigation.connectEnd - navigation.secureConnectionStart)
        : 0,
      ttfb: Math.round(navigation.responseStart - navigation.requestStart),
      download: Math.round(navigation.responseEnd - navigation.responseStart),
      domProcessing: Math.round(navigation.domContentLoadedEventStart - navigation.fetchStart),
      domComplete: Math.round(navigation.domComplete - navigation.fetchStart),
    }
  }, [])

  return {
    metrics,
    measureFunction,
    mark,
    measure,
    getNavigationMetrics,
    updateMetrics,
    reset: () => {
      renderCountRef.current = 0
      setMetrics({})
    },
  }
}

// Hook for component-specific performance tracking
export function useComponentPerformance(componentName: string) {
  const startTimeRef = useRef<number>(0)
  const [renderTime, setRenderTime] = useState<number>(0)
  const [renderCount, setRenderCount] = useState<number>(0)

  useEffect(() => {
    startTimeRef.current = performance.now()
    setRenderCount(prev => prev + 1)
  })

  useEffect(() => {
    const endTime = performance.now()
    const duration = endTime - startTimeRef.current
    setRenderTime(duration)

    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`${componentName} render took ${duration.toFixed(2)}ms (>16ms)`)
    }
  })

  return {
    renderTime,
    renderCount,
    componentName,
  }
}

export default usePerformanceMonitor