import { Badge } from '../ui/badge'
import { Code, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Vortex } from '../ui/vortex'

interface SkillsSectionProps {
  skills: string[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)

  // Responsive items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 8 // Mobile
      if (window.innerWidth < 1024) return 12 // Tablet
      return 18 // Desktop
    }
    return 12
  }

  const [itemsPerPage] = useState(getItemsPerPage())

  const { totalPages, currentSkills, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.ceil(skills.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSkills = skills.slice(startIndex, endIndex)

    return { totalPages, currentSkills, startIndex, endIndex }
  }, [skills, itemsPerPage, currentPage])

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Generate visible page numbers for mobile-friendly pagination
  const getVisiblePages = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      if (totalPages > 1) rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge
              variant="outline"
              className="mb-4 sm:mb-6 px-3 py-1.5 sm:px-4 sm:py-2 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors"
            >
              <Code className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm text-card-foreground">Technical Expertise</span>
            </Badge>
            <br />

            <div className="relative inline-block">
              <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold tracking-tight mb-2">
                <span className="text-foreground">Technical </span>
                <span className="text-primary">Skills</span>
              </h2>
              <Zap className="absolute -top-0.5 -right-6 sm:-right-12 h-4 w-4 sm:h-6 sm:w-6 text-secondary animate-pulse" />
            </div>

            <p className="mt-4 sm:mt-8 text-sm sm:text-lg leading-6 sm:leading-8 text-foreground max-w-xs sm:max-w-lg mx-auto px-4 sm:px-0">
              Technologies and tools I work with to bring ideas to life
            </p>

            {/* Skills counter - more compact on mobile */}
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-foreground/70">
              Showing {startIndex + 1}-{Math.min(endIndex, skills.length)} of {skills.length} skills
            </div>
          </div>

          {/* Responsive grid - improved mobile layout */}
          <div className="mx-auto mt-8 sm:mt-16 lg:mt-20 max-w-6xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {currentSkills.map((skill, index) => (
                <div key={startIndex + index} className="group relative">
                  <Badge
                    variant="secondary"
                    className="relative w-full justify-center py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 min-h-[2.5rem] sm:min-h-[3rem] flex items-center"
                  >
                    <span className="relative z-10 text-foreground group-hover:text-foreground text-center leading-tight">
                      {skill}
                    </span>
                  </Badge>

                  {/* Hover indicator */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced mobile-friendly pagination */}
          {totalPages > 1 && (
            <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Mobile: Stack buttons vertically for better touch targets */}
              <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-none">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/10 hover:border-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[2.5rem] touch-manipulation"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:block">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/10 hover:border-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-h-[2.5rem] touch-manipulation"
                  aria-label="Next page"
                >
                  <span className="hidden sm:block">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </button>
              </div>

              {/* Page numbers - responsive design */}
              <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-none">
                {getVisiblePages().map((pageNumber, index) => {
                  if (pageNumber === '...') {
                    return (
                      <span
                        key={`dots-${index}`}
                        className="px-2 py-2 text-xs sm:text-sm text-foreground/50"
                      >
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber as number)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation ${
                        currentPage === pageNumber
                          ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                          : 'text-foreground hover:bg-secondary/10 hover:text-secondary-foreground hover:scale-105'
                      }`}
                      aria-label={`Go to page ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              {/* Page indicator for mobile */}
              <div className="text-xs text-foreground/70 sm:hidden order-3">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}

          {/* Professional accent line */}
          <div className="mt-12 sm:mt-20 flex justify-center">
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60" />
          </div>
        </div>
      </Vortex>
    </section>
  )
}
