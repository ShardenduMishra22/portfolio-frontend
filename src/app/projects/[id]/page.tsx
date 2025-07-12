'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAPI } from '../../../util/apiResponse.util';
import { Project } from '../../../data/types.data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  Github, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Code2, 
  Zap,
  Globe,
  Video,
  FileText,
  Layers,
  Share2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function ProjectDetailPage({ params }: { params : any}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareClicked, setShareClicked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsAPI.getProjectById(params.id);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id]);

  const handleShare = async () => {
    setShareClicked(true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: project?.project_name,
          text: project?.small_description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setTimeout(() => setShareClicked(false), 1500);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-heading text-foreground">Loading Projects</h2>
            <p className="text-foreground">Fetching amazing work...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold">Project Not Found</h2>
              <p className="text-foreground max-w-md">
                {error || 'The project you\'re looking for doesn\'t exist or has been removed.'}
              </p>
              <Link href="/projects">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {project && <ProjectJsonLd project={project} />}
      <div className="min-h-screen bg-background">
        {/* Clean Navigation */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() => {
                if (window.history.length > 2) {
                  router.back();
                } else {
                  router.push('/projects');
                }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {shareClicked ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center space-y-6 mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {project.project_name}
            </h1>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              {project.small_description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {project.project_live_link && (
              <a
                href={project.project_live_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Live Demo
                </Button>
              </a>
            )}
            
            {project.project_repository && (
              <a
                href={project.project_repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  View Code
                </Button>
              </a>
            )}
            
            {project.project_video && (
              <a
                href={project.project_video}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Watch Demo
                </Button>
              </a>
            )}
          </div>

          {/* Project Meta */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-foreground">
            {project.created_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(project.created_at)}</span>
              </div>
            )}
            {project.updated_at && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(project.updated_at)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>{project.skills.length} technologies</span>
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Technologies Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-4 text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-3 mt-8 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mb-2 mt-6 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-foreground/90 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-1">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground/90">
                      {children}
                    </li>
                  ),
                  code: ({ children }) => (
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-border pl-4 italic text-foreground mb-4">
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt }) => (
                    <img 
                      src={src} 
                      alt={alt} 
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-sm mb-4"
                    />
                  ),
                }}
              >
                {project.description}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {project.project_repository && (
              <a
                href={project.project_repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  View Code
                </Button>
              </a>
            )}
            {project.project_live_link && (
              <a
                href={project.project_live_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Live Demo
                </Button>
              </a>
            )}
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Project
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

// Add JSON-LD structured data for the project
function ProjectJsonLd({ project }: { project: Project }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.project_name,
    description: project.small_description,
    url: `https://mishrashardendu22.is-a.dev/projects/${project.id}`,
    creator: {
      '@type': 'Person',
      name: 'Shardendu Mishra',
    },
    dateCreated: project.created_at,
    keywords: project.skills,
    image: project.images || [],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}