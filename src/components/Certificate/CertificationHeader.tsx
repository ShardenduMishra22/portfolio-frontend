'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Award } from 'lucide-react';
import { Certification } from '@/data/types.data';
import { formatDate } from './utils/urlHelpers';

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
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4" />
              <span>{certification.issuer}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mb-8 w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {certification.title}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div>
                <p className="text-xl text-foreground font-medium">{certification.issuer}</p>
                <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(certification.issue_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
