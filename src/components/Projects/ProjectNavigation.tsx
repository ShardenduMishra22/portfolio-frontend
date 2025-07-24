import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2, Check } from 'lucide-react';

interface ProjectNavigationProps {
  onShare: () => void;
  shareClicked: boolean;
  title?: string;
}

export function ProjectNavigation({ onShare, shareClicked, title }: ProjectNavigationProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/projects');
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center gap-2 text-muted-foreground hover:text-foreground",
                "transition-all duration-200 hover:bg-accent/50",
                "rounded-lg px-3 py-2 group"
              )}
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="font-medium">Back</span>
            </Button>
            
            {/* Optional breadcrumb */}
            {title && (
              <>
                <div className="w-px h-4 bg-border" />
                <span className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-none">
                  {title}
                </span>
              </>
            )}
          </div>

          {/* Right side - Share button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className={cn(
              "relative flex items-center gap-2 transition-all duration-300",
              "hover:bg-accent hover:border-accent-foreground/20",
              "rounded-lg px-4 py-2 min-w-[90px] justify-center",
              shareClicked && "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            )}
            disabled={shareClicked}
          >
            <div className="relative flex items-center gap-2">
              {shareClicked ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in-75 duration-200" />
                  <span className="font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 transition-transform hover:scale-110" />
                  <span className="font-medium">Share</span>
                </>
              )}
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
