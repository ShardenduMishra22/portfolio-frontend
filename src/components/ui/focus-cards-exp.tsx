'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Badge } from './badge'
import { Button } from './button'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Experience } from '@/data/types.data'
import { Card, CardDescription, CardTitle } from './card'
import { Award, ArrowRight, Building2, Calendar } from 'lucide-react'

export const ExperienceFocusCard = React.memo(
  ({
    exp,
    index,
    hovered,
    setHovered,
    startIndex,
    isMobile,
  }: {
    exp: Experience
    index: number
    hovered: number | null
    setHovered: React.Dispatch<React.SetStateAction<number | null>>
    startIndex: number
    isMobile: boolean
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        'transition-all duration-300 ease-out',
        hovered !== null && hovered !== index && 'blur-sm scale-[0.98] opacity-70'
      )}
    >
      <Card className="group relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100 min-h-[500px] sm:min-h-[420px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Experience number badge */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-lg sm:shadow-xl border border-primary/20 sm:border-2">
          {String(startIndex + index + 1).padStart(2, '0')}
        </div>

        <div className="relative z-10 p-4 sm:p-6 lg:p-8 h-full flex flex-col">
          <div className="flex-1 space-y-4 sm:space-y-6">
            <div className="pr-10 sm:pr-12">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold group-hover:text-primary transition-colors duration-300 leading-tight mb-2 sm:mb-4">
                {exp.position}
              </CardTitle>
              <CardDescription className="font-medium sm:font-semibold text-sm sm:text-base lg:text-lg text-foreground/80 flex items-center mb-3 sm:mb-4">
                <Building2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-primary/70 flex-shrink-0" />
                <span className="truncate">{exp.company_name}</span>
              </CardDescription>
              <div className="flex items-center text-xs sm:text-sm text-foreground/60 bg-secondary/5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-secondary/20">
                <Calendar className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-primary/60 flex-shrink-0" />
                <span className="truncate">
                  {new Date(exp.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}{' '}
                  -{' '}
                  {new Date(exp.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="text-foreground/80 leading-relaxed text-xs sm:text-sm lg:text-base">
                <div className="prose-md">
                  <ReactMarkdown>
                    {isMobile && exp.description.length > 120
                      ? `${exp.description.substring(0, 120)}...`
                      : exp.description.length > 150
                        ? `${exp.description.substring(0, 150)}...`
                        : exp.description}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {exp.technologies.slice(0, isMobile ? 3 : 4).map((tech, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors font-medium"
                  >
                    {tech}
                  </Badge>
                ))}
                {exp.technologies.length > (isMobile ? 3 : 4) && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors font-medium"
                  >
                    +{exp.technologies.length - (isMobile ? 3 : 4)} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
            <Link href={`/experiences/${exp.inline?.id || exp.inline.id}`} className="w-full">
              <Button
                size={isMobile ? 'sm' : 'default'}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 font-semibold touch-manipulation"
              >
                <span className="text-xs sm:text-sm">View Details</span>
                <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {exp.certificate_url ? (
              <Link
                href={exp.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="outline"
                  size={isMobile ? 'sm' : 'default'}
                  className="w-full text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md touch-manipulation"
                >
                  <Award className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Certificate</span>
                </Button>
              </Link>
            ) : (
              <Link href={'#'} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button
                  variant="outline"
                  size={isMobile ? 'sm' : 'default'}
                  className="w-full text-primary hover:text-primary/80 transition-colors bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/30 font-medium shadow-sm hover:shadow-md touch-manipulation"
                >
                  <Award className="mr-1.5 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">No Certificate</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
)

ExperienceFocusCard.displayName = 'ExperienceFocusCard'

export function ExperienceFocusCards({
  experiences,
  startIndex,
  isMobile,
}: {
  experiences: Experience[]
  startIndex: number
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="mx-auto mt-12 sm:mt-20 lg:mt-24 max-w-7xl">
      <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2">
        {experiences.map((exp, index) => (
          <ExperienceFocusCard
            key={exp.inline?.id || exp.inline.id}
            exp={exp}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
            startIndex={startIndex}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  )
}
