import React from 'react';
import { ExternalLink, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Certification } from '@/data/types.data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface CertificationDetailsProps {
  certification: Certification;
}

export const CertificationDetails: React.FC<CertificationDetailsProps> = ({ certification }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Certification Details
        </CardTitle>
        <CardDescription>Skills & description</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {certification.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <ReactMarkdown>{certification.description}</ReactMarkdown>
        </div>

        <div className="flex items-center gap-4 pt-2">
          {certification.certificate_url && (
            <a
              href={certification.certificate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View Certificate
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
