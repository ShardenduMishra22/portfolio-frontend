import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/next'
import { Fredoka, Poppins, Inter } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ThemeToggleClient from '@/components/extra/ThemeToggleClient'
import { PerformanceMonitor } from '@/components/ui/performance-monitor'
import ServiceWorkerRegistration from '@/components/ui/service-worker-registration'

const fredoka = Fredoka({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-subheading',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Shardendu Mishra',
    default: 'Shardendu Mishra | Software Developer and Engineer',
  },
  description:
    'Software Developer and Engineer passionate about building impactful applications with modern technologies. Specializing in Go, React, and cloud-native solutions.',
  keywords: [
    'Shardendu Mishra',
    'Software Developer and Engineer',
    'Go',
    'React',
    'Portfolio',
    'Software Engineer',
  ],
  authors: [{ name: 'Shardendu Mishra' }],
  creator: 'Shardendu Mishra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mishrashardendu22.is-a.dev',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shardendu Mishra - Software Developer and Engineer',
    description:
      'Software Developer and Engineer passionate about building impactful applications with modern technologies.',
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
  manifest: '/manifest.json',
  themeColor: '#00c896',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Shardendu Portfolio',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00c896" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Shardendu Portfolio" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#00c896" />
        <meta name="msapplication-TileColor" content="#00c896" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${fredoka.variable} ${poppins.variable} ${inter.variable} antialiased `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggleClient />
            </div>
            {children}
            <Toaster position="top-right" reverseOrder />
            <Analytics />
            <SpeedInsights />
            <PerformanceMonitor />
            <ServiceWorkerRegistration />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
