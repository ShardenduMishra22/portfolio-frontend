import React from 'react';
import { ExternalLink, ImageIcon, Play } from 'lucide-react';
import { Certification } from '@/data/types.data';
import { getYouTubeEmbedUrl, isGitHubUrl, isYouTubeUrl } from './utils/urlHelpers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface MediaSectionProps {
  certification: Certification;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ certification }) => {
  const filteredImages = certification.images?.filter(src => !isGitHubUrl(src)) || [];

  if (filteredImages.length === 0) {
    return null;
  }

  return (
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
          {filteredImages.map((src, i) => (
            <div key={i} className="space-y-2">
              {isYouTubeUrl(src) ? (
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
  );
};
