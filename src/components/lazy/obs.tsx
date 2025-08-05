import { useEffect, useState, useRef, useCallback, useMemo } from 'react'

interface IntersectionObserverOptions extends IntersectionObserverInit {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | null
}

export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverOptions = {}
) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const defaultOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '100px',
    ...options,
  }), [options])

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    const isIntersecting = entry.isIntersecting
    
    setIsVisible(isIntersecting)
    
    if (isIntersecting && !hasBeenVisible) {
      setHasBeenVisible(true)
    }
  }, [hasBeenVisible])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersection, defaultOptions)
    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [ref, handleIntersection, defaultOptions])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [])

  return { isVisible, hasBeenVisible }
}
