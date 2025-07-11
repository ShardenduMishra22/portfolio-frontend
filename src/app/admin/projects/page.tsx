'use client'
import dynamic from 'next/dynamic'
const TiptapModalEditor = dynamic(() => import('../../../components/TipTap').then(mod => ({ default: mod.TiptapModalEditor })), { ssr: false })

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '../../../components/auth/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { projectsAPI } from '../../../util/apiResponse.util'
import { Project, CreateProjectRequest } from '../../../data/types.data'
import { Plus, Edit, Trash2, ExternalLink, Github, Play, Briefcase } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Checkbox } from '../../../components/ui/checkbox'
import { skillsAPI } from '../../../util/apiResponse.util'
import { Popover, PopoverTrigger, PopoverContent } from '../../../components/ui/popover'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../../components/ui/tooltip'
import toast from 'react-hot-toast'

const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  small_description: z.string().min(1, 'Small description is required'),
  description: z.string().min(1, 'Description is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  project_repository: z.string().url('Must be a valid URL'),
  project_live_link: z.string().url('Must be a valid URL'),
  project_video: z.string().url('Must be a valid URL'),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [allSkills, setAllSkills] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 4

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { skills: [] },
  })

  const selectedSkills = watch('skills') || []

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAllProjects()
      setProjects(Array.isArray(response.data) ? response.data : [])
    } catch {
      setError('Failed to fetch projects')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    const fetchSkills = async () => {
      const skillsRes = await skillsAPI.getSkills()
      setAllSkills(Array.isArray(skillsRes.data) ? skillsRes.data : [])
    }
    fetchSkills()
  }, [])

  // Pagination calculation
  const totalPages = Math.ceil(projects.length / projectsPerPage)
  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

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

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const projectData: CreateProjectRequest = {
        ...data,
        skills: data.skills,
      }

      if (editingProject) {
        await projectsAPI.updateProject(editingProject.inline.id, projectData)
        setSuccess('Project updated successfully')
        toast.success('Project updated successfully')
      } else {
        await projectsAPI.createProject(projectData)
        setSuccess('Project created successfully')
        toast.success('Project created successfully')
      }

      setIsDialogOpen(false)
      setEditingProject(null)
      reset({ skills: [] })
      fetchProjects()
    } catch {
      setError('Failed to save project')
      toast.error('Failed to save project')
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    reset({
      project_name: project.project_name,
      small_description: project.small_description,
      description: project.description,
      skills: project.skills,
      project_repository: project.project_repository,
      project_live_link: project.project_live_link,
      project_video: project.project_video,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return
    try {
      await projectsAPI.deleteProject(projectId)
      setSuccess('Project deleted successfully')
      toast.success('Project deleted successfully')
      fetchProjects()
      if (currentPage > 1 && paginatedProjects.length === 1) setCurrentPage(currentPage - 1)
    } catch {
      setError('Failed to delete project')
      toast.error('Failed to delete project')
    }
  }

  const openDialog = () => {
    setEditingProject(null)
    reset({ skills: [] })
    setIsDialogOpen(true)
  }

  return (
    <ProtectedRoute>
      <div className="space-y- max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Projects - Manage your portfolio projects and showcase your best work.
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 pb-2 border-b border-border">
          <div>
            <h2 className="text-3xl font-bold text-primary mb-1">Your Projects</h2>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={openDialog} className="shadow-md hover:shadow-xl transition-all duration-200">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Project
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add a new project</TooltipContent>
              </Tooltip>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-card/90 backdrop-blur-xl animate-fade-in">
              <DialogHeader>
                <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update your project details.' : 'Add a new project to your portfolio.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project_name">Project Name</Label>
                    <Input
                      id="project_name"
                      {...register('project_name')}
                      placeholder="My Awesome Project"
                    />
                    {errors.project_name && <p className="text-sm text-red-500">{errors.project_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button type="button" variant="outline" className="w-full justify-between">
                          {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : 'Select Skills'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="max-h-64 overflow-y-auto w-72 p-2">
                        {allSkills.map((skill) => (
                          <label key={skill} className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer">
                            <Checkbox
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) setValue('skills', [...selectedSkills, skill])
                                else setValue('skills', selectedSkills.filter((s) => s !== skill))
                              }}
                            />
                            <span>{skill}</span>
                          </label>
                        ))}
                      </PopoverContent>
                    </Popover>
                    {errors.skills && <p className="text-sm text-red-500">{errors.skills.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="small_description">Small Description</Label>
                  <Input
                    id="small_description"
                    {...register('small_description')}
                    placeholder="Brief project description"
                  />
                  {errors.small_description && <p className="text-sm text-red-500">{errors.small_description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description (Markdown Editor)</Label>
                  <TiptapModalEditor value={watch('description')} onChange={(value) => setValue('description', value)} />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_repository">Repository URL</Label>
                  <Input
                    id="project_repository"
                    {...register('project_repository')}
                    placeholder="https://github.com/username/project"
                  />
                  {errors.project_repository && <p className="text-sm text-red-500">{errors.project_repository.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_live_link">Live Demo URL</Label>
                  <Input
                    id="project_live_link"
                    {...register('project_live_link')}
                    placeholder="https://project-demo.com"
                  />
                  {errors.project_live_link && <p className="text-sm text-red-500">{errors.project_live_link.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_video">Video Demo URL</Label>
                  <Input
                    id="project_video"
                    {...register('project_video')}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                  {errors.project_video && <p className="text-sm text-red-500">{errors.project_video.message}</p>}
                </div>

                <div className="flex justify-end space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="submit">{editingProject ? 'Update Project' : 'Create Project'}</Button>
                    </TooltipTrigger>
                    <TooltipContent>{editingProject ? 'Update this project' : 'Create new project'}</TooltipContent>
                  </Tooltip>
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

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Briefcase className="mx-auto h-16 w-16 text-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No projects yet</h3>
            <p className="text-lg text-foreground mb-6">Get started by adding your first project.</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={openDialog} className="shadow-md hover:shadow-xl transition-all duration-200">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Project
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add a new project</TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 py-4 md:grid-cols-2 gap-8">
              {paginatedProjects.map((project) => (
                <Card
                  key={project.inline.id}
                  className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br from-card/50 to-card backdrop-blur-sm rounded-2xl animate-fade-in flex flex-col"
                >
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-card ">
                    <CardTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      {project.project_name}
                    </CardTitle>
                    <CardDescription className="text-foreground">{project.small_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-1 ">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      {project.project_repository && (
                        <a
                          href={project.project_repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground hover:text-primary"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
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
                      {project.project_video && (
                        <a
                          href={project.project_video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-primary"
                        >
                          <Play className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(project)} className="flex-1">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit this project</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(project.inline.id)}
                            className="flex-1"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete this project</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-10">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i + 1)}
                    className="min-w-[36px] px-3"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
