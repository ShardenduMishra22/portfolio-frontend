'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2 } from 'lucide-react'
import { Experience } from '@/data/types.data'

interface ExperienceNavigationProps {
  experience: Experience
}

export function ExperienceNavigation({ experience }: ExperienceNavigationProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 2) {
      router.back()
    } else {
      router.push('/experiences')
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back</span>
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>{experience.company_name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
