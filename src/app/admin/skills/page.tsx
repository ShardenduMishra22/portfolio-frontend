'use client'

import { useEffect, useState } from 'react'
import { ProtectedRoute } from '../../../components/auth/protected-route'
import { Button } from '../../../components/ui/button'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { skillsAPI } from '../../../util/apiResponse.util'
import { Plus, Settings, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { SkillsAddDialog, SkillsManagement } from '../../../components/admin/skills'

const skillsSchema = z.object({
  skills: z.string().min(1, 'Skills are required'),
})

type SkillsFormData = z.infer<typeof skillsSchema>

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 21
  const totalPages = Math.ceil(skills.length / itemsPerPage)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
  })

  const fetchSkills = async () => {
    try {
      const response = await skillsAPI.getSkills()
      setSkills(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch {
      setError('Failed to fetch skills')
      setSkills([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const onSubmit = async (data: SkillsFormData) => {
    try {
      const skillsArray = data.skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0)
      await skillsAPI.addSkills({ skills: skillsArray })
      setSuccess('Skills added successfully')
      setError('')
      setIsDialogOpen(false)
      reset()
      fetchSkills()
    } catch {
      setError('Failed to add skills')
      setSuccess('')
    }
  }

  const openDialog = () => {
    reset()
    setIsDialogOpen(true)
  }

  const paginatedSkills = skills.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  if (loading)
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
      </div>
    )

  if (error && !skills.length)
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 text-center max-w-lg mx-auto">
        <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center">
          <span className="text-5xl">😢</span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Oops! Something went wrong</h2>
        <p className="text-foreground text-lg">{error}</p>
        <Button onClick={fetchSkills} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    )

  return (
    <ProtectedRoute>
        <header className="text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent leading-tight">
            Skills - Manage your technical skills and competencies.
          </h1>
        </header>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-bold text-accent mb-1">Your Skills</h2>
            <p className="text-foreground text-lg max-w-md">Add you skills below.</p>
          </div>

          <SkillsAddDialog
            open={isDialogOpen}
            setOpen={setIsDialogOpen}
            onSubmit={onSubmit}
            errors={errors}
            register={register}
            handleSubmit={handleSubmit}
            reset={reset}
          />
        </div>

        {success && (
          <Alert className="animate-fade-in bg-primary/10 border border-primary/30 text-primary relative">
            <AlertDescription>{success}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-primary hover:text-primary/80"
              onClick={() => setSuccess('')}
              aria-label="Close success alert"
            >
              <X className="w-4 h-4" />
            </Button>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="animate-fade-in relative">
            <AlertDescription>{error}</AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
              onClick={() => setError('')}
              aria-label="Close error alert"
            >
              <X className="w-4 h-4" />
            </Button>
          </Alert>
        )}

        {skills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-fade-in bg-card/50 backdrop-blur-md rounded-xl border border-border/30 shadow-lg">
            <Settings className="h-20 w-20 text-foreground" />
            <h3 className="text-3xl font-semibold text-foreground">No skills yet</h3>
            <p className="text-lg text-foreground max-w-md text-center">
              Get started by adding your first skill.
            </p>
            <Button
              onClick={openDialog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Skill
            </Button>
          </div>
        ) : (
          <>
              <SkillsManagement skills={paginatedSkills} />
          

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  variant="outline"
                  disabled={currentPage === 0}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Prev
                </Button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                        : 'bg-card hover:bg-primary/5 border border-primary/20 hover:border-primary/30 text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  variant="outline"
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
    </ProtectedRoute>
  )
}
