'use client'

import toast from 'react-hot-toast'
import Error from '@/components/Error'
import { useEffect, useState } from 'react'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import Education from '@/components/main/education'
import FooterSection from '@/components/main/footer'
import ContactSection from '@/components/main/contact'


import { 
  SkillsSkeleton, 
} from '@/components/main/loading'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/data/sidebar'
import { MobileNavigation } from '@/components/mobile-nav'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { StarsBackground } from '@/components/ui/stars-background'
import { skillsAPI } from '@/util/apiResponse.util'
import { LazyProjectsSection } from '@/components/Lazy/proj'
import { LazyExperienceSection } from '@/components/Lazy/exp'
import { LazyCertificationsSection } from '@/components/Lazy/cert'

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
        setLoading(prev => ({ ...prev, skills: false }))
        
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