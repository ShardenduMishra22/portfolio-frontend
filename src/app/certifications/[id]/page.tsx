'use client';

import { useEffect, useState } from 'react';
import { certificationsAPI } from '../../../util/apiResponse.util';
import { Certification } from '../../../data/types.data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ExternalLink, ArrowLeft, Calendar, Award, Zap } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CertificationDetailPage({ params }: { params: any }) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCertification = async () => {
      try {
        const response = await certificationsAPI.getCertificationById(params.id);
        setCertification(response.data);
      } catch (err) {
        setError('Failed to load certification');
      } finally {
        setLoading(false);
      }
    };
    fetchCertification();
  }, [params.id]);

  if (loading) {
    return (
<div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Loading Certification</h2>
            <p className="text-foreground">Fetching amazing work...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !certification) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Certification Not Found</h2>
              <p className="text-foreground max-w-md">
                {error || 'The project you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Link href="/certifications">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Certifications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => {
              if (window.history.length > 2) {
                router.back();
              } else {
                router.push('/certifications');
              }
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">{certification.title}</h1>
          <p className="text-foreground text-lg">{certification.issuer}</p>
          <div className="flex justify-center gap-4 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{certification.issue_date} - {certification.expiry_date}</span>
            </div>
            {certification.images?.[0] && (
              <div className="relative h-6 w-6">
                <Image
                  src={certification.images[0]}
                  alt={`${certification.title} image`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certification Details
            </CardTitle>
            <CardDescription className="mt-2">Skills & description</CardDescription>
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
      </div>
    </div>
  );
}
