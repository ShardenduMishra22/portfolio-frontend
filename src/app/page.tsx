'use client'

import { useEffect, useState } from 'react'
import { projectsAPI, experiencesAPI, skillsAPI, certificationsAPI } from '../util/apiResponse.util'
import { Project, Experience, Certification } from '../data/types.data'
import Loader from '@/components/Loader'
import Error from '@/components/Error'
import HeroSection from '@/components/main/hero'
import SkillsSection from '@/components/main/skill'
import ProjectsSection from '@/components/main/project'
import ExperienceSection from '@/components/main/exp'
import CertificationsSection from '@/components/main/certificate'
import ContactSection from '@/components/main/contact'
import FooterSection from '@/components/main/footer'
import toast from 'react-hot-toast';
import Education from '@/components/main/education'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, experiencesRes, skillsRes, certificationsRes] = await Promise.all([
          projectsAPI.getAllProjects(),
          experiencesAPI.getAllExperiences(),
          skillsAPI.getSkills(),
          certificationsAPI.getAllCertifications(),
        ])
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : (projectsRes.data === null ? [] : []))
        setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : (experiencesRes.data === null ? [] : []))
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : (skillsRes.data === null ? [] : []))
        setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : (certificationsRes.data === null ? [] : []))
        toast.success('Homepage data loaded!');
      } catch (err) {
        setError('Failed to load homepage data')
        setProjects([])
        setExperiences([])
        setSkills([])
        setCertifications([])
        toast.error('Failed to load homepage data');
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <Loader />
  
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
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Education />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={projects} />
      <ExperienceSection experiences={experiences} />
      <CertificationsSection certifications={certifications} />
      <ContactSection />
      <FooterSection />
    </div>
  )
}