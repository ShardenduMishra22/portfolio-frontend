'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Certification } from '@/data/types.data';
import { Button } from '../ui/button';

interface CertificationHeaderProps {
  certification: Certification;
}

export const CertificationHeader: React.FC<CertificationHeaderProps> = ({ certification }) => {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/certifications');
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{certification.title}</h1>
          <p className="text-foreground text-lg">{certification.issuer}</p>
          <div className="flex justify-center gap-4 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{certification.issue_date}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
