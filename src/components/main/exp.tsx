import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Award, ArrowRight, Building2, Calendar, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { Experience } from '@/data/types.data'
import { useState } from 'react'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(experiences.length / itemsPerPage)

  const getCurrentPageExperiences = () =>
    experiences.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1)
  }

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-card via-card/90 to-secondary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,theme(colors.primary/4),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,theme(colors.secondary/4),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,theme(colors.accent/2),transparent_80%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex justify-center mb-8">
            <Badge variant="outline" className="px-6 py-3 text-sm font-medium border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 shadow-lg backdrop-blur-sm">
              <Briefcase className="mr-2 h-4 w-4 text-primary" />
              Professional Journey
            </Badge>
          </div>

          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Work
            </span>{' '}
            <span className="text-foreground">Experience</span>
          </h2>

          <div className="mx-auto w-32 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg"></div>

          <p className="mt-8 text-xl leading-8 text-foreground/80 max-w-3xl mx-auto font-medium">
            My professional journey and contributions across different organizations,
            showcasing growth and expertise in various domains
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            {getCurrentPageExperiences().map((exp, idx) => (
              <Card key={exp.inline?.id || exp.inline.id} className="group relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100 min-h-[420px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-xl border-2 border-primary/20">
                  {String(currentPage * itemsPerPage + idx + 1).padStart(2, '0')}
                </div>

                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="flex-1 space-y-6">
                    <div className="pr-12">
                      <CardTitle className="text-2xl lg:text-3xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight mb-4">
                        {exp.position}
                      </CardTitle>
                      <CardDescription className="font-semibold text-lg text-foreground/80 flex items-center mb-4">
                        <Building2 className="mr-3 h-5 w-5 text-primary/70" />
                        {exp.company_name}
                      </CardDescription>
                      <div className="flex items-center text-sm text-foreground/60 bg-secondary/5 px-3 py-2 rounded-lg border border-secondary/20">
                        <Calendar className="mr-2 h-4 w-4 text-primary/60" />
                        {new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{' '}
                        {new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-foreground/70 leading-relaxed text-base">
                        {exp.description.length > 150 ? `${exp.description.substring(0, 150)}...` : exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(0, 4).map((tech, i) => (
                          <Badge key={i} variant="outline" className="text-xs px-3 py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors font-medium">
                            {tech}
                          </Badge>
                        ))}
                        {exp.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs px-3 py-1 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors font-medium">
                            +{exp.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <Link href={`/experiences/${exp.inline?.id || exp.inline.id}`} className="w-full">
                      <Button
                        size="default"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold"
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>

                    {exp.certificate_url && (
                      <a href={exp.certificate_url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                          variant="outline"
                          size="default"
                          className="w-full text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Certificate
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-6">
              <Button
                onClick={prevPage}
                variant="outline"
                size="lg"
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300"
                disabled={currentPage === 0}
              >
                <ChevronLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                      currentPage === i
                        ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                        : 'bg-card hover:bg-primary/5 border border-primary/20 hover:border-primary/30 text-foreground/70 hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <Button
                onClick={nextPage}
                variant="outline"
                size="lg"
                className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300"
                disabled={currentPage === totalPages - 1}
              >
                Next
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-foreground/60 text-sm">
              Showing {getCurrentPageExperiences().length} of {experiences.length} experiences
            </p>
          </div>

          {experiences.length > 4 && (
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-card via-card/90 to-card rounded-2xl border border-border/50 backdrop-blur-sm shadow-lg">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">More experiences</h3>
                  <p className="text-sm text-foreground/70 mt-1">
                    Explore {experiences.length - 4} additional experiences
                  </p>
                </div>
                <Link href="/experiences">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:border-primary/50 transition-all duration-300"
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}