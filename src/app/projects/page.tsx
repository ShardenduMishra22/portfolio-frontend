import { Suspense } from 'react'
import { LoadingState } from '@/components/Projects/Load-Error'
import ProjectPageContent from '../../components/Projects/ProjectPageContent'

export default function ProjectsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProjectPageContent />
    </Suspense>
  )
}
