"use client"
import { AuthUser } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { JSX, ReactNode, useEffect } from "react"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter()
  useEffect(() => {
    const checkSession = async () => {
      if (AuthUser) {
        router.push("/blog/landing")
      }else {
        router.push("/blog")
      }
    }
    checkSession()
  }, [router])

  return <>{children}</>
}
