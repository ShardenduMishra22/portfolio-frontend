'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/use-auth'
import { Button } from '../../components/ui/button'
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  User,
  Award,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/admin/projects', icon: Briefcase },
  { name: 'Experiences', href: '/admin/experiences', icon: GraduationCap },
  { name: 'Skills', href: '/admin/skills', icon: Settings },
  { name: 'Certifications & Achievements', href: '/admin/certifications', icon: Award },
  { name: 'Profile', href: '/admin/profile', icon: User },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout, isAuthenticated, isLoading } = useAuth()

  type Profile = { email: string }
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState('')

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/admin/profile')
        if (!res.ok) throw new Error('Failed to load profile')
        const data = await res.json()
        setProfile(data)
      } catch {
        setError('Failed to load profile')
      }
    }
    fetchProfile()
  }, [])

  const isActive = (href: string) => pathname === href

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render admin layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Don't render admin layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-card/90 backdrop-blur-md border-b border-border px-4 sm:px-8 h-16 shadow-md">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-primary/20 transition"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <Link href="/admin/dashboard" className="font-heading font-bold text-xl text-primary select-none">
            Admin Panel
          </Link>
        </div>

        <nav className="hidden lg:flex gap-6 font-semibold">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive(href)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(href) ? 'text-primary-foreground' : 'text-foreground'}`} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="text-primary hover:bg-primary/20"
            onClick={logout}
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-card/90 backdrop-blur-md border-b border-border shadow-md flex flex-col px-4 py-2 gap-2">
          {navigation.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-150 ${
                isActive(href)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-foreground hover:bg-primary/10 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Icon className={`w-5 h-5 ${isActive(href) ? 'text-primary-foreground' : 'text-foreground'}`} />
              <span>{name}</span>
            </Link>
          ))}
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-17xl  p-6 sm:p-10">{children}</main>
    </div>
  )
}
