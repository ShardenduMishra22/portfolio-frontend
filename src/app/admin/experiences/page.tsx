'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { experiencesAPI, projectsAPI, skillsAPI } from '../../../util/apiResponse.util'
import { Experience, CreateExperienceRequest } from '../../../data/types.data'
import { Plus, Edit, Trash2, Briefcase, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const experienceSchema = z.object({
  company_name: z.string().min(1),
  position: z.string().min(1),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  company_logo: z.string().url(),
  certificate_url: z.string().url(),
  projects: z.array(z.string()),
  images: z.string().min(1),
})

type ExperienceFormData = z.infer<typeof experienceSchema>

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [allProjects, setAllProjects] = useState<{ id: string; name: string }[]>([])
  const [allSkills, setAllSkills] = useState<string[]>([])

  const [page, setPage] = useState(1)
  const limit = 6

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { projects: [], technologies: [] },
  })

  const fetchExperiences = async () => {
    try {
      const response = await experiencesAPI.getAllExperiences()
      setExperiences(Array.isArray(response.data) ? response.data : [])
    } catch {
      setError('Failed to fetch experiences')
      setExperiences([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
    projectsAPI.getAllProjects().then(res => {
      setAllProjects(Array.isArray(res.data) ? res.data.map((p: any) => ({ id: p.inline.id, name: p.project_name })) : [])
    })
    skillsAPI.getSkills().then(res => {
      setAllSkills(Array.isArray(res.data) ? res.data : [])
    })
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

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      const experienceData: CreateExperienceRequest = {
        ...data,
        technologies: data.technologies,
        projects: data.projects,
        images: data.images.split(',').map(img => img.trim()),
      }
      if (editingExperience) {
        await experiencesAPI.updateExperience(editingExperience.inline.id, experienceData)
        setSuccess('Experience updated successfully')
      } else {
        await experiencesAPI.createExperience(experienceData)
        setSuccess('Experience created successfully')
      }
      setIsDialogOpen(false)
      setEditingExperience(null)
      reset({ projects: [], technologies: [] })
      fetchExperiences()
    } catch {
      setError('Failed to save experience')
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp)
    reset({
      company_name: exp.company_name,
      position: exp.position,
      start_date: exp.start_date,
      end_date: exp.end_date,
      description: exp.description,
      technologies: exp.technologies,
      company_logo: exp.company_logo,
      certificate_url: exp.certificate_url,
      projects: exp.projects,
      images: exp.images.join(', '),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) return
    try {
      await experiencesAPI.deleteExperience(id)
      setSuccess('Experience deleted successfully')
      fetchExperiences()
      if ((page - 1) * limit >= experiences.length - 1 && page > 1) setPage(page - 1)
    } catch {
      setError('Failed to delete experience')
    }
  }

  const openDialog = () => {
    setEditingExperience(null)
    reset({ projects: [], technologies: [] })
    setIsDialogOpen(true)
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })

  // Pagination logic
  const totalPages = Math.ceil(experiences.length / limit)
  const currentData = experiences.slice((page - 1) * limit, page * limit)

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent leading-tight">
            Experiences Manage your professional experiences and work history.
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 pb-2 border-b border-border">
          <div>
            <h2 className="text-3xl font-bold text-secondary mb-1">Your Experiences</h2>
          </div>
          <Button onClick={openDialog} className="shadow-md hover:shadow-xl transition-all duration-200 flex items-center">
            <Plus className="mr-2 h-5 w-5" /> Add Experience
          </Button>
        </div>

        {success && (
          <Alert className="animate-fade-in">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <GraduationCap className="mx-auto h-16 w-16 text-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No experiences yet</h3>
            <p className="text-lg text-foreground mb-6">Get started by adding your first experience.</p>
            <Button onClick={openDialog} className="shadow-md hover:shadow-xl transition-all duration-200 flex items-center">
              <Plus className="mr-2 h-5 w-5" /> Add Experience
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {currentData.map((exp) => (
                <Card
                  key={exp.inline?.id || exp.inline.id}
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl animate-fade-in flex flex-col"
                >
                  <CardHeader className="bg-gradient-to-r from-secondary/10 to-card pb-2">
                    <CardTitle className="text-2xl font-semibold text-secondary flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-secondary" />
                      {exp.position}
                    </CardTitle>
                    <CardDescription className="text-foreground">
                      {exp.company_name} &bull; {formatDate(exp.start_date)} to {formatDate(exp.end_date)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-2 p-2">
                    <p className="text-base text-foreground line-clamp-4">
                      {exp.description.length > 180 ? `${exp.description.substring(0, 180)}...` : exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {exp.technologies.map((tech, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-auto">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(exp)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.inline.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
  )
}
