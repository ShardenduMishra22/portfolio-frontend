'use client'

import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import Error from '@/components/Error'
import { useEffect, useState } from 'react'
import { Sparkles, Menu, X } from 'lucide-react'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import Education from '@/components/main/education'
import FooterSection from '@/components/main/footer'
import ExperienceSection from '@/components/main/exp'
import ContactSection from '@/components/main/contact'
import ProjectsSection from '@/components/main/project'
import CertificationsSection from '@/components/main/certificate'
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
import { ShootingStars } from '@/components/ui/shooting-stars'
import { StarsBackground } from '@/components/ui/stars-background'


function MobileNavigation({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => {
    setIsOpen(false)
  }

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.mobile-nav') && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

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
          {navItems.map((item, index) => (
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
          ))}
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
}



export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState({
    projects: true,
    experiences: true,
    skills: true,
    certifications: true,
    education: true
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
    const fetchData = async () => {
      try {
        // Fetch all data concurrently
        const [projectsRes, experiencesRes, skillsRes, certificationsRes] = await Promise.all([
          projectsAPI.getAllProjects(),
          experiencesAPI.getAllExperiences(),
          skillsAPI.getSkills(),
          certificationsAPI.getAllCertifications(),
        ])

        // Set data and update loading states individually
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : [])
        setLoading(prev => ({ ...prev, projects: false }))

        setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
        setLoading(prev => ({ ...prev, experiences: false }))

        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setLoading(prev => ({ ...prev, skills: false }))

        setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : [])
        setLoading(prev => ({ ...prev, certifications: false }))

        // Simulate education loading (assuming it's static or has its own API)
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
    }
    fetchData()
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


      
      {/* Desktop Sidebar */}
      <DesktopSidebar activeSection={activeSection} />
      
      {/* Mobile Navigation */}
      <MobileNavigation activeSection={activeSection} />
      
      <div className="md:pl-20 transition-all duration-500 ease-out">
        <section id="hero" className="relative">
          <HeroSection />
          <ShootingStars />
        </section>
        
        <section id="education" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          {loading.education ? <EducationSkeleton /> : <Education />}
          <ShootingStars />
        </section>


          <section id="skills" className="scroll-mt-20 relative">
            {loading.skills ? <SkillsSkeleton /> : <SkillsSection skills={skills} />}
          </section>
          
          <section id="projects" className="scroll-mt-20 relative">
            {loading.projects ? <ProjectsSkeleton /> : <ProjectsSection projects={projects} />}
          </section>

        <section id="experience" className="scroll-mt-20 relative bg-white dark:bg-black">
          {loading.experiences ? <ExperienceSkeleton /> : <ExperienceSection experiences={experiences} />}
        </section>
        
        <section id="certifications" className="scroll-mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
          {loading.certifications ? <CertificationsSkeleton /> : <CertificationsSection certifications={certifications} />}
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