import { Project } from '@/data/types.data';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function useProjectShare(project: Project | null) {
  const [shareClicked, setShareClicked] = useState(false);

  const handleShare = async () => {
    if (!project) return;
    
    setShareClicked(true);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.project_name,
          text: project.small_description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      toast.success('Project link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
    
    setTimeout(() => setShareClicked(false), 1500);
  };

  return { handleShare, shareClicked };
}
