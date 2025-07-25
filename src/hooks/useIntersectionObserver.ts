import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  freezeOnceVisible?: boolean
  initialIsIntersecting?: boolean
  unobserveOnIntersect?: boolean
}

interface IntersectionObserverEntry {
  isIntersecting: boolean
  intersectionRatio: number
  target: Element
  time: number
  boundingClientRect: DOMRectReadOnly
  intersectionRect: DOMRectReadOnly
  rootBounds: DOMRectReadOnly | null
}

export function useIntersectionObserver<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0.1,
    freezeOnceVisible = false,
    initialIsIntersecting = false,
    unobserveOnIntersect = false,
  } = options

  const elementRef = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting)
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const frozenRef = useRef(false)

  const cleanupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  const updateEntry = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      // Don't update if frozen and already visible
      if (frozenRef.current && freezeOnceVisible) {
        return
      }

      const isIntersecting = entry.isIntersecting
      setIsIntersecting(isIntersecting)
      setEntry(entry)

      // Freeze if configured and element is visible
      if (freezeOnceVisible && isIntersecting) {
        frozenRef.current = true
      }

      // Unobserve if configured and element is intersecting
      if (unobserveOnIntersect && isIntersecting && observerRef.current && elementRef.current) {
        observerRef.current.unobserve(elementRef.current)
      }
    },
    [freezeOnceVisible, unobserveOnIntersect]
  )

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    // Check if browser supports IntersectionObserver
    if (!window.IntersectionObserver) {
      console.warn('IntersectionObserver not supported, falling back to visible state')
      setIsIntersecting(true)
      return
    }

    // Don't create observer if already frozen
    if (frozenRef.current && freezeOnceVisible) {
      return
    }

    // Create observer
    observerRef.current = new IntersectionObserver(updateEntry, {
      root,
      rootMargin,
      threshold,
    })

    observerRef.current.observe(element)

    // Cleanup function
    return () => {
      cleanupObserver()
    }
  }, [root, rootMargin, threshold, updateEntry, cleanupObserver, freezeOnceVisible])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupObserver()
    }
  }, [cleanupObserver])

  return {
    ref: elementRef,
    isIntersecting,
    entry,
    reset: () => {
      frozenRef.current = false
      setIsIntersecting(initialIsIntersecting)
      setEntry(null)
    },
  }
}

// Hook for lazy loading components when they come into view
export function useLazyLoad<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
) {
  return useIntersectionObserver<T>({
    rootMargin: '50px', // Start loading 50px before element is visible
    threshold: 0,
    freezeOnceVisible: true,
    unobserveOnIntersect: true,
    ...options,
  })
}

// Hook for triggering animations when elements come into view
export function useInViewAnimation<T extends Element = Element>(
  options: UseIntersectionObserverOptions = {}
) {
  return useIntersectionObserver<T>({
    rootMargin: '0px',
    threshold: 0.3, // Trigger when 30% visible
    freezeOnceVisible: true,
    ...options,
  })
}

// Hook for infinite scrolling
export function useInfiniteScroll<T extends Element = Element>(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const { ref, isIntersecting } = useIntersectionObserver<T>({
    rootMargin: '100px', // Trigger 100px before reaching the element
    threshold: 0,
    ...options,
  })

  useEffect(() => {
    if (isIntersecting) {
      callback()
    }
  }, [isIntersecting, callback])

  return ref
}

// Hook for performance monitoring - tracks how long elements are visible
export function useVisibilityDuration<T extends Element = Element>(
  onDurationChange?: (duration: number) => void
) {
  const startTimeRef = useRef<number | null>(null)
  const [totalDuration, setTotalDuration] = useState(0)

  const { ref, isIntersecting } = useIntersectionObserver<T>({
    threshold: 0.5, // Element must be 50% visible
  })

  useEffect(() => {
    if (isIntersecting && !startTimeRef.current) {
      // Element became visible
      startTimeRef.current = performance.now()
    } else if (!isIntersecting && startTimeRef.current) {
      // Element became hidden
      const duration = performance.now() - startTimeRef.current
      setTotalDuration(prev => prev + duration)
      onDurationChange?.(duration)
      startTimeRef.current = null
    }
  }, [isIntersecting, onDurationChange])

  return {
    ref,
    isIntersecting,
    totalDuration,
    reset: () => {
      startTimeRef.current = null
      setTotalDuration(0)
    },
  }
}

export default useIntersectionObserver