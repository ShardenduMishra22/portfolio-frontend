'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NotFound() {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setCanGoBack(window.history.length > 1)
    setMounted(true)
  }, [])

  const handleGoBack = () => {
    if (canGoBack) {
      router.back()
    } else {
      router.push('/')
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      
      {/* Floating background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* 404 Header with enhanced animations */}
          <div className={`space-y-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-9xl md:text-[12rem] font-bold text-primary animate-blast relative">
              404
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-primary/20 blur-sm -z-10">
                404
              </div>
            </h1>
            <h2 className="text-3xl md:text-4xl font-heading text-foreground tracking-tight">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-foreground font-body max-w-md mx-auto leading-relaxed">
              The page you&apos;re looking for seems to have vanished into the digital void.
            </p>
          </div>

          {/* Enhanced illustration with hover effects */}
          <div className={`flex justify-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative group">
              <div className="w-36 h-36 bg-gradient-to-br from-primary via-secondary to-accent rounded-full flex items-center justify-center shadow-2xl shadow-primary/20 hover:shadow-3xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                <svg 
                  className="w-20 h-20 text-primary-foreground group-hover:scale-110 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              {/* Subtle pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={handleGoBack}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>{canGoBack ? 'Go Back' : 'Go Home'}</span>
              </div>
            </button>
            
            <button
              onClick={handleGoHome}
              className="group relative px-8 py-4 bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground rounded-xl font-medium shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </div>
            </button>
          </div>

          {/* Additional help section with enhanced styling */}
          <div className={`text-sm text-foreground space-y-3 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent" />
              <span className="text-xs uppercase tracking-wider">Need Help?</span>
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-muted-foreground/50 to-transparent" />
            </div>
            <p className="max-w-sm mx-auto">
              Try double-checking the URL or use the navigation above to get back on track.
            </p>
          </div>

          {/* Subtle footer */}
          <div className={`text-xs text-foreground/70 transition-all duration-1000 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p>Lost? Contact support if you believe this is an error.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
