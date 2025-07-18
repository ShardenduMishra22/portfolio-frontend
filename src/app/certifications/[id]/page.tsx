'use client';

import { useEffect, useState } from 'react';
import { certificationsAPI } from '../../../util/apiResponse.util';
import { Certification } from '../../../data/types.data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ExternalLink, ArrowLeft, Calendar, Award, Zap, Image as ImageIcon, FolderOpen, Play, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const getYouTubeEmbedUrl = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(youtubeRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return null;
};

// Helper function to check if URL is a YouTube video
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to check if URL is a LinkedIn post
const isLinkedInUrl = (url: string): boolean => {
  return url.includes('www.linkedin.com');
};

// Helper function to check if URL is a GitHub repository
const isGitHubUrl = (url: string): boolean => {
  return url.includes('github.com') && !url.includes('github.io');
};

// Helper function to extract GitHub repo info
const getGitHubRepoInfo = (url: string): { owner: string; repo: string } | null => {
  const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(githubRegex);
  if (match && match[1] && match[2]) {
    return { owner: match[1], repo: match[2] };
  }
  return null;
};

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
                {error || 'The certification you\'re looking for doesn\'t exist or has been removed.'}
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

      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
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

        {/* Images/Media Section */}
        {certification.images && certification.images.filter(src => !isGitHubUrl(src)).length > 0 && (
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
{certification.images
                  .filter(src => !isGitHubUrl(src)) // Filter out GitHub URLs
                  .map((src, i) => (
                  <div key={i} className="space-y-2">
                    {isYouTubeUrl(src) ? (
                      // YouTube Video Embed
                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <div className="flex items-center gap-2 mb-3">
                          <Play className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium">YouTube Video</span>
                        </div>
                        <div className="w-full aspect-video bg-background rounded border overflow-hidden">
                          <iframe
                            src={getYouTubeEmbedUrl(src) || src}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            title={`YouTube video ${i + 1}`}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="mt-2">
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Watch on YouTube
                          </a>
                        </div>
                      </div>
                    ) : (
                      // Other Media Content
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
        {certification.projects && certification.projects.length > 0 && (
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
        )}
      </div>
    </div>
  );
}