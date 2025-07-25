import toast from 'react-hot-toast'
import { useIntersectionObserver } from './obs'
import { Certification } from '@/data/types.data'
import CertificationsSection from '../main/certificate'
import { CertificationsSkeleton } from '../main/loading'
import { certificationsAPI } from '@/util/apiResponse.util'
import { useCallback, useEffect, useRef, useState } from 'react'

export const LazyCertificationsSection = () => {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { hasBeenVisible } = useIntersectionObserver(sectionRef as React.RefObject<Element>, {
    threshold: 0.1,
    rootMargin: '200px',
  })

  const fetchCertifications = useCallback(async () => {
    if (loaded || loading) return

    setLoading(true)
    try {
      const certificationsRes = await certificationsAPI.getAllCertifications()
      setCertifications(Array.isArray(certificationsRes.data) ? certificationsRes.data : [])
      setLoaded(true)
      toast.success('Certifications loaded!')
    } catch (err) {
      toast.error('Failed to load certifications')
      console.error('Certifications fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded, loading])

  useEffect(() => {
    if (hasBeenVisible && !loaded) {
      fetchCertifications()
    }
  }, [hasBeenVisible, loaded, fetchCertifications])

  return (
    <div ref={sectionRef} className="scroll-mt-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-50 pointer-events-none" />
      {loading ? (
        <CertificationsSkeleton />
      ) : loaded ? (
        <CertificationsSection certifications={certifications} />
      ) : (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Loading certifications...</div>
        </div>
      )}
    </div>
  )
}
