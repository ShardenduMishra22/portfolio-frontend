'use client'

import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
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
import { LazyProjectsSection } from '@/components/lazy/proj'
import { LazyExperienceSection } from '@/components/lazy/exp'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { MobileNavigation } from '@/components/extra/mobile-nav'
import { LazyCertificationsSection } from '@/components/lazy/cert'
import { StarsBackground } from '@/components/ui/stars-background'

export default function HomePage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState({
    skills: true,
  })
  const [error, setError] = useState('')
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = navItems.map((item) => item.href.substring(1))
      const currentSection = sections.find((section) => {
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
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <ShootingStars />
        </section>

        {/* Education renders immediately since it's static data */}
        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          <Education />
          <ShootingStars />
        </section>

        <section id="skills" className="scroll-mt-20 relative">
          {loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={skills} />}
        </section>

        {/* Lazy loaded sections */}
        <section id="projects">
          <LazyProjectsSection />
        </section>

        <section id="experience">
          <LazyExperienceSection />
        </section>

        <section id="certifications">
          <LazyCertificationsSection />
        </section>

        <section id="contact" className="scroll-mt-20 relative">
          <ContactSection />
          <StarsBackground />
        </section>

        <section>
          <FooterSection />
        </section>
      </div>
    </div>
  )
}
