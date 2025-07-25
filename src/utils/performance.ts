import React, { useCallback, useEffect, useRef, useState } from 'react'

// Advanced debounce with cancel and immediate execution options
export function useAdvancedDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    immediate?: boolean // Execute immediately on first call
    maxWait?: number // Maximum time to wait before forcing execution
    leading?: boolean // Execute on leading edge
    trailing?: boolean // Execute on trailing edge (default)
  } = {}
): [T, () => void, () => void] {
  const {
    immediate = false,
    maxWait,
    leading = false,
    trailing = true,
  } = options

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastCallTimeRef = useRef<number>(0)
  const lastInvokeTimeRef = useRef<number>(0)
  const immediateRef = useRef<boolean>(immediate)

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (maxTimeoutRef.current) {
      clearTimeout(maxTimeoutRef.current)
      maxTimeoutRef.current = null
    }
  }, [])

  const flush = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      if (trailing) {
        const result = callback()
        lastInvokeTimeRef.current = Date.now()
        return result
      }
    }
  }, [callback, trailing])

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const since = now - lastCallTimeRef.current
      
      lastCallTimeRef.current = now

      const invokeCallback = () => {
        lastInvokeTimeRef.current = now
        return callback(...args)
      }

      // Leading edge execution
      if (leading && since >= delay) {
        return invokeCallback()
      }

      // Immediate execution (only on first call)
      if (immediateRef.current) {
        immediateRef.current = false
        return invokeCallback()
      }

      // Cancel previous timeout
      cancel()

      // Set up trailing execution
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          invokeCallback()
        }, delay)
      }

      // Set up max wait timeout
      if (maxWait && !maxTimeoutRef.current) {
        maxTimeoutRef.current = setTimeout(() => {
          if (trailing) {
            invokeCallback()
          }
          cancel()
        }, maxWait)
      }
    },
    [callback, delay, leading, trailing, cancel]
  ) as T

  useEffect(() => {
    return cancel
  }, [cancel])

  return [debouncedCallback, cancel, flush]
}

// Advanced throttle with precise timing control
export function useAdvancedThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  options: {
    leading?: boolean
    trailing?: boolean
  } = {}
): [T, () => void] {
  const { leading = true, trailing = true } = options
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousRef = useRef<number>(0)
  const resultRef = useRef<any>(undefined)

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      
      if (!previousRef.current && !leading) {
        previousRef.current = now
      }

      const remaining = delay - (now - previousRef.current)

      if (remaining <= 0 || remaining > delay) {
        cancel()
        previousRef.current = now
        resultRef.current = callback(...args)
      } else if (!timeoutRef.current && trailing) {
        timeoutRef.current = setTimeout(() => {
          previousRef.current = leading ? 0 : Date.now()
          timeoutRef.current = null
          resultRef.current = callback(...args)
        }, remaining)
      }

      return resultRef.current
    },
    [callback, delay, leading, trailing, cancel]
  ) as T

  useEffect(() => {
    return cancel
  }, [cancel])

  return [throttledCallback, cancel]
}

// Request Animation Frame throttling for smooth animations
export function useRAFThrottle<T extends (...args: any[]) => any>(
  callback: T
): [T, () => void] {
  const rafRef = useRef<number | null>(null)
  const argsRef = useRef<Parameters<T> | null>(null)

  const cancel = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      argsRef.current = args
      
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (argsRef.current) {
            callback(...argsRef.current)
          }
          rafRef.current = null
          argsRef.current = null
        })
      }
    },
    [callback]
  ) as T

  useEffect(() => {
    return cancel
  }, [cancel])

  return [throttledCallback, cancel]
}

// Idle callback for non-critical tasks
export function useIdleCallback(
  callback: () => void,
  options: {
    timeout?: number
  } = {}
) {
  const { timeout = 5000 } = options
  const callbackRef = useRef(callback)
  const idleRef = useRef<number | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const scheduleIdle = useCallback(() => {
    if (idleRef.current) {
      return
    }

    if ('requestIdleCallback' in window) {
      idleRef.current = requestIdleCallback(
        () => {
          callbackRef.current()
          idleRef.current = null
        },
        { timeout }
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      idleRef.current = setTimeout(() => {
        callbackRef.current()
        idleRef.current = null
      }, 0) as any
    }
  }, [timeout])

  const cancel = useCallback(() => {
    if (idleRef.current) {
      if ('cancelIdleCallback' in window) {
        cancelIdleCallback(idleRef.current)
      } else {
        clearTimeout(idleRef.current)
      }
      idleRef.current = null
    }
  }, [])

  useEffect(() => {
    return cancel
  }, [cancel])

  return { scheduleIdle, cancel }
}

// Batched state updates for performance
export function useBatchedUpdates<T>() {
  const [state, setState] = useState<T[]>([])
  const batchRef = useRef<T[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const addToBatch = useCallback((item: T) => {
    batchRef.current.push(item)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setState(prev => [...prev, ...batchRef.current])
      batchRef.current = []
      timeoutRef.current = null
    }, 0)
  }, [])

  const flushBatch = useCallback(() => {
    if (batchRef.current.length > 0) {
      setState(prev => [...prev, ...batchRef.current])
      batchRef.current = []
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const clearBatch = useCallback(() => {
    batchRef.current = []
    setState([])
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    state,
    addToBatch,
    flushBatch,
    clearBatch,
    batchSize: batchRef.current.length,
  }
}

// Memory-efficient list virtualization
export function useVirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index,
    offsetTop: (startIndex + index) * itemHeight,
  }))

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }, [])

  return {
    totalHeight,
    visibleItems,
    startIndex,
    endIndex,
    handleScroll,
  }
}

// Performance-optimized search with highlighting
export function useOptimizedSearch<T>(
  items: T[],
  searchKey: keyof T,
  options: {
    minSearchLength?: number
    highlightClassName?: string
    caseSensitive?: boolean
  } = {}
) {
  const {
    minSearchLength = 2,
    highlightClassName = 'highlight',
    caseSensitive = false,
  } = options

  const [searchTerm, setSearchTerm] = useState('')
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  const debouncedSearch = useAdvancedDebounce(
    (term: string) => {
      if (term.length < minSearchLength) {
        setFilteredItems(items)
        return
      }

      const searchValue = caseSensitive ? term : term.toLowerCase()
      const filtered = items.filter(item => {
        const itemValue = String(item[searchKey])
        const compareValue = caseSensitive ? itemValue : itemValue.toLowerCase()
        return compareValue.includes(searchValue)
      })

      setFilteredItems(filtered)
    },
    300,
    { trailing: true }
  )[0]

  useEffect(() => {
    debouncedSearch(searchTerm)
  }, [searchTerm, debouncedSearch])

  const highlightText = useCallback(
    (text: string): string | Array<{text: string, isHighlight: boolean, key: number}> => {
      if (!searchTerm || searchTerm.length < minSearchLength) {
        return text
      }

      const searchValue = caseSensitive ? searchTerm : searchTerm.toLowerCase()
      const textValue = caseSensitive ? text : text.toLowerCase()
      
      if (!textValue.includes(searchValue)) {
        return text
      }

      // Return array of parts for highlighting (to be handled by the component)
      const parts = text.split(new RegExp(`(${searchTerm})`, caseSensitive ? 'g' : 'gi'))
      
      return parts.map((part, index) => {
        const isMatch = caseSensitive 
          ? part === searchTerm 
          : part.toLowerCase() === searchValue
        
        return {
          text: part,
          isHighlight: isMatch,
          key: index
        }
      })
    },
    [searchTerm, minSearchLength, caseSensitive, highlightClassName]
  )

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    highlightText,
    resultsCount: filteredItems.length,
  }
}

// Export utility functions for direct use
export const createDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = false
) => {
  let timeoutId: NodeJS.Timeout | null = null
  let result: ReturnType<T>

  const debounced = (...args: Parameters<T>): ReturnType<T> => {
    const callNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      if (!immediate) {
        result = func(...args)
      }
    }, delay)

    if (callNow) {
      result = func(...args)
    }

    return result
  }

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debounced
}

export const createThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let lastCall = 0
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>): ReturnType<T> | void => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      return func(...args)
    }

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        return func(...args)
      }, delay - (now - lastCall))
    }
  }
}

export default {
  useAdvancedDebounce,
  useAdvancedThrottle,
  useRAFThrottle,
  useIdleCallback,
  useBatchedUpdates,
  useVirtualList,
  useOptimizedSearch,
  createDebounce,
  createThrottle,
}