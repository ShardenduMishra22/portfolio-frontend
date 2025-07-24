import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CanvasCard } from '@/components/Certificate/canva';
import { Experience } from '@/data/types.data';
import { 
  Building2, 
  Code2, 
  Rocket, 
  Star, 
  Award, 
  Clock,
  Share2,
  Copy,
  Check
} from 'lucide-react';

interface ExperienceSidebarProps {
  experience: Experience;
  onShare: () => void;
  onCopyMarkdown: () => void;
  shareClicked: boolean;
  copyClicked: boolean;
}

export function ExperienceSidebar({ 
  experience, 
  onShare, 
  onCopyMarkdown, 
  shareClicked, 
  copyClicked 
}: ExperienceSidebarProps) {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="sticky top-24 space-y-6">
        {/* Company Info Card */}
        <CanvasCard
          animationSpeed={4}
          title="Company Info"
          icon={<Building2 className="h-6 w-6 text-blue-400" />}
          containerClassName="bg-blue-900"
          colors={[[59, 130, 246], [147, 197, 253]]}
          dotSize={2}
        >
          <div className="space-y-4">
            <div className="text-center">
              {experience.company_logo && (
                <div className="relative h-16 w-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={experience.company_logo}
                    alt={`${experience.company_name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h4 className="text-white font-semibold text-lg">{experience.company_name}</h4>
              <p className="text-white/80 text-sm">{experience.position}</p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatDate(experience.start_date)} - {formatDate(experience.end_date)}</span>
            </div>
            
            {experience.certificate_url && (
              <a
                href={experience.certificate_url}
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

        {/* Tech Stack Card */}
        <CanvasCard
          title="Tech Stack"
          icon={<Code2 className="h-6 w-6 text-purple-400" />}
          animationSpeed={4}
          containerClassName="bg-purple-900"
          colors={[[147, 51, 234], [196, 181, 253]]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="text-white/90 text-sm">
              Technologies used in this role
            </p>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.slice(0, 6).map((tech, index) => (
                <Badge 
                  key={index}
                  className="text-xs bg-white/20 text-white border-white/30"
                >
                  {tech}
                </Badge>
              ))}
              {experience.technologies.length > 6 && (
                <Badge className="text-xs bg-white/20 text-white border-white/30">
                  +{experience.technologies.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        </CanvasCard>

        {/* Quick Actions Card */}
        <CanvasCard
          title="Quick Actions"
          icon={<Rocket className="h-6 w-6 text-emerald-400" />}
          animationSpeed={2.5}
          containerClassName="bg-emerald-900"
          colors={[[34, 197, 94], [16, 185, 129]]}
          dotSize={2}
        >
          <div className="space-y-4">
            <p className="text-white/90 text-sm">
              Share or copy experience details
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={onShare}
                className="justify-center hover:bg-white/20 text-xs border-white/30 hover:border-white/50 text-white"
                size="sm"
                disabled={shareClicked}
              >
                <Share2 className="w-3 h-3 mr-1" />
                {shareClicked ? 'Copied!' : 'Share'}
              </Button>
              
              <Button
                variant="outline"
                onClick={onCopyMarkdown}
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

        {/* Experience Highlights */}
        <CanvasCard
          animationSpeed={4}
          title="Experience Highlights"
          icon={<Star className="h-6 w-6 text-amber-400" />}
          containerClassName="bg-amber-900"
          colors={[[245, 158, 11], [217, 119, 6]]}
          dotSize={2}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  {experience.technologies.length}
                </div>
                <div className="text-xs text-white/70">
                  Technologies
                </div>
              </div>
              
              <div className="text-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">
                  {experience.projects.length}
                </div>
                <div className="text-xs text-white/70">
                  Projects
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-white">Features:</div>
              <div className="flex flex-wrap gap-2">
                {experience.certificate_url && (
                  <Badge className="text-xs bg-white/20 text-white border-white/30">
                    ✓ Certified
                  </Badge>
                )}
                {experience.projects.length > 0 && (
                  <Badge className="text-xs bg-white/20 text-white border-white/30">
                    ✓ Projects
                  </Badge>
                )}
                {experience.images.length > 0 && (
                  <Badge className="text-xs bg-white/20 text-white border-white/30">
                    ✓ Media
                  </Badge>
                )}
                {experience.technologies.length > 5 && (
                  <Badge className="text-xs bg-white/20 text-white border-white/30">
                    ✓ Multi-tech
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CanvasCard>
      </div>
    </div>
  );
}
