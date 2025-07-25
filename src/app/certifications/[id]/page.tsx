'use client';

import { useEffect, useState } from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Certification } from '../../../data/types.data';
import { certificationsAPI } from '../../../util/apiResponse.util';
import { 
  Award, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  Star,
  Code2,
  Target,
} from 'lucide-react';
import { CanvasCard } from '@/components/Certificate/canva';
import { MediaSection } from '@/components/Certificate/MediaSection';
import { formatDate } from '@/components/Certificate/utils/urlHelpers';
import { ProjectsSection } from '@/components/Certificate/ProjectsSection';
import { ErrorState, LoadingState } from '@/components/Certificate/load-error';
import { CertificationHeader } from '@/components/Certificate/CertificationHeader';
import { CertificationDetails } from '@/components/Certificate/CertificationDetails';

export default function CertificationDetailPage({ params }: any) {
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyClicked, setCopyClicked] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);

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

  // Handle copying certification info as markdown
  const handleCopyMarkdown = async () => {
    if (!certification) return;
    
    const markdownContent = `# ${certification.title}

## Issuer
${certification.issuer}

## Issue Date
${formatDate(certification.issue_date)}

## Skills Gained
${certification.skills.map(skill => `- ${skill}`).join('\n')}

## Description
${certification.description}

${certification.certificate_url ? `## Certificate
- **Certificate:** ${certification.certificate_url}` : ''}

---
*Generated from certification portfolio*`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownContent);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = markdownContent;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback: Unable to copy', err);
        }
        document.body.removeChild(textArea);
      }
      setCopyClicked(true);
      setTimeout(() => setCopyClicked(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const certificationUrl = `${window.location.origin}/certifications/${params.id}`;
    const shareData = {
      title: `${certification?.title} - ${certification?.issuer}`,
      text: `Check out my certification: ${certification?.title} from ${certification?.issuer}`,
      url: certificationUrl,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(certificationUrl);
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 2000);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !certification) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <CertificationHeader certification={certification} />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12 w-full">
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <CanvasCard
                title="Certification Info"
                icon={<Award className="h-6 w-6 text-blue-400" />}
                containerClassName="bg-blue-900"
                colors={[[59, 130, 246], [147, 197, 253]]}
              >
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="text-white font-semibold text-lg">{certification.issuer}</h4>
                    <p className="text-white/80 text-sm">{certification.title}</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(certification.issue_date)}</span>
                  </div>
                  
                  {certification.certificate_url && (
                    <a
                      href={certification.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/30 text-white hover:bg-white/20"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    </a>
                  )}
                </div>
              </CanvasCard>

              {/* Skills Overview Card */}
              <CanvasCard
                title="Skills Overview"
                icon={<Code2 className="h-6 w-6 text-purple-400" />}
                containerClassName="bg-purple-900"
                colors={[[147, 51, 234], [196, 181, 253]]}
              >
                <div className="space-y-4">
                  <p className="text-white/90 text-sm">
                    Key competencies gained
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {certification.skills.slice(0, 6).map((skill, index) => (
                      <Badge 
                        key={index}
                        className="text-xs bg-white/20 text-white border-white/30"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {certification.skills.length > 6 && (
                      <Badge className="text-xs bg-white/20 text-white border-white/30">
                        +{certification.skills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              </CanvasCard>

              {/* Quick Actions Card */}
              <CanvasCard
                title="Quick Actions"
                icon={<Target className="h-6 w-6 text-emerald-400" />}
                containerClassName="bg-emerald-900"
                colors={[[34, 197, 94], [16, 185, 129]]}
              >
                <div className="space-y-4">
                  <p className="text-white/90 text-sm">
                    Share or copy certification details
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
                      size="sm"
                      disabled={shareClicked}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      {shareClicked ? 'Copied!' : 'Share'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={handleCopyMarkdown}
                      className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
                      size="sm"
                      disabled={copyClicked}
                    >
                      {copyClicked ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy MD
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CanvasCard>

              {/* Achievement Highlights */}
              <CanvasCard
                title="Achievement Highlights"
                icon={<Star className="h-6 w-6 text-amber-400" />}
                containerClassName="bg-amber-900"
                colors={[[245, 158, 11], [217, 119, 6]]}
              >
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">
                        {certification.skills.length}
                      </div>
                      <div className="text-xs text-white/70">
                        Skills
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white">
                        {certification.projects?.length || 0}
                      </div>
                      <div className="text-xs text-white/70">
                        Projects
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-white">Features:</div>
                    <div className="flex flex-wrap gap-2">
                      {certification.certificate_url && (
                        <Badge className="text-xs bg-white/20 text-white border-white/30">
                          ✓ Certified
                        </Badge>
                      )}
                      {certification.projects && certification.projects.length > 0 && (
                        <Badge className="text-xs bg-white/20 text-white border-white/30">
                          ✓ Projects
                        </Badge>
                      )}
                      {certification.images && certification.images.length > 0 && (
                        <Badge className="text-xs bg-white/20 text-white border-white/30">
                          ✓ Media
                        </Badge>
                      )}
                      {certification.skills.length > 5 && (
                        <Badge className="text-xs bg-white/20 text-white border-white/30">
                          ✓ Multi-skill
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CanvasCard>
            </div>
          </div>

          {/* Main Content - Right Side (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            <CertificationDetails certification={certification} />
            <MediaSection certification={certification} />
            <ProjectsSection certification={certification} />
          </div>
        </div>
      </main>
    </div>
  );
}
