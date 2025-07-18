"use client"
import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { JSX, ReactNode, useEffect } from "react"

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  const router = useRouter()
  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()
      if (session) {
        router.push("/blog/landing")
      }else {
        router.push("/blog")
      }
    }
    checkSession()
  }, [router])

  return <>{children}</>
}
