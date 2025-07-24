'use client';

import { useEffect, useState } from 'react';
import { certificationsAPI } from '../../../util/apiResponse.util';
import { Certification } from '../../../data/types.data';
import { CertificationPageProps } from '@/components/Certificate/types/certification.types';
import { ErrorState, LoadingState } from '@/components/Certificate/load-error';
import { CertificationHeader } from '@/components/Certificate/CertificationHeader';
import { CertificationDetails } from '@/components/Certificate/CertificationDetails';
import { MediaSection } from '@/components/Certificate/MediaSection';
import { ProjectsSection } from '@/components/Certificate/ProjectsSection';


export default function CertificationDetailPage({ params }: CertificationPageProps) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await certificationsAPI.getCertificationById(params.id);
        setCertification(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load certification');
      } finally {
        setLoading(false);
      }
    };
    fetchCertification();
  }, [params.id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !certification) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CertificationHeader certification={certification} />
      
      <div className="container mx-auto px-4 max-w-6xl space-y-10">
        <CertificationDetails certification={certification} />
        <MediaSection certification={certification} />
        <ProjectsSection certification={certification} />
      </div>
    </div>
  );
}
