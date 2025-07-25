'use client'

import toast from 'react-hot-toast'
import Error from '@/components/Error'
import { useEffect, useState } from 'react'
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
} from '@/components/main/loading'
import { navItems } from '@/data/static_link'
import { DesktopSidebar } from '@/data/sidebar'
import { ShootingStars } from '@/components/ui/shooting-stars'
import { StarsBackground } from '@/components/ui/stars-background'
import { MobileNavigation } from '@/components/mobile-nav'

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
    // Removed education from loading state since it's static
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

        // Removed the artificial setTimeout for education since it's static

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
          // Removed education from error state as well
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
