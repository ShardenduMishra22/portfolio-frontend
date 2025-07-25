'use client'

import { ErrorState } from '@/components/experience/ErrorState'
import { LoadingState } from '@/components/experience/LoadingState'
import { ExperienceHero } from '@/components/experience/ExperienceHero'
import { ExperienceMedia } from '@/components/experience/ExperienceMedia'
import { useExperience } from '@/components/experience/hooks/useExperience'
import { ExperienceSidebar } from '@/components/experience/ExperienceSidebar'
import { ExperienceProjects } from '@/components/experience/ExperienceProjects'
import { ExperienceNavigation } from '@/components/experience/ExperienceNavigation'
import { useExperienceShare } from '@/components/experience/hooks/useExperienceShare'
import { ExperienceDescription } from '@/components/experience/ExperienceDescription'
import { cn } from '@/lib/utils'

export default function ExperienceDetailPage({ params }: { params: any }) {
  const { experience, loading, error } = useExperience(params.id)
  const { handleShare, handleCopyMarkdown, shareClicked, copyClicked } =
    useExperienceShare(experience)

  if (loading) return <LoadingState />
  if (error || !experience) return <ErrorState error={error} />

  return (
    <div className="min-h-screen bg-background">
      <ExperienceNavigation experience={experience} />

      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <ExperienceHero experience={experience} />

        <div className="grid lg:grid-cols-3 gap-8 mb-12 w-full">
          <ExperienceSidebar
            experience={experience}
            onShare={handleShare}
            onCopyMarkdown={handleCopyMarkdown}
            shareClicked={shareClicked}
            copyClicked={copyClicked}
          />

          <div className="lg:col-span-2 space-y-8">
            <ExperienceDescription experience={experience} />
            <ExperienceMedia experience={experience} />
            <ExperienceProjects experience={experience} />
          </div>
        </div>
      </main>
    </div>
  )
}
