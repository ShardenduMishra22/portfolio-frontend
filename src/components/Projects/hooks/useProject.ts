import { Project } from '@/data/types.data'
import { projectsAPI } from '@/util/apiResponse.util'
import { useEffect, useState } from 'react'

export function useProject(params: any) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { id } = await params
        const response = await projectsAPI.getProjectById(id)
        setProject(response.data)
      } catch (err) {
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params])

  return { project, loading, error }
}
