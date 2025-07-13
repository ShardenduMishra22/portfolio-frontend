'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { experiencesAPI } from '../../../util/apiResponse.util';
import { Experience } from '../../../data/types.data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ExternalLink, ArrowLeft, Calendar, Building2, Zap, Image as ImageIcon, FolderOpen } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ExperienceDetailPage({ params }: { params: any }) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await experiencesAPI.getExperienceById(params.id);
        console.log('Fetched experience:', response);
        setExperience(response.data);
      } catch {
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
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
            <h2 className="text-xl font-heading text-foreground">Loading Experience</h2>
            <p className="text-foreground">Fetching amazing work...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Experience Not Found</h2>
              <p className="text-foreground max-w-md">
                {error || 'The experience you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Link href="/experiences">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

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
              router.push('/experiences');
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">{experience.position}</h1>
          <p className="text-foreground text-lg">{experience.company_name}</p>
          <div className="flex justify-center gap-4 text-sm text-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(experience.start_date)} - {formatDate(experience.end_date)}</span>
            </div>
            {experience.company_logo && (
              <div className="relative h-6 w-6">
                <Image
                  src={experience.company_logo}
                  alt={`${experience.company_name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Role Summary
            </CardTitle>
            <CardDescription>Tech stack and key contributions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown>{experience.description}</ReactMarkdown>
            </div>
            <div className="flex items-center gap-4 pt-2">
              {experience.certificate_url && (
                <a
                  href={experience.certificate_url}
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

        {/* Images/Media Section */}
        {experience.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Media & Highlights
              </CardTitle>
              <CardDescription>Visual content and embedded posts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experience.images.map((src, i) => (
                  <div key={i} className="space-y-2">
                    {src.includes('www.linkedin.com') ? (
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-3">
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">LinkedIn Post</span>
                        </div>
                        <div className="w-full h-96 bg-background rounded border overflow-hidden">
                          <iframe
                            src={src}
                            width="504"
                            height="1236"
                            allowFullScreen
                            title={`LinkedIn post ${i + 1}`}
                            className="w-full h-full"
                            style={{ 
                              border: 'none',
                              transform: 'scale(0.7)',
                              transformOrigin: 'top left',
                              width: '142.86%',
                              height: '142.86%'
                            }}
                          />
                        </div>
                        <div className="mt-2">
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View on LinkedIn
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-3">
                          <ImageIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Media Content</span>
                        </div>
                        <div className="w-full h-80 bg-background rounded border overflow-hidden">
                          <iframe
                            src={src}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            title={`Media content ${i + 1}`}
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
                        <div className="mt-2">
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View Full Content
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {experience.projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Related Projects
              </CardTitle>
              <CardDescription>Projects completed during this experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {experience.projects.map(id => (
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
        )}
      </div>
    </div>
  );
}