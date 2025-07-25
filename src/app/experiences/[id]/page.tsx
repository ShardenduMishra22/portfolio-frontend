'use client'

import { ErrorState } from '@/components/Experience/ErrorState'
import { LoadingState } from '@/components/Experience/LoadingState'
import { ExperienceHero } from '@/components/Experience/ExperienceHero'
import { ExperienceMedia } from '@/components/Experience/ExperienceMedia'
import { useExperience } from '@/components/Experience/hooks/useExperience'
import { ExperienceSidebar } from '@/components/Experience/ExperienceSidebar'
import { ExperienceProjects } from '@/components/Experience/ExperienceProjects'
import { ExperienceNavigation } from '@/components/Experience/ExperienceNavigation'
import { useExperienceShare } from '@/components/Experience/hooks/useExperienceShare'
import { ExperienceDescription } from '@/components/Experience/ExperienceDescription'
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
