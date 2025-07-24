
import { Suspense } from 'react';
import ProjectPageContent from '../../components/Projects/ProjectPageContent';

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectPageContent />
    </Suspense>
  );
}