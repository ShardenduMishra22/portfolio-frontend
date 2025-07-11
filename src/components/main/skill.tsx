import { Badge } from '../ui/badge'
import { Code, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface SkillsSectionProps {
  skills: string[]
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 48
  const totalPages = Math.ceil(skills.length / itemsPerPage)
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSkills = skills.slice(startIndex, endIndex)
  
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
  
  return (
    <section className="relative py-12 sm:py-16 bg-card overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
      </div>
      
      {/* Floating elements - more subtle */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors">
            <Code className="mr-2 h-4 w-4 text-primary" />
            <span className="text-card-foreground">Technical Expertise</span>
          </Badge>
          
          <div className="relative">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-2">
              <span className="text-foreground">Technical </span>
              <span className="text-primary">Skills</span>
            </h2>
            <Zap className="absolute -top-1 -right-12 h-6 w-6 text-secondary animate-pulse" />
          </div>
          
          <p className="mt-8 text-lg leading-8 text-foreground max-w-lg mx-auto">
            Technologies and tools I work with to bring ideas to life
          </p>
          
          {/* Skills counter */}
          <div className="mt-4 text-sm text-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, skills.length)} of {skills.length} skills
          </div>
        </div>
        
        <div className="mx-auto mt-20 max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentSkills.map((skill, index) => (
              <div key={startIndex + index} className="group relative">
                <Badge 
                  variant="secondary" 
                  className="relative w-full justify-center py-3 px-4 text-sm font-medium transition-all duration-300 hover:scale-105 cursor-default bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border border-secondary/20 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10"
                >
                  <span className="relative z-10 text-foreground group-hover:text-foreground">
                    {skill}
                  </span>
                </Badge>
                
                {/* Subtle hover indicator */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination */}
        {skills.length > 24 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/10 hover:border-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'text-foreground hover:bg-secondary/10 hover:text-secondary-foreground'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-lg hover:bg-secondary/10 hover:border-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
        
        {/* Professional accent line */}
        <div className="mt-20 flex justify-center">
          <div className="w-24 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60" />
        </div>
      </div>
    </section>
  )
}