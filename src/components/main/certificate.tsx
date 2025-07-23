import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { Certification } from '@/data/types.data'
import { CertificationFocusCards } from '../ui/focus-cards'
import React, { useState, useMemo, useEffect } from 'react'
import { Award, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react'

interface CertificationsSectionProps {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
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
    if (windowWidth < 640) return 1  // Mobile: 1 certification
    if (windowWidth < 1024) return 2 // Tablet: 2 certifications
    return 2 // Desktop: 2 certifications
  }

  const itemsPerPage = getItemsPerPage()
  const totalPages = Math.ceil(certifications.length / itemsPerPage)

  const { currentPageCertifications, startIndex, endIndex } = useMemo(() => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, certifications.length)
    const currentPageCertifications = certifications.slice(startIndex, endIndex)
    
    return { currentPageCertifications, startIndex, endIndex }
  }, [certifications, currentPage, itemsPerPage])

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
    
    for (let i = Math.max(1, currentPage - delta); 
         i <= Math.min(totalPages - 2, currentPage + delta); 
         i++) {
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
    <section className="relative py-8 sm:py-12 lg:py-16 bg-background overflow-hidden">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* Responsive floating elements */}
      <div className="absolute top-16 sm:top-32 right-1/4 w-12 h-12 sm:w-20 sm:h-20 bg-primary/5 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
      <div className="absolute bottom-20 sm:bottom-40 left-1/4 w-10 h-10 sm:w-16 sm:h-16 bg-secondary/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4 sm:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors">
            <Award className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm text-card-foreground">Credentials</span>
          </Badge>
          <br />
          <div className="relative inline-block">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-2">
              <span className="text-foreground">Professional </span>
              <span className="text-primary">Certifications</span>
            </h2>
            <Star className="absolute -top-0.5 -right-8 sm:-right-16 h-4 w-4 sm:h-6 sm:w-6 text-secondary animate-pulse" />
          </div>

          <p className="mt-4 sm:mt-8 text-sm sm:text-lg leading-6 sm:leading-8 text-foreground max-w-xs sm:max-w-lg mx-auto px-4 sm:px-0">
            Professional certifications and credentials that validate my expertise
          </p>

          {/* Summary info */}
          {certifications.length > 0 && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-foreground/70">
              Showing {startIndex + 1}-{Math.min(endIndex, certifications.length)} of {certifications.length} certifications
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Navigation buttons */}
            <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-none">
              <Button
                onClick={prevPage}
                variant="outline"
                size={isMobile ? "sm" : "lg"}
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 touch-manipulation"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs sm:text-sm">
                  {isMobile ? 'Prev' : 'Previous'}
                </span>
              </Button>

              <Button
                onClick={nextPage}
                variant="outline"
                size={isMobile ? "sm" : "lg"}
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300 touch-manipulation"
                disabled={currentPage === totalPages - 1}
              >
                <span className="text-xs sm:text-sm">Next</span>
                <ChevronRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Page numbers */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 order-1 sm:order-none">
              {getVisiblePageNumbers().map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span key={`dots-${index}`} className="px-2 py-1 text-xs sm:text-sm text-foreground/50">
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

        {/* Replace the existing grid with CertificationFocusCards */}
        {certifications.length === 0 ? (
          <div className="mx-auto mt-8 sm:mt-16 lg:mt-20 grid max-w-2xl grid-cols-1 gap-4 sm:gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <Card className="col-span-full bg-gradient-to-br from-muted/20 to-muted/10 border-dashed border-2 border-muted/40 hover:border-primary/30 transition-all duration-300">
              <CardContent className="text-center py-12 sm:py-20 px-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Award className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">No certifications yet</h3>
                <p className="text-sm sm:text-base text-foreground mb-4 sm:mb-6 max-w-sm sm:max-w-md mx-auto">
                  Professional certifications will appear here when earned and added to the portfolio.
                </p>
                <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>
        ) : (
          <CertificationFocusCards 
            certifications={currentPageCertifications}
            startIndex={startIndex}
            isMobile={isMobile}
          />
        )}

        {certifications.length > itemsPerPage && (
          <div className="mt-12 sm:mt-20 text-center px-4 sm:px-0">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-card via-card/90 to-card rounded-xl sm:rounded-2xl border border-border/50 backdrop-blur-sm shadow-lg max-w-sm sm:max-w-none mx-auto">
              <div className="text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">More Certifications</h3>
                <p className="text-xs sm:text-sm text-foreground/70 mt-1">
                  Explore {certifications.length - itemsPerPage} additional certifications
                </p>
              </div>
              <Link href="/certifications">
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "lg"}
                  className="group bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:border-primary/50 transition-all duration-300 touch-manipulation"
                >
                  <span className="text-xs sm:text-sm">View All</span>
                  <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Professional accent line */}
        <div className="mt-12 sm:mt-20 flex justify-center">
          <div className="w-20 sm:w-32 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-60" />
        </div>
      </div>
    </section>
  )
}
