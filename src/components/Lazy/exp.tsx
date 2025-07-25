import toast from "react-hot-toast"
import ExperienceSection from "../main/exp"
import { Experience } from "@/data/types.data"
import { useIntersectionObserver } from "./obs"
import { ExperienceSkeleton } from "../main/loading"
import { experiencesAPI } from "@/util/apiResponse.util"
import { useCallback, useEffect, useRef, useState } from "react"

export const LazyExperienceSection = () => {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.1,
    rootMargin: '200px'
  })

  const fetchExperiences = useCallback(async () => {
    if (loaded || loading) return
    
    setLoading(true)
    try {
      const experiencesRes = await experiencesAPI.getAllExperiences()
      setExperiences(Array.isArray(experiencesRes.data) ? experiencesRes.data : [])
      setLoaded(true)
      toast.success('Experiences loaded!')
    } catch (err) {
      toast.error('Failed to load experiences')
      console.error('Experiences fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      fetchExperiences()
    }
  }, [hasBeenVisible, loaded, fetchExperiences])

  return (
    <div ref={sectionRef} className="scroll-mt-20 relative bg-white dark:bg-black">
      {loading ? (
        <ExperienceSkeleton />
      ) : loaded ? (
        <ExperienceSection experiences={experiences} />
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading experiences...</div>
        </div>
      )}
    </div>
  )
}