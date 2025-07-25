import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ImageIcon, ExternalLink } from 'lucide-react'
import { Experience } from '@/data/types.data'

interface ExperienceMediaProps {
  experience: Experience
}

export function ExperienceMedia({ experience }: ExperienceMediaProps) {
  if (experience.images.length === 0) return null

  return (
    <Card className="border border-border/50 bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-3">
          <div className="w-1 h-5 bg-primary rounded-full" />
          Media & Highlights
        </CardTitle>
        <CardDescription>Visual content and embedded posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experience.images.map((src, i) => (
            <div key={i} className="space-y-2">
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
                      height: '250%',
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
