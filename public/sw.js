const CACHE_NAME = 'shardendu-portfolio-v1'
const STATIC_CACHE = 'static-cache-v1'
const DYNAMIC_CACHE = 'dynamic-cache-v1'
const IMAGE_CACHE = 'image-cache-v1'

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/apple-touch-icon.png',
]

// Runtime caching strategies
const CACHE_STRATEGIES = {
  // Static assets - Cache First
  static: {
    cacheName: STATIC_CACHE,
    strategy: 'CacheFirst',
    maxEntries: 100,
    maxAgeSeconds: 31536000, // 1 year
  },
  // API calls - Network First with Cache Fallback
  api: {
    cacheName: DYNAMIC_CACHE,
    strategy: 'NetworkFirst',
    maxEntries: 50,
    maxAgeSeconds: 300, // 5 minutes
  },
  // Images - Cache First with Network Fallback
  images: {
    cacheName: IMAGE_CACHE,
    strategy: 'CacheFirst',
    maxEntries: 200,
    maxAgeSeconds: 2592000, // 30 days
  }
}

// Install event - Cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error)
      })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        const deletePromises = cacheNames
          .filter((cacheName) => {
            return cacheName !== STATIC_CACHE && 
                   cacheName !== DYNAMIC_CACHE && 
                   cacheName !== IMAGE_CACHE
          })
          .map((cacheName) => {
            console.log('Service Worker: Deleting old cache', cacheName)
            return caches.delete(cacheName)
          })
        
        return Promise.all(deletePromises)
      })
      .then(() => {
        console.log('Service Worker: Cache cleanup complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }
  
  // Apply caching strategy based on request type
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network First
    event.respondWith(networkFirst(request, CACHE_STRATEGIES.api))
  } else if (isImageRequest(request)) {
    // Image requests - Cache First
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.images))
  } else if (isStaticAsset(request)) {
    // Static assets - Cache First
    event.respondWith(cacheFirst(request, CACHE_STRATEGIES.static))
  } else {
    // HTML pages - Network First with Cache Fallback
    event.respondWith(networkFirst(request, CACHE_STRATEGIES.api))
  }
})

// Cache First Strategy
async function cacheFirst(request, options) {
  try {
    const cache = await caches.open(options.cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url)
      return cachedResponse
    }
    
    console.log('Service Worker: Fetching from network', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone()
      await cache.put(request, responseClone)
      await limitCacheSize(options.cacheName, options.maxEntries)
    }
    
    return networkResponse
  } catch (error) {
    console.error('Service Worker: Cache First failed', error)
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Network First Strategy
async function networkFirst(request, options) {
  try {
    console.log('Service Worker: Trying network first', request.url)
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(options.cacheName)
      const responseClone = networkResponse.clone()
      await cache.put(request, responseClone)
      await limitCacheSize(options.cacheName, options.maxEntries)
    }
    
    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url)
    const cache = await caches.open(options.cacheName)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      console.log('Service Worker: Serving stale content from cache')
      return cachedResponse
    }
    
    console.error('Service Worker: Network First failed completely', error)
    return new Response('Offline - Content not available', {
      status: 503,
      statusText: 'Service Unavailable'
    })
  }
}

// Helper: Check if request is for an image
function isImageRequest(request) {
  const url = new URL(request.url)
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg']
  return imageExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
         request.destination === 'image'
}

// Helper: Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url)
  const staticPaths = ['/_next/static/', '/static/', '/favicon.ico', '/manifest.json']
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot']
  
  return staticPaths.some(path => url.pathname.startsWith(path)) ||
         staticExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))
}

// Helper: Limit cache size
async function limitCacheSize(cacheName, maxEntries) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  
  if (keys.length > maxEntries) {
    console.log(`Service Worker: Cache ${cacheName} exceeds limit, cleaning up`)
    const keysToDelete = keys.slice(0, keys.length - maxEntries)
    await Promise.all(keysToDelete.map(key => cache.delete(key)))
  }
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered')
    event.waitUntil(
      // Implement background sync logic here
      Promise.resolve()
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received')
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'portfolio-update',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View Update'
      }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification('Shardendu Portfolio', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked')
  
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow('/')
  )
})

console.log('Service Worker: Script loaded successfully')