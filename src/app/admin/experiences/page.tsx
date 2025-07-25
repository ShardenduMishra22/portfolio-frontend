'use client'

import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Badge } from '../../../components/ui/badge'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { useEffect, useState } from 'react'
import { TiptapModalEditor } from '@/components/extra/TipTap'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { Experience, CreateExperienceRequest } from '../../../data/types.data'
import { experiencesAPI, projectsAPI, skillsAPI } from '../../../util/apiResponse.util'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'

// Define form data type
interface ExperienceFormData {
  company_name: string
  position: string
  start_date: string
  end_date: string
  description: string
  technologies: string[]
  company_logo: string
  certificate_url: string
  projects: string[]
  images: string
}

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [allProjects, setAllProjects] = useState<{ id: string; name: string }[]>([])
  const [allSkills, setAllSkills] = useState<string[]>([])
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [newTechnology, setNewTechnology] = useState('')
  const [page, setPage] = useState(1)
  const limit = 6

  const { register, handleSubmit, reset, setValue, watch, getValues } = useForm<ExperienceFormData>(
    {
      defaultValues: { projects: [], technologies: [] },
    }
  )

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
    projectsAPI.getAllProjects().then((res) => {
      setAllProjects(
        Array.isArray(res.data)
          ? res.data.map((p: any) => ({ id: p.inline.id, name: p.project_name }))
          : []
      )
    })
    skillsAPI.getSkills().then((res) => {
      setAllSkills(Array.isArray(res.data) ? res.data : [])
    })
  }, [])

  useEffect(() => {
    if (success) {
      toast.success(success)
      const timer = setTimeout(() => setSuccess(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      toast.error(error)
      const timer = setTimeout(() => setError(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid"></div>
      </div>
    )
  if (error && experiences.length === 0)
    return (
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
        technologies: selectedTechnologies,
        projects: selectedProjects,
        images: data.images.split(',').map((img) => img.trim()),
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
      setSelectedTechnologies([])
      setSelectedProjects([])
      fetchExperiences()
    } catch {
      setError('Failed to save experience')
    }
  }

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp)
    setSelectedTechnologies(exp.technologies || [])
    setSelectedProjects(exp.projects || [])
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

  const openDialog = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditingExperience(null)
    reset({ projects: [], technologies: [] })
    setSelectedTechnologies([])
    setSelectedProjects([])
    setIsDialogOpen(true)
  }

  const addTechnology = () => {
    if (newTechnology.trim() && !selectedTechnologies.includes(newTechnology.trim())) {
      setSelectedTechnologies([...selectedTechnologies, newTechnology.trim()])
      setValue('technologies', [...selectedTechnologies, newTechnology.trim()])
      setNewTechnology('')
    }
  }

  const removeTechnology = (tech: string) => {
    const updated = selectedTechnologies.filter((t) => t !== tech)
    setSelectedTechnologies(updated)
    setValue('technologies', updated)
  }

  const toggleProject = (projectId: string) => {
    const updated = selectedProjects.includes(projectId)
      ? selectedProjects.filter((p) => p !== projectId)
      : [...selectedProjects, projectId]
    setSelectedProjects(updated)
    setValue('projects', updated)
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
          Experiences - Manage your professional experiences and work history.
        </h1>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 pb-2 border-b border-border">
        <div>
          <h2 className="text-3xl font-bold text-secondary mb-1">Your Experiences</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openDialog}
              className="shadow-md hover:shadow-xl transition-all duration-200 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Edit Experience' : 'Add New Experience'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    {...register('company_name')}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" {...register('position')} placeholder="Enter position" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" type="date" {...register('start_date')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" type="date" {...register('end_date')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_logo">Company Logo URL</Label>
                  <Input
                    id="company_logo"
                    {...register('company_logo')}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate_url">Certificate URL</Label>
                  <Input
                    id="certificate_url"
                    {...register('certificate_url')}
                    placeholder="https://example.com/certificate.pdf"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description (Markdown Editor)</Label>
                <TiptapModalEditor
                  value={watch('description')}
                  onChange={(value) => setValue('description', value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images (comma-separated URLs)</Label>
                <Input
                  id="images"
                  {...register('images')}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add a technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  />
                  <Button type="button" onClick={addTechnology} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTechnologies.map((tech) => (
                    <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => removeTechnology(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Projects</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {allProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={project.id}
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => toggleProject(project.id)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={project.id} className="text-sm">
                        {project.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingExperience ? 'Update Experience' : 'Create Experience'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
          <p className="text-lg text-foreground mb-6">
            Get started by adding your first experience.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openDialog}
                className="shadow-md hover:shadow-xl transition-all duration-200 flex items-center"
              >
                <Plus className="mr-2 h-5 w-5" /> Add Experience
              </Button>
            </DialogTrigger>
          </Dialog>
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
                    {exp.company_name} &bull; {formatDate(exp.start_date)} to{' '}
                    {formatDate(exp.end_date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-2 p-2">
                  <p className="text-base text-foreground line-clamp-4">
                    {exp.description.length > 180
                      ? `${exp.description.substring(0, 180)}...`
                      : exp.description}
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(exp)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(exp.inline.id)}
                      className="flex-1"
                    >
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
