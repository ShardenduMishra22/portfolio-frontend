'use client'

import toast from 'react-hot-toast'
import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import Error from '@/components/extra/Error'
import { navItems } from '@/data/static_link'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import Education from '@/components/main/education'
import { skillsAPI } from '@/util/apiResponse.util'
import ContactSection from '@/components/main/contact'
import { SkillsSkeleton } from '@/components/main/loading'
import { DesktopSidebar } from '@/components/extra/sidebar'
import FooterSection from '@/components/main/FooterSection'
import { MobileNavigation } from '@/components/extra/mobile-nav'
import { 
  DynamicShootingStars, 
  DynamicStarsBackground,
  DynamicProjectsSection,
  DynamicExperienceSection,
  DynamicCertificationsSection
} from '@/lib/dynamic-imports'

// Performance detection hook
const usePerformanceMode = () => {
  const [isLowPerformance, setIsLowPerformance] = useState(false)

  useEffect(() => {
    // Check for low-end devices or reduced motion preference
    const checkPerformance = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const isMobile = window.innerWidth < 768
      const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4
      const hasSlowConnection = (navigator as any).connection && 
        ((navigator as any).connection.effectiveType === 'slow-2g' || 
         (navigator as any).connection.effectiveType === '2g' ||
         (navigator as any).connection.effectiveType === '3g')

      setIsLowPerformance(prefersReducedMotion || (isMobile && (hasLowMemory || hasSlowConnection)))
    }

    checkPerformance()
    window.addEventListener('resize', checkPerformance)
    return () => window.removeEventListener('resize', checkPerformance)
  }, [])

  return isLowPerformance
}

// Throttled scroll handler
const useThrottledScroll = (callback: () => void, delay: number = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const lastRun = useRef<number>(0)

  return useCallback(() => {
    const now = Date.now()
    
    if (lastRun.current && now - lastRun.current < delay) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        lastRun.current = now
        callback()
      }, delay - (now - lastRun.current))
    } else {
      lastRun.current = now
      callback()
    }
  }, [callback, delay])
}

export default function HomePage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState({
    skills: true,
  })
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('hero')
  const isLowPerformance = usePerformanceMode()

  // Memoized sections for better performance
  const sections = useMemo(() => navItems.map((item) => item.href.substring(1)), [])

  // Optimized scroll handler
  const handleScroll = useCallback(() => {
    const currentSection = sections.find((section) => {
      const element = document.getElementById(section)
      if (element) {
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      }
      return false
    })

    if (currentSection && currentSection !== activeSection) {
      setActiveSection(currentSection)
    }
  }, [sections, activeSection])

  const throttledScrollHandler = useThrottledScroll(handleScroll, 100)

  useEffect(() => {
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    return () => window.removeEventListener('scroll', throttledScrollHandler)
  }, [throttledScrollHandler])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Only fetch skills immediately since they're needed early
        const skillsRes = await skillsAPI.getSkills()
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setLoading((prev) => ({ ...prev, skills: false }))

        toast.success('Initial data loaded!')
      } catch (err) {
        setError('Failed to load initial data')
        toast.error('Failed to load initial data')
        setLoading({ skills: false })
      }
    }

    fetchInitialData()
  }, [])

  if (error) {
    return (
      <Error
        error={error}
        onRetry={() => location.reload()}
        showActions={true}
        title="Failed to load homepage"
      />
    )
  }

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <DesktopSidebar activeSection={activeSection} />
      <MobileNavigation activeSection={activeSection} />

      <div className="md:pl-20 transition-all duration-500 ease-out">
        <section id="hero" className="relative">
          <HeroSection />
          <DynamicShootingStars 
            enabled={!isLowPerformance}
            maxStars={isLowPerformance ? 1 : 3}
            minDelay={isLowPerformance ? 4000 : 2000}
            maxDelay={isLowPerformance ? 8000 : 4000}
          />
        </section>

        {/* Education renders immediately since it's static data */}
        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          <Education />
          <DynamicShootingStars 
            enabled={!isLowPerformance}
            maxStars={isLowPerformance ? 1 : 2}
            minDelay={isLowPerformance ? 5000 : 3000}
            maxDelay={isLowPerformance ? 10000 : 6000}
          />
        </section>

        <section id="skills" className="scroll-mt-20 relative">
          {loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={skills} />}
        </section>

        {/* Lazy loaded sections */}
        <section id="projects">
          <DynamicProjectsSection />
        </section>

        <section id="experience">
          <DynamicExperienceSection />
        </section>

        <section id="certifications">
          <DynamicCertificationsSection />
        </section>

        <section id="contact" className="scroll-mt-20 relative">
          <ContactSection />
          <DynamicStarsBackground 
            enabled={!isLowPerformance}
            maxStars={isLowPerformance ? 20 : 50}
            starDensity={isLowPerformance ? 0.00004 : 0.00008}
            allStarsTwinkle={false}
            twinkleProbability={isLowPerformance ? 0.1 : 0.3}
          />
        </section>

        <section>
          <FooterSection />
        </section>
      </div>
    </div>
  )
}
