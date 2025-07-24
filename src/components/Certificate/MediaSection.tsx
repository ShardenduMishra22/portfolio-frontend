'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, ImageIcon, Play, Copy, Check } from 'lucide-react';
import { Certification } from '@/data/types.data';
import { getYouTubeEmbedUrl, isGitHubUrl, isYouTubeUrl } from './utils/urlHelpers';
import { CanvasCard } from './canva';


interface MediaSectionProps {
  certification: Certification;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ certification }) => {
  const [copyStates, setCopyStates] = useState<{ [key: number]: boolean }>({});
  const filteredImages = certification.images?.filter(src => !isGitHubUrl(src)) || [];

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyStates(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [index]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (filteredImages.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border/50 bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="w-1 h-5 bg-primary rounded-full" />
          Media & Highlights
        </CardTitle>
        <CardDescription>Visual content and embedded demonstrations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredImages.map((src, i) => (
            <CanvasCard
              key={i}
              title={isYouTubeUrl(src) ? "YouTube Video" : "Media Content"}
              icon={isYouTubeUrl(src) ? 
                <Play className="h-6 w-6 text-red-400" /> : 
                <ImageIcon className="h-6 w-6 text-purple-400" />
              }
              animationSpeed={2 + (i * 0.5)}
              containerClassName={isYouTubeUrl(src) ? "bg-red-900" : "bg-purple-900"}
              colors={isYouTubeUrl(src) ? 
                [[239, 68, 68], [248, 113, 113]] : 
                [[147, 51, 234], [196, 181, 253]]
              }
              dotSize={1.8}
            >
              <div className="space-y-4">
                <div className="w-full aspect-video bg-background/20 rounded-lg border border-white/20 overflow-hidden">
                  <iframe
                    src={isYouTubeUrl(src) ? (getYouTubeEmbedUrl(src) || src) : src}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allow={isYouTubeUrl(src) ? 
                      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" : 
                      undefined
                    }
                    allowFullScreen
                    title={`${isYouTubeUrl(src) ? 'YouTube video' : 'Media content'} ${i + 1}`}
                    className="w-full h-full"
                    style={!isYouTubeUrl(src) ? { 
                      transform: 'scale(0.45)',
                      transformOrigin: 'top left',
                      width: '220%',
                      height: '250%'
                    } : undefined}
                  />
                </div>
                
                <div className="flex justify-between items-center gap-2">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/30 text-white hover:bg-white/20 text-xs"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Full
                    </Button>
                  </a>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(src, i)}
                    className="border-white/30 text-white hover:bg-white/20 text-xs"
                    disabled={copyStates[i]}
                  >
                    {copyStates[i] ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-white/70 text-xs">
                  {isYouTubeUrl(src) ? 
                    "Interactive video demonstration" : 
                    "Embedded content preview"
                  }
                </div>
              </div>
            </CanvasCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
