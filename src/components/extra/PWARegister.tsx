'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          })

          console.log('Service Worker registered with scope:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  if (window.confirm('New content available! Reload to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })

          // Listen for service worker messages
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SKIP_WAITING') {
              window.location.reload()
            }
          })

        } catch (error) {
          console.error('Service Worker registration failed:', error)
        }
      }

      registerSW()

      // Listen for app updates
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    }
  }, [])

  useEffect(() => {
    // Check if app was launched from PWA
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      if (isStandalone) {
        console.log('App launched as PWA')
        // Add any PWA-specific analytics or behavior here
      }

      // Handle install prompt
      let deferredPrompt: any = null

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt = e
        
        // Show custom install button or banner
        console.log('PWA install prompt available')
        
        // You can trigger the prompt later with:
        // deferredPrompt.prompt()
      })

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed')
        deferredPrompt = null
        // Track install event
      })
    }
  }, [])

  return null // This component doesn't render anything
}
