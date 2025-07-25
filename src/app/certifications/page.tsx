'use client'

import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Award } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Certification } from '@/data/types.data'
import { certificationsAPI } from '@/util/apiResponse.util'
import { EmptyState, ErrorState, LoadingState } from '@/components/certificate/load-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CertificationPagination from '@/components/certificate/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CertificationGrid from '@/components/certificate/grid'

export default function CertificationPageContent() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const certificationsPerPage = 6
  const [selectedSkill, setSelectedSkill] = useState<string>('__all__')
  const [selectedIssuer, setSelectedIssuer] = useState<string>('__all__')
  const [selectedYear, setSelectedYear] = useState<string>('__all__')
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search')?.toLowerCase() || ''
  const [searchTerm, setSearchTerm] = useState(initialSearch)

  const allSkills = Array.from(new Set(certifications.flatMap((c) => c.skills)))
  const allIssuers = Array.from(new Set(certifications.map((c) => c.issuer)))
  const allYears = Array.from(
    new Set(
      certifications.map((c) =>
        c.issue_date ? new Date(c.issue_date).getFullYear().toString() : ''
      )
    )
  ).filter(Boolean)

  const filteredCertifications = certifications.filter((certification) => {
    const matchesSkill =
      selectedSkill !== '__all__' ? certification.skills.includes(selectedSkill) : true
    const matchesIssuer =
      selectedIssuer !== '__all__' ? certification.issuer === selectedIssuer : true
    const matchesYear =
      selectedYear !== '__all__'
        ? certification.issue_date &&
          new Date(certification.issue_date).getFullYear().toString() === selectedYear
        : true
    const matchesSearch =
      searchTerm === '' ||
      certification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certification.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesSkill && matchesIssuer && matchesYear && matchesSearch
  })

  const totalPages = Math.ceil(filteredCertifications.length / certificationsPerPage)
  const startIndex = (currentPage - 1) * certificationsPerPage
  const endIndex = startIndex + certificationsPerPage
  const currentCertifications = filteredCertifications.slice(startIndex, endIndex)

  const transformedCertifications = currentCertifications.map((certification) => ({
    title: certification.title,
    issuer: certification.issuer,
    description: certification.description,
    link: `/certifications/${certification.inline?.id || certification.inline.id}`,
    skills: certification.skills,
    certificateUrl: certification.certificate_url,
    issueDate: certification.issue_date,
  }))

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await certificationsAPI.getAllCertifications()
        setCertifications(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError('Failed to load certifications')
      } finally {
        setLoading(false)
      }
    }
    fetchCertifications()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set('search', value)
    } else {
      params.delete('search')
    }
    router.push(`?${params.toString()}`)
  }

  // Loading state
  if (loading) {
    return <LoadingState />
  }

  // Error state
  if (error) {
    toast.error(error, {
      style: { zIndex: 30 },
    })
    return <ErrorState error={error} />
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Top Header Bar - Left: Title, Middle: Search, Right: Navigation */}
        <div className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4 max-w-full">
            <div className="flex items-center justify-between gap-8">
              {/* Left Side: Back Button + Title + Stats */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <Link href="/">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-muted"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
                      Certifications
                    </h1>
                  </div>

                  {/* Compact Stats */}
                  <div className="hidden lg:flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-primary">{certifications.length}</span>
                      <span className="text-muted-foreground">Total</span>
                    </div>
                    <div className="w-px h-4 bg-border" />
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-secondary">{currentPage}</span>
                      <span className="text-muted-foreground">of</span>
                      <span className="font-semibold text-secondary">{totalPages}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center: Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <Input
                  type="text"
                  placeholder="Search certifications..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 w-full border-2 border-border/50 hover:border-primary/50 focus:border-primary transition-colors bg-background/50"
                />
              </div>

              {/* Right Side: Pagination */}
              <div className="flex-shrink-0">
                {totalPages > 1 && (
                  <CertificationPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={filteredCertifications.length}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Filter Bar */}
        <div className="border-b border-border/30 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-3 max-w-full">
            <div className="flex items-center justify-center gap-4">
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Skills</SelectItem>
                  {allSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedIssuer} onValueChange={setSelectedIssuer}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Issuer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Issuers</SelectItem>
                  {allIssuers.map((issuer) => (
                    <SelectItem key={issuer} value={issuer}>
                      {issuer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Years</SelectItem>
                  {allYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedSkill !== '__all__' ||
                selectedIssuer !== '__all__' ||
                selectedYear !== '__all__') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSelectedSkill('__all__')
                    setSelectedIssuer('__all__')
                    setSelectedYear('__all__')
                  }}
                  className="h-9"
                >
                  Clear Filters
                </Button>
              )}

              {/* Mobile Stats */}
              <div className="lg:hidden flex items-center gap-3 text-sm ml-4">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-primary">{certifications.length}</span>
                  <span className="text-muted-foreground">Total</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-secondary">{currentPage}</span>
                  <span className="text-muted-foreground">of</span>
                  <span className="font-semibold text-secondary">{totalPages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-6 py-8 max-w-full">
            {certifications.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <EmptyState />
              </div>
            ) : (
              <div className="mb-8">
                <CertificationGrid
                  items={transformedCertifications}
                  className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                />
              </div>
            )}

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-border/30 text-sm text-muted-foreground">
              <p>
                Showing {filteredCertifications.length === 0 ? 0 : startIndex + 1}-
                {Math.min(endIndex, filteredCertifications.length)} of{' '}
                {filteredCertifications.length} certifications
              </p>
              <p className="text-xs">Verified credentials and professional achievements</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}
