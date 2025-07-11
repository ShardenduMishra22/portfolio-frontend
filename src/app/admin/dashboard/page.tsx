'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '../../../components/auth/protected-route'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { projectsAPI, experiencesAPI, skillsAPI, certificationsAPI } from '../../../util/apiResponse.util'
import { Project, Experience, Certification } from '../../../data/types.data'
import { Briefcase, GraduationCap, Settings, Plus, ExternalLink, Medal } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<string[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, experiencesRes, skillsRes, certificationsRes] = await Promise.all([
          projectsAPI.getAllProjects(),
          experiencesAPI.getAllExperiences(),
          (await skillsAPI.getSkills()),
          certificationsAPI.getAllCertifications(),
        ])
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : [])
        setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
        setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : [])
      } catch (err) {
        setError('Failed to load dashboard data')
        setProjects([])
        setExperiences([])
        setSkills([])
        setCertifications([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
    </div>
  )
  if (error) return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
        <span className="text-4xl">😢</span>
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-heading text-foreground">Oops! Something went wrong</h2>
        <p className="text-foreground text-lg">{error}</p>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="space-y-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12 space-y-6">
          <h1 className="text-2xl md:text-3xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Welcome, Admin Manage your professional experiences and work history.
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {/* Stat Card Example */}
          <div className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center animate-fade-in">
            <Briefcase className="h-8 w-8 text-primary mb-2" />
            <div className="text-3xl font-bold text-foreground">{projects.length}</div>
            <div className="text-base text-foreground">Projects</div>
          </div>
          <div className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center animate-fade-in">
            <GraduationCap className="h-8 w-8 text-secondary mb-2" />
            <div className="text-3xl font-bold text-foreground">{experiences.length}</div>
            <div className="text-base text-foreground">Experiences</div>
          </div>
          <div className="group relative overflow-hidden border-2 border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center animate-fade-in">
            <Settings className="h-8 w-8 text-accent mb-2" />
            <div className="text-3xl font-bold text-foreground">{skills.length}</div>
            <div className="text-base text-foreground">Skills</div>
          </div>
          <div className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center animate-fade-in">
            <Medal className="h-8 w-8 text-primary mb-2 flex items-center justify-center" />
            <div className="text-3xl font-bold text-foreground">{certifications.length}</div>
            <div className="text-base text-foreground">Certifications</div>
          </div>
          <div className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center animate-fade-in">
            <span className="h-8 w-8 flex items-center justify-center text-secondary mb-2 font-bold text-2xl">🌐</span>
            <div className="text-3xl font-bold text-foreground">Live</div>
            <div className="text-base text-foreground">Portfolio Status</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/projects">
            <Button variant="outline" className="w-full h-auto p-6 flex-col gap-2 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 animate-fade-in">
              <Briefcase className="h-8 w-8 mb-2 text-primary" />
              Manage Projects
            </Button>
          </Link>
          <Link href="/admin/experiences">
            <Button variant="outline" className="w-full h-auto p-6 flex-col gap-2 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 animate-fade-in">
              <GraduationCap className="h-8 w-8 mb-2 text-secondary" />
              Manage Experiences
            </Button>
          </Link>
          <Link href="/admin/skills">
            <Button variant="outline" className="w-full h-auto p-6 flex-col gap-2 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 animate-fade-in">
              <Settings className="h-8 w-8 mb-2 text-accent" />
              Manage Skills
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full h-auto p-6 flex-col gap-2 text-lg font-semibold shadow-md hover:shadow-xl transition-all duration-200 animate-fade-in">
              <ExternalLink className="h-8 w-8 mb-2 text-primary" />
              View Portfolio
            </Button>
          </Link>
        </div>

        {/* Recent Projects & Experiences */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Projects */}
          <div className="rounded-2xl border border-border bg-card/80 shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-primary">Recent Projects</h2>
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Briefcase className="mx-auto h-12 w-12 text-foreground" />
                  <h3 className="mt-2 text-lg font-medium text-foreground">No projects</h3>
                  <p className="mt-1 text-base text-foreground">
                    Get started by creating your first project.
                  </p>
                  <div className="mt-6">
                    <Link href="/admin/projects">
                      <Button>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Project
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.inline.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all duration-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-foreground truncate">
                          {project.project_name}
                        </p>
                        <p className="text-sm text-foreground truncate">
                          {project.small_description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {project.project_live_link && (
                          <a
                            href={project.project_live_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <div className="pt-4">
                      <Link href="/admin/projects">
                        <Button variant="outline" className="w-full">
                          View All Projects
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recent Experiences */}
          <div className="rounded-2xl border border-border bg-card/80 shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-secondary">Recent Experiences</h2>
            <div className="space-y-4">
              {experiences.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <GraduationCap className="mx-auto h-12 w-12 text-foreground" />
                  <h3 className="mt-2 text-lg font-medium text-foreground">No experiences</h3>
                  <p className="mt-1 text-base text-foreground">
                    Get started by adding your work experience.
                  </p>
                  <div className="mt-6">
                    <Link href="/admin/experiences">
                      <Button>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Experience
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {experiences.slice(0, 3).map((experience) => (
                    <div key={experience.inline.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-all duration-200">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-foreground truncate">
                          {experience.position}
                        </p>
                        <p className="text-sm text-foreground truncate">
                          {experience.company_name}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(experience.start_date).getFullYear()} - {new Date(experience.end_date).getFullYear()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {experiences.length > 3 && (
                    <div className="pt-4">
                      <Link href="/admin/experiences">
                        <Button variant="outline" className="w-full">
                          View All Experiences
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 