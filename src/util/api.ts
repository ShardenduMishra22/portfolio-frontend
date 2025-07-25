import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import http from 'http'
import https from 'https'

// Extend the AxiosRequestConfig interface to include metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      requestId: string
      startTime: number
    }
    cacheTTL?: number
    _retry?: boolean
    _retryCount?: number
  }
}

const isServer = typeof window === 'undefined'
const baseURL = isServer
  ? process.env.NEXT_PUBLIC_BASE_URL + '/api/proxy'
  : '/api/proxy'

// Enhanced cache implementation
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private readonly defaultTTL = 5 * 60 * 1000 // 5 minutes

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Request deduplication
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>()

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key)
    })

    this.pendingRequests.set(key, promise)
    return promise
  }
}

const cache = new APICache()
const deduplicator = new RequestDeduplicator()

// Cleanup cache every 10 minutes
if (!isServer) {
  setInterval(() => cache.cleanup(), 10 * 60 * 1000)
}

// Create axios instance with optimizations
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
  },
  // Enable compression
  decompress: true,
  // Enable keep-alive for better performance
  ...(isServer && {
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
  }),
})

// Enhanced request interceptor
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = !isServer ? localStorage.getItem('jwt_token') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request ID for tracking
    config.metadata = { 
      requestId: Math.random().toString(36).substring(7),
      startTime: Date.now()
    }

    // Add cache headers for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'public, max-age=300'
    }

    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Enhanced response interceptor with caching and retry logic
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as any
    
    // Log request timing in development
    if (process.env.NODE_ENV === 'development' && config.metadata) {
      const duration = Date.now() - config.metadata.startTime
      console.log(`API Request [${config.metadata.requestId}]: ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`)
    }

    // Cache GET requests
    if (config.method === 'get' && response.status === 200) {
      const cacheKey = `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`
      const ttl = config.cacheTTL || (5 * 60 * 1000) // 5 minutes default
      cache.set(cacheKey, response.data, ttl)
    }

    return response
  },
  async (error) => {
    const config = error.config as any

    // Handle authentication errors
    if (error.response?.status === 401) {
      if (!isServer) {
        localStorage.removeItem('jwt_token')
        const isAdminPage = window.location.pathname.startsWith('/admin') && 
                           window.location.pathname !== '/admin/login'
        if (isAdminPage) {
          window.location.href = '/'
        }
      }
    }

    // Retry logic for failed requests
    if (!config._retry && shouldRetry(error)) {
      config._retry = true
      config._retryCount = (config._retryCount || 0) + 1
      
      if (config._retryCount <= 3) {
        const delay = Math.min(1000 * Math.pow(2, config._retryCount - 1), 5000)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.warn(`Retrying request (${config._retryCount}/3):`, config.url)
        return api(config)
      }
    }

    // Enhanced error logging
    console.error('API Error:', {
      url: config?.url,
      method: config?.method,
      status: error.response?.status,
      message: error.message,
      requestId: config?.metadata?.requestId
    })

    return Promise.reject(error)
  }
)

// Helper function to determine if request should be retried
function shouldRetry(error: any): boolean {
  if (!error.response) return true // Network errors
  const status = error.response.status
  return status >= 500 || status === 408 || status === 429 // Server errors, timeout, rate limit
}

// Enhanced API wrapper with caching and deduplication
const enhancedAPI = {
  async get<T>(url: string, config?: AxiosRequestConfig & { cacheTTL?: number }): Promise<AxiosResponse<T>> {
    const cacheKey = `get:${url}:${JSON.stringify(config?.params || {})}`
    
    // Try cache first for GET requests
    const cachedData = cache.get(cacheKey)
    if (cachedData) {
      return {
        data: cachedData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config || {},
      } as AxiosResponse<T>
    }

    // Deduplicate identical requests
    return deduplicator.deduplicate(cacheKey, () => api.get<T>(url, config))
  },

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Clear related cache entries on mutations
    this.invalidateCache(url)
    return api.post<T>(url, data, config)
  },

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Clear related cache entries on mutations
    this.invalidateCache(url)
    return api.put<T>(url, data, config)
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Clear related cache entries on mutations
    this.invalidateCache(url)
    return api.delete<T>(url, config)
  },

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Clear related cache entries on mutations
    this.invalidateCache(url)
    return api.patch<T>(url, data, config)
  },

  // Cache management methods
  invalidateCache(pattern?: string) {
    if (!pattern) {
      cache.clear()
      return
    }

    // Remove cache entries that match the pattern
    const keysToDelete: string[] = []
    for (const [key] of (cache as any).cache.entries()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    }
    
    keysToDelete.forEach(key => cache.delete(key))
  },

  preloadData(url: string, config?: AxiosRequestConfig) {
    // Preload data in background without waiting
    this.get(url, config).catch(() => {
      // Silently handle preload errors
    })
  },

  // Batch requests for better performance
  async batch<T>(requests: Array<() => Promise<AxiosResponse<T>>>): Promise<AxiosResponse<T>[]> {
    const results = await Promise.allSettled(requests.map(req => req()))
    return results
      .filter((result): result is PromiseFulfilledResult<AxiosResponse<T>> => result.status === 'fulfilled')
      .map(result => result.value)
  }
}

export default enhancedAPI

// Export original axios instance for compatibility
export { api as rawAxios }