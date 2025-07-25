'use client'

import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import Error from '@/components/Error'
import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Lazy load components for better performance
const HeroSection = dynamic(() => import('@/components/main/hero'), {
  loading: () => <div className="min-h-screen animate-pulse bg-gradient-to-br from-background via-background to-primary/5" />
})

const SkillsSection = dynamic(() => import('@/components/main/skill'), {
  loading: () => import('@/components/main/loading').then(mod => ({ default: mod.SkillsSkeleton }))
})

const Education = dynamic(() => import('@/components/main/education'), {
  loading: () => import('@/components/main/loading').then(mod => ({ default: mod.EducationSkeleton }))
})

const FooterSection = dynamic(() => import('@/components/main/footer'), {
  loading: () => <div className="min-h-[200px] animate-pulse bg-gradient-to-br from-card via-card/95 to-secondary/10" />
})

const ExperienceSection = dynamic(() => import('@/components/main/exp'), {
  loading: () => import('@/components/main/loading').then(mod => ({ default: mod.ExperienceSkeleton }))
})

const ContactSection = dynamic(() => import('@/components/main/contact'), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-background" />
})

const ProjectsSection = dynamic(() => import('@/components/main/project'), {
  loading: () => import('@/components/main/loading').then(mod => ({ default: mod.ProjectsSkeleton }))
})

const CertificationsSection = dynamic(() => import('@/components/main/certificate'), {
  loading: () => import('@/components/main/loading').then(mod => ({ default: mod.CertificationsSkeleton }))
})

// Lazy load background effects for better performance
const ShootingStars = dynamic(() => import('@/components/ui/shooting-stars').then(mod => ({ default: mod.ShootingStars })), {
  ssr: false,
  loading: () => null
})

const StarsBackground = dynamic(() => import('@/components/ui/stars-background').then(mod => ({ default: mod.StarsBackground })), {
  ssr: false,
  loading: () => null
})

import { Project, Experience, Certification } from '../data/types.data'
import { projectsAPI, experiencesAPI, skillsAPI, certificationsAPI } from '../util/apiResponse.util'

import { 
  SkillsSkeleton, 
  ProjectsSkeleton, 
  ExperienceSkeleton, 
  CertificationsSkeleton, 
  EducationSkeleton 
} from '@/components/main/loading'
import { NavLink } from '@/data/nav'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/data/sidebar'

// Memoized mobile navigation component
const MobileNavigation = memo(function MobileNavigation({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Optimized click outside handler with cleanup
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.mobile-nav')) {
        setIsOpen(false)
      }
    }

    // Use passive listeners for better performance
    const abortController = new AbortController()
    document.addEventListener('click', handleClickOutside, { 
      passive: true,
      signal: abortController.signal 
    })
    document.body.style.overflow = 'hidden'

    return () => {
      abortController.abort()
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Memoize navigation items to prevent re-renders
  const navigationItems = useMemo(() => 
    navItems.map((item, index) => (
      <div
        key={item.href}
        className="animate-in slide-in-from-right duration-300"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <NavLink
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={activeSection === item.href.substring(1)}
          isExpanded={true}
          isMobile={true}
          onClick={closeMobileMenu}
        />
      </div>
    )), [activeSection, closeMobileMenu]
  )

  return (
    <div className="md:hidden mobile-nav">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 right-4 z-50 p-3 rounded-xl transition-all duration-300",
          "bg-sidebar/95 backdrop-blur-xl border border-sidebar-border/50 shadow-lg",
          "hover:bg-sidebar-accent/20 hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        )}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-sidebar-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-sidebar-foreground" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 animate-in fade-in"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[85vw] z-40 transition-transform duration-300 ease-out",
        "bg-sidebar/95 backdrop-blur-xl border-l border-sidebar-border/50 shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-primary/10 via-transparent to-sidebar-accent/10 opacity-50 pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 pt-20 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/25">
                <Sparkles className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-sidebar animate-pulse" />
            </div>
            
            <div className="flex-1">
              <div className="text-lg font-bold text-sidebar-foreground mb-1">
                Shardendu Mishra
              </div>
              <div className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-blast">
                I Love Golang and Fedora
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigationItems}
        </nav>

        {/* Bottom decoration */}
        <div className="p-4 border-t border-sidebar-border/50">
          <div className="text-xs text-sidebar-foreground/70 text-center flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
            <span>Tap to navigate</span>
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
})

// Throttle function for scroll optimization
function useThrottledScrollHandler(callback: () => void, delay: number = 100) {
  const lastRun = useRef(Date.now())
  
  return useCallback(() => {
    if (Date.now() - lastRun.current >= delay) {
      callback()
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

// Custom hook for section intersection
function useActiveSection() {
  const [activeSection, setActiveSection] = useState('hero')
  
  const updateActiveSection = useCallback(() => {
    const sections = navItems.map(item => item.href.substring(1))
    const currentSection = sections.find(section => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      }
      return false
    })
    
    if (currentSection) {
      setActiveSection(currentSection)
    }
  }, [])

  const throttledUpdateActiveSection = useThrottledScrollHandler(updateActiveSection, 150)

  useEffect(() => {
    window.addEventListener('scroll', throttledUpdateActiveSection, { passive: true })
    return () => window.removeEventListener('scroll', throttledUpdateActiveSection)
  }, [throttledUpdateActiveSection])

  return activeSection
}

// Optimized data fetching hook
function useHomePageData() {
  const [data, setData] = useState({
    projects: [] as Project[],
    experiences: [] as Experience[],
    skills: [] as string[],
    certifications: [] as Certification[],
  })
  
  const [loading, setLoading] = useState({
    projects: true,
    experiences: true,
    skills: true,
    certifications: true,
    education: true
  })
  
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      // Use Promise.allSettled for better error handling
      const results = await Promise.allSettled([
        projectsAPI.getAllProjects(),
        experiencesAPI.getAllExperiences(),
        skillsAPI.getSkills(),
        certificationsAPI.getAllCertifications(),
      ])

      // Process results with individual error handling
      const [projectsRes, experiencesRes, skillsRes, certificationsRes] = results

      if (projectsRes.status === 'fulfilled') {
        setData(prev => ({ ...prev, projects: Array.isArray(projectsRes.value.data) ? projectsRes.value.data : [] }))
        setLoading(prev => ({ ...prev, projects: false }))
      }

      if (experiencesRes.status === 'fulfilled') {
        setData(prev => ({ ...prev, experiences: Array.isArray(experiencesRes.value.data) ? experiencesRes.value.data : [] }))
        setLoading(prev => ({ ...prev, experiences: false }))
      }

      if (skillsRes.status === 'fulfilled') {
        setData(prev => ({ ...prev, skills: Array.isArray(skillsRes.value.data) ? skillsRes.value.data : [] }))
        setLoading(prev => ({ ...prev, skills: false }))
      }

      if (certificationsRes.status === 'fulfilled') {
        setData(prev => ({ ...prev, certifications: Array.isArray(certificationsRes.value.data) ? certificationsRes.value.data : [] }))
        setLoading(prev => ({ ...prev, certifications: false }))
      }

      // Simulate education loading (assuming it's static)
      setTimeout(() => {
        setLoading(prev => ({ ...prev, education: false }))
      }, 1000)

      toast.success('Homepage data loaded!')
    } catch (err) {
      setError('Failed to load homepage data')
      toast.error('Failed to load homepage data')
      // Set all loading states to false on error
      setLoading({
        projects: false,
        experiences: false,
        skills: false,
        certifications: false,
        education: false
      })
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default function HomePage() {
  const activeSection = useActiveSection()
  const { data, loading, error, refetch } = useHomePageData()
  const router = useRouter()

  // Preload critical routes for better navigation performance
  useEffect(() => {
    router.prefetch('/projects')
    router.prefetch('/experiences')
    router.prefetch('/certifications')
  }, [router])

  // Memoize sections to prevent unnecessary re-renders
  const sections = useMemo(() => [
    {
      id: 'hero',
      component: <HeroSection />,
      className: 'relative',
      showStars: true
    },
    {
      id: 'education',
      component: loading.education ? <EducationSkeleton /> : <Education />,
      className: 'scroll-mt-20 relative',
      showGradient: true,
      showStars: true
    },
    {
      id: 'skills',
      component: loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={data.skills} />,
      className: 'scroll-mt-20 relative',
    },
    {
      id: 'projects',
      component: loading.projects ? <ProjectsSkeleton /> : <ProjectsSection projects={data.projects} />,
      className: 'scroll-mt-20 relative',
    },
    {
      id: 'experience',
      component: loading.experiences ? <ExperienceSkeleton /> : <ExperienceSection experiences={data.experiences} />,
      className: 'scroll-mt-20 relative bg-white dark:bg-black',
    },
    {
      id: 'certifications',
      component: loading.certifications ? <CertificationsSkeleton /> : <CertificationsSection certifications={data.certifications} />,
      className: 'scroll-mt-20 relative',
      showGradient: true
    },
    {
      id: 'contact',
      component: <ContactSection />,
      className: 'scroll-mt-20 relative',
      showStarsBackground: true
    }
  ], [loading, data])

  if (error) {
    return (
      <Error
        error={error}
        onRetry={refetch}
        showActions={true}
        title="Failed to load homepage"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Desktop Sidebar */}
      <DesktopSidebar activeSection={activeSection} />
      
      {/* Mobile Navigation */}
      <MobileNavigation activeSection={activeSection} />
      
      <div className="md:pl-20 transition-all duration-500 ease-out">
        {sections.map(({ id, component, className, showStars, showGradient, showStarsBackground }) => (
          <section key={id} id={id} className={className}>
            {showGradient && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
            )}
            {component}
            {showStars && <ShootingStars />}
            {showStarsBackground && <StarsBackground />}
          </section>
        ))}
        
        <section>
          <FooterSection />
        </section>
      </div>
    </div>
  )
}