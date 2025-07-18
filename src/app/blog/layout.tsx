"use client"

import { authClient } from "@/lib/authClient"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

export const metadata = {
  title: "Blog | Mishra Shardendu",
  description: "Explore insights and thoughts by Mishra Shardendu on tech, development, and more.",
  openGraph: {
    title: "Blog | Mishra Shardendu",
    description: "Explore insights and thoughts by Mishra Shardendu on tech, development, and more.",
    url: "https://mishrashardendu22.is-a.dev/blog",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Mishra Shardendu",
    description: "Explore insights and thoughts by Mishra Shardendu on tech, development, and more.",
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession()
      if (session) {
        router.push("/blog/landing")
      }
    }
    checkSession()
  }, [router])

  return <>{children}</>
}
