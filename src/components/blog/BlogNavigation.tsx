'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, BarChart3, Plus, LogOut, Menu, X, Glasses } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/authClient'

const navigationItems = [
  {
    name: 'Read Blogs',
    href: '/blog',
    icon: Glasses,
    description: 'Read the latest blog posts'
  },
  {
    name: 'Dashboard',
    href: '/blog/dashboard',
    icon: BookOpen,
    description: 'Manage your blog posts'
  },
  {
    name: 'Analytics',
    href: '/blog/stats',
    icon: BarChart3,
    description: 'View blog statistics'
  },
  {
    name: 'Create Post',
    href: '/blog/create',
    icon: Plus,
    description: 'Write a new blog post'
  }
]

export default function BlogNavigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const session = authClient.useSession()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      router.push('/blog')
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/90 backdrop-blur-sm border border-border hover:bg-accent/20 text-black dark:text-white"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4 text-black dark:text-white" /> : <Menu className="h-4 w-4 text-black dark:text-white" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col justify-center items-center h-full space-y-4 p-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 w-full max-w-xs p-4 rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-foreground"
                      : "bg-card hover:bg-accent/20 border border-border"
                  )}
                >
                  <item.icon className="h-5 w-5 text-black dark:text-white" />
                  <div>
                    <div className="font-medium text-black dark:text-white">{item.name}</div>
                    <div className="text-xs text-black dark:text-white">{item.description}</div>
                  </div>
                </Link>
              )
            })}
            
            {session.data ? (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full max-w-xs border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button 
                onClick={async () => {
                  try {
                    await authClient.signIn.social({ provider: 'google' })
                    // After successful login, redirect to /blog
                    router.push('/blog')
                  } catch (error) {
                    console.error('Login error:', error)
                  }
                }} 
                className="w-full max-w-xs"
              >
                Login with Google
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-background border-r border-border">
          
          {/* Header */}
          <div className="flex items-center p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg font-heading">Blog Hub</h1>
                <p className="text-sm text-muted-foreground">Share your thoughts</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary text-foreground"
                      : "text-black dark:text-white hover:bg-accent/20"
                  )}
                >
                  <item.icon className="h-4 w-4 text-black dark:text-white" />
                  <div>
                    <div className="font-medium text-sm text-black dark:text-white">{item.name}</div>
                    <div className="text-xs text-black dark:text-white">{item.description}</div>
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            {session.data ? (
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <div className="text-center space-y-3">
                <p className="text-sm text-black dark:text-white">Please log in to continue</p>
                <Button 
                  onClick={async () => {
                    try {
                      await authClient.signIn.social({ provider: 'google' })
                      // After successful login, redirect to /blog
                      router.push('/blog')
                    } catch (error) {
                      console.error('Login error:', error)
                    }
                  }} 
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
