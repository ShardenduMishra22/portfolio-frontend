import { useEffect, useState } from "react"

export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
        ...options,
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, hasBeenVisible, options])

  return { isVisible, hasBeenVisible }
}