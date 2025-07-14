import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Award, Clock, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { Certification } from '@/data/types.data'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

interface CertificationsSectionProps {
  certifications: Certification[]
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(certifications.length / itemsPerPage)

  const getCurrentPageCertifications = () =>
    certifications.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1)
  }

  return (
    <section className="relative py-12 sm:py-16 bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(30deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%,transparent_100%)] bg-[length:30px_30px]" />
      </div>

      {/* Floating elements */}
      <div className="absolute top-32 right-1/4 w-20 h-20 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-6 px-4 py-2 bg-card/80 backdrop-blur-sm border-primary/30 hover:border-primary/50 transition-colors">
            <Award className="mr-2 h-4 w-4 text-primary" />
            <span className="text-card-foreground">Credentials</span>
          </Badge>

          <div className="relative">
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl mb-2">
              <span className="text-foreground">Professional </span>
              <span className="text-primary">Certifications</span>
            </h2>
            <Star className="absolute -top-1 -right-16 h-6 w-6 text-secondary animate-pulse" />
          </div>

          <p className="mt-8 text-lg leading-8 text-foreground max-w-lg mx-auto">
            Professional certifications and credentials that validate my expertise
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {certifications.length === 0 ? (
            <Card className="col-span-full bg-gradient-to-br from-muted/20 to-muted/10 border-dashed border-2 border-muted/40 hover:border-primary/30 transition-all duration-300">
              <CardContent className="text-center py-20">
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-10 w-10 text-primary" />
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No certifications yet</h3>
                <p className="text-foreground mb-6 max-w-md mx-auto">
                  Professional certifications will appear here when earned and added to the portfolio.
                </p>
                <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          ) : (
            getCurrentPageCertifications().map((cert) => (
              <Card
                key={cert.inline?.id || cert.inline.id}
                className="group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300 leading-tight">
                        {cert.title}
                      </CardTitle>
                      <CardDescription className="mt-1 text-foreground font-medium">
                        {cert.issuer}
                      </CardDescription>
                      <div className="flex items-center mt-2 text-sm text-foreground bg-muted/30 px-2 py-1 rounded-full w-fit">
                        <Clock className="mr-2 h-3 w-3" />
                        {cert.issue_date} 
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 relative z-10">
                  <ReactMarkdown >
                    {cert.description.length > 120 ? `${cert.description.substring(0, 120)}...` : cert.description}
                  </ReactMarkdown>

                  <div className="flex flex-wrap gap-2">
                    {cert.skills.slice(0, 4).map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="text-xs bg-secondary/5 hover:bg-secondary/10 border-secondary/20 text-foreground transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {cert.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-foreground">
                        +{cert.skills.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30">
                    <Link href={`/certifications/${cert.inline?.id || cert.inline.id}`}>
                      <Button variant="outline" className="group/btn hover:bg-primary/10 hover:border-primary/30 transition-all duration-300">
                        <span className="text-foreground">View Details</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>

                    {cert.certificate_url && (
                      <a
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg hover:bg-primary/10"
                      >
                        <Award className="mr-1 h-4 w-4" />
                        Certificate
                      </a>
                    )}
                  </div>
                </CardContent>

                {/* Hover border effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
              </Card>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Button
              onClick={prevPage}
              variant="outline"
              size="lg"
              className="group bg-card hover:bg-primary/5 border-primary/20 hover:border-primary/30 transition-all duration-300"
              disabled={currentPage === 0}
            >
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
            </Button>
          </div>
        )}

          {certifications.length > 4 && (
            <div className="mt-20 text-center">
              <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-r from-card via-card/90 to-card rounded-2xl border border-border/50 backdrop-blur-sm shadow-lg">
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground">More certifications</h3>
                  <p className="text-sm text-foreground/70 mt-1">
                    Explore {certifications.length - 4} additional certifications
                  </p>
                </div>
                <Link href="/certifications">
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

        {/* Professional accent line */}
        <div className="mt-20 flex justify-center">
          <div className="w-32 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-60" />
        </div>
      </div>
    </section>
  )
}