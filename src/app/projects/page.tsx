import { Suspense } from 'react'
import { LoadingState } from '@/components/projects/Load-Error'
import ProjectPageContent from '../../components/projects/ProjectPageContent'

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProjectPageContent />
    </Suspense>
  )
}
