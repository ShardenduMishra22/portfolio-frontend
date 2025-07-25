'use client'
import { JSX, ReactNode } from 'react'
import BlogNavigation from '@/components/blog/BlogNavigation'

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <BlogNavigation />
      <div className="lg:pl-64">
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
