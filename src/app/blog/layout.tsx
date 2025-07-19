"use client"
import { authClient } from "@/lib/authClient"
import { useRouter, usePathname } from "next/navigation"
import { JSX, ReactNode, useEffect, useState } from "react"
import BlogNavigation from "@/components/blog/BlogNavigation"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Only redirect if we're on the exact /blog path, not sub-routes
        if (pathname === "/blog") {
          const session = await authClient.getSession()
          if (session.data !== null) {
            router.push("/blog/dashboard")
            return
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [router, pathname])

  if (isLoading && pathname === "/blog") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <BlogNavigation />
      <div className="lg:pl-72">
        {children}
      </div>
    </div>
  )
}
