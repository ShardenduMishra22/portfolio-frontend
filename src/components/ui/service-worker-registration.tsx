'use client'
import { useEffect } from 'react'

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          })

          if (registration.installing) {
            console.log('Service worker installing')
          } else if (registration.waiting) {
            console.log('Service worker installed')
          } else if (registration.active) {
            console.log('Service worker active')
          }

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  console.log('New content is available')
                }
              })
            }
          })

          // Handle service worker updates
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service worker updated')
            // Optionally reload the page to get the latest version
            // window.location.reload()
          })

        } catch (error) {
          console.error('Service worker registration failed:', error)
        }
      }

      registerSW()
    }
  }, [])

  return null
}

export default ServiceWorkerRegistration