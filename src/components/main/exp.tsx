import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Experience } from '@/data/types.data'
import React, { useState, useMemo, useEffect } from 'react'
import { ExperienceFocusCards } from '../ui/focus-cards-exp'
import { ArrowRight, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive items per page
  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1 // Mobile: 1 experience
    if (windowWidth < 1024) return 2 // Tablet: 2 experiences
    return 2 // Desktop: 2 experiences
  }

  const itemsPerPage = getItemsPerPage()
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  const { currentPageExperiences, startIndex, endIndex } = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, experiences.length)
    const currentPageExperiences = experiences.slice(startIndex, endIndex)

    return { currentPageExperiences, startIndex, endIndex }
  }, [experiences, currentPage, itemsPerPage])

  // Reset to first page when screen size changes
  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1)
  }

  // Smart pagination for mobile
  const getVisiblePageNumbers = () => {
    if (windowWidth < 640) {
      // Mobile: Show current and adjacent pages only
      const pages = []
      if (currentPage > 0) pages.push(currentPage - 1)
      pages.push(currentPage)
      if (currentPage < totalPages - 1) pages.push(currentPage + 1)
      return pages
    }

    // Desktop: Show all pages if reasonable, otherwise use ellipsis
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i)
    }

    const delta = 1
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages - 2, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 1) {
      rangeWithDots.push(0, '...')
    } else {
      rangeWithDots.push(0)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 2) {
      rangeWithDots.push('...', totalPages - 1)
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages - 1)
    }

    return rangeWithDots
  }

  const isMobile = windowWidth < 640

  return (
    <section className="relative overflow-hidden">
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:20px_20px]',
          '[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]',
          'dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]'
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Badge
              variant="outline"
              className="px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <Briefcase className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              Professional Journey
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Work
            </span>{' '}
            <span className="text-foreground">Experience</span>
          </h2>

          <div className="mx-auto w-20 sm:w-32 h-1 sm:h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg"></div>

          <p className="mt-4 sm:mt-8 text-sm sm:text-lg lg:text-xl leading-6 sm:leading-8 text-foreground/80 max-w-xl sm:max-w-3xl mx-auto font-medium px-4 sm:px-0">
            My professional journey and contributions across different organizations, showcasing
            growth and expertise in various domains
          </p>

          {/* Summary info */}
          {experiences.length > 0 && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-foreground/70">
              Showing {startIndex + 1}-{Math.min(endIndex, experiences.length)} of{' '}
              {experiences.length} experiences
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            {/* Navigation buttons */}
            <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-none">
              <Button
                onClick={prevPage}
                variant="outline"
                size={isMobile ? 'sm' : 'lg'}
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 touch-manipulation"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs sm:text-sm">{isMobile ? 'Prev' : 'Previous'}</span>
              </Button>

              <Button
                onClick={nextPage}
                variant="outline"
                size={isMobile ? 'sm' : 'lg'}
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 touch-manipulation"
                disabled={currentPage === totalPages - 1}
              >
                <span className="text-xs sm:text-sm">Next</span>
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 order-1 sm:order-none">
              {getVisiblePageNumbers().map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`dots-${index}`}
                      className="px-2 py-1 text-xs sm:text-sm text-foreground/50"
                    >
                      ...
                    </span>
                  )
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm touch-manipulation ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg scale-105'
                        : 'bg-card hover:bg-primary/5 border border-primary/20 hover:border-primary/30 text-foreground/70 hover:text-primary hover:scale-105'
                    }`}
                    aria-label={`Go to page ${(pageNum as number) + 1}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {(pageNum as number) + 1}
                  </button>
                )
              })}
            </div>

            {/* Mobile page indicator */}
            <div className="text-xs text-foreground/70 sm:hidden order-3">
              Page {currentPage + 1} of {totalPages}
            </div>
          </div>
        )}

        <ExperienceFocusCards
          experiences={currentPageExperiences}
          startIndex={startIndex}
          isMobile={isMobile}
        />

        {/* More experiences CTA - responsive */}
        {experiences.length > itemsPerPage && (
          <div className="mt-12 sm:mt-20 text-center px-4 sm:px-0">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-card via-card/90 to-card rounded-xl sm:rounded-2xl border border-border/50 backdrop-blur-sm shadow-lg max-w-sm sm:max-w-none mx-auto">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">
                  More Experiences
                </h3>
                <p className="text-xs sm:text-sm text-foreground/70 mt-1">
                  Explore {experiences.length - itemsPerPage} additional experiences
                </p>
              </div>
              <Link href="/experiences">
                <Button
                  variant="outline"
                  size={isMobile ? 'sm' : 'lg'}
                  className="group bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:border-primary/50 transition-all duration-300 touch-manipulation"
                >
                  <span className="text-xs sm:text-sm">View All</span>
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
