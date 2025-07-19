'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  BookOpen, 
  BarChart3, 
  Plus, 
  Home,
  User,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/authClient'
import { useState } from 'react'

const navigationItems = [
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

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background/80 backdrop-blur-sm border border-border/50"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 p-6">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 w-full max-w-sm p-4 rounded-xl transition-all duration-300",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:shadow-lg"
                    )}
                  >
                    <item.icon className={cn(
                      "h-6 w-6 transition-colors",
                      isActive ? "text-primary-foreground" : "text-primary"
                    )} />
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{item.name}</div>
                      <div className={cn(
                        "text-sm transition-colors",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
              
              {/* Logout button */}
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="outline"
                className="w-full max-w-sm border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {isLoggingOut ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                ) : (
                  <LogOut className="h-4 w-4 mr-2" />
                )}
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navigation Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-white dark:border-slate-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className="font-bold text-2xl text-slate-900 dark:text-white bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Blog Hub</h1>
                <p className="text-base text-slate-600 dark:text-slate-400 mt-1">Content Management</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-6 py-8 space-y-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center space-x-4 px-6 py-5 rounded-2xl transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-lg hover:scale-105"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                  )}
                  
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                    isActive 
                      ? "bg-white/20 text-white shadow-lg" 
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:shadow-md"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-base truncate">{item.name}</div>
                    <div className={cn(
                      "text-sm truncate transition-colors",
                      isActive 
                        ? "text-white/80" 
                        : "text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                    )}>
                      {item.description}
                    </div>
                  </div>
                  
                  {isActive && (
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              className="w-full h-14 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 rounded-xl font-semibold shadow-sm hover:shadow-md"
            >
              {isLoggingOut ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3" />
              ) : (
                <LogOut className="h-5 w-5 mr-3" />
              )}
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content wrapper for desktop */}
      <div className="hidden lg:block lg:pl-72">
        <div className="min-h-screen">
          {/* This div will be replaced by the actual content */}
        </div>
      </div>
    </>
  )
} 