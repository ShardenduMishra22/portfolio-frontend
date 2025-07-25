import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { Analytics } from "@vercel/analytics/next"
import { Fredoka, Poppins, Inter } from 'next/font/google'
import { SpeedInsights } from "@vercel/speed-insights/next"
import ThemeToggleClient from '@/components/ThemeToggleClient'
import { Suspense } from 'react'

// Optimized font loading with performance enhancements
const fredoka = Fredoka({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
})

const poppins = Poppins({
  variable: '--font-subheading',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
})

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
})

// Enhanced metadata with performance considerations
export const metadata: Metadata = {
  title: {
    template: '%s | Shardendu Mishra',
    default: 'Shardendu Mishra | Software Developer and Engineer',
  },
  description: 'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
  keywords: ['Shardendu Mishra', 'Software Developer and Engineer', 'Go', 'React', 'Portfolio', 'Software Engineer', 'NextJS', 'TypeScript', 'Cloud Native'],
  authors: [{ name: 'Shardendu Mishra', url: 'https://github.com/ShardenduMishra22' }],
  creator: 'Shardendu Mishra',
  publisher: 'Shardendu Mishra',
  category: 'Portfolio',
  classification: 'Portfolio Website',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mishrashardendu22.is-a.dev',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description: 'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    siteName: 'Shardendu Mishra Portfolio',
    images: [
      {
        url: '/Professional.webp',
        width: 1200,
        height: 630,
        alt: 'Shardendu Mishra - Software Developer and Engineer',
        type: 'image/webp',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description: 'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    images: ['/Professional.webp'],
    creator: '@ShardenduMishra',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://mishrashardendu22.is-a.dev',
  },
  // Performance optimizations
  other: {
    'theme-color': '#00c896',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Shardendu Mishra',
    'application-name': 'Shardendu Mishra Portfolio',
    'msapplication-TileColor': '#00c896',
    'msapplication-config': '/browserconfig.xml',
  },
}

// Performance-optimized theme toggle wrapper
function OptimizedThemeToggle() {
  return (
    <Suspense fallback={
      <div className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 shadow-lg w-12 h-12 animate-pulse" />
    }>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggleClient />
      </div>
    </Suspense>
  )
}

// Performance-optimized analytics wrapper
function OptimizedAnalytics() {
  return (
    <Suspense fallback={null}>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vercel.live" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Performance hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Critical CSS inlining hint */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for immediate render */
            .loading-placeholder {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              background-size: 200% 100%;
              animation: shimmer 2s linear infinite;
            }
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `
        }} />
      </head>
      <body className={`${fredoka.variable} ${poppins.variable} ${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="shardendu-theme"
          themes={['light', 'dark', 'system']}
        >
          <div className="min-h-screen bg-background text-foreground main-content">
            <OptimizedThemeToggle />
            
            {/* Main content with error boundary */}
            <main className="relative">
              {children}
            </main>
            
            {/* Toast notifications */}
            <Toaster 
              position="top-right" 
              reverseOrder 
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                },
                success: {
                  iconTheme: {
                    primary: 'var(--primary)',
                    secondary: 'var(--primary-foreground)',
                  },
                },
                error: {
                  iconTheme: {
                    primary: 'var(--destructive)',
                    secondary: 'var(--destructive-foreground)',
                  },
                },
              }}
            />
            
            {/* Analytics - loaded asynchronously */}
            <OptimizedAnalytics />
          </div>
        </ThemeProvider>
        
        {/* Preload critical scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Preload critical resources
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                  // Preload next page
                  const link = document.createElement('link');
                  link.rel = 'prefetch';
                  link.href = '/projects';
                  document.head.appendChild(link);
                  
                  // Warm up service worker if available
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                  }
                });
              }
              
              // Performance monitoring
              if (typeof window !== 'undefined' && window.performance) {
                window.addEventListener('load', () => {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && process.env.NODE_ENV === 'development') {
                      console.log('Page Load Performance:', {
                        DNS: perfData.domainLookupEnd - perfData.domainLookupStart,
                        TCP: perfData.connectEnd - perfData.connectStart,
                        Request: perfData.responseStart - perfData.requestStart,
                        Response: perfData.responseEnd - perfData.responseStart,
                        DOM: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        Total: perfData.loadEventEnd - perfData.navigationStart
                      });
                    }
                  }, 100);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  )
}