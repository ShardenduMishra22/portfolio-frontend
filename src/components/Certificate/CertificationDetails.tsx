import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExternalLink, ScrollText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Certification } from '@/data/types.data';
import { SkillsLens } from './skill-lens';

interface CertificationDetailsProps {
  certification: Certification;
}

export const CertificationDetails: React.FC<CertificationDetailsProps> = ({ certification }) => {
  const isShortDescription = (certification?.description?.length || 0) < 500;

  return (
    <>
      {/* Certification Overview */}
      <Card className="border border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            Certification Overview
          </CardTitle>
          <CardDescription>Achievement summary and key learning outcomes</CardDescription>
        </CardHeader>
        <CardContent className={`${isShortDescription ? 'min-h-[400px]' : 'min-h-[600px]'} flex flex-col`}>
          <div className="flex-grow">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown>{certification.description}</ReactMarkdown>
            </div>
          </div>

          {certification.certificate_url && (
            <div className="mt-6 pt-4 border-t border-border/30">
              <a
                href={certification.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Official Certificate
              </a>
            </div>
          )}

          {isShortDescription && (
            <div className="mt-auto pt-8 space-y-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="h-px bg-border flex-1 max-w-20" />
                  <ScrollText className="w-4 h-4" />
                  <div className="h-px bg-border flex-1 max-w-20" />
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                  Certification Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-background/50 rounded-md">
                    <div className="font-semibold text-primary">{certification.skills.length}</div>
                    <div className="text-muted-foreground">Skills</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-md">
                    <div className="font-semibold text-primary">{certification.projects?.length || 0}</div>
                    <div className="text-muted-foreground">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section with Enhanced Display */}
      <Card className="border border-border/50 bg-card/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="w-1 h-5 bg-primary rounded-full" />
            Skills & Competencies
          </CardTitle>
          <CardDescription>Technical skills gained through this certification</CardDescription>
        </CardHeader>
        <CardContent>
          <SkillsLens skills={certification.skills} />
        </CardContent>
      </Card>
    </>
  );
};
