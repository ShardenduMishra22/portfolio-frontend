import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ErrorState } from './Load-Error';

interface ProjectNotFoundProps {
  error: string;
}

export function ProjectNotFound({ error }: ProjectNotFoundProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ErrorState error={error || 'Project not found or has been removed.'} />
        <div className="text-center mt-6">
          <Link href="/projects">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
