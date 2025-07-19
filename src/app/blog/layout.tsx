"use client"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { JSX, ReactNode, useEffect, useState } from "react"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession()
        if (session.data !== null) {
          router.push("/blog/dashboard")
        } else {
          router.push("/blog")
        }
      } catch (error) {
        console.error("Session check error:", error)
        router.push("/blog")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
