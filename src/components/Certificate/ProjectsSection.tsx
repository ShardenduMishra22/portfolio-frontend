import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FolderOpen } from 'lucide-react';
import { Certification } from '@/data/types.data';

interface ProjectsSectionProps {
  certification: Certification;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ certification }) => {
  if (!certification.projects || certification.projects.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Related Projects
        </CardTitle>
        <CardDescription>Projects completed during this certification</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certification.projects.map(id => (
            <div key={id} className="bg-muted/50 rounded-lg p-4 border hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen className="w-4 h-4" />
                <span className="text-sm font-medium">Project Preview</span>
              </div>
              <div className="w-full h-64 bg-background rounded border overflow-hidden mb-3">
                <iframe
                  src={`/projects/${id}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title={`Project ${id}`}
                  className="w-full h-full"
                  style={{ 
                    border: 'none',
                    transform: 'scale(0.45)',
                    transformOrigin: 'top left',
                    width: '220%',
                    height: '250%'
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <Link href={`/projects/${id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" />
                    View Project
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
