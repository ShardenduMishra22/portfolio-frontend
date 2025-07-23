"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { Badge } from './badge'
import { Award, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Certification } from '@/data/types.data'
import ReactMarkdown from 'react-markdown'

export const CertificationFocusCard = React.memo(
  ({
    cert,
    index,
    hovered,
    setHovered,
    startIndex,
    isMobile,
  }: {
    cert: Certification;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    startIndex: number;
    isMobile: boolean;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-70"
      )}
    >
      <Card className="group relative overflow-hidden min-h-[20rem] hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Certificate number badge */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs sm:text-sm font-bold shadow-lg border border-primary/20">
          {String(startIndex + index + 1).padStart(2, '0')}
        </div>

        <CardHeader className="pb-3 relative z-10 pr-10 sm:pr-12">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300 leading-tight pr-2">
                {cert.title}
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base text-foreground font-medium">
                {cert.issuer}
              </CardDescription>
              <div className="flex items-center mt-2 text-xs sm:text-sm text-foreground bg-muted/30 px-2 py-1 rounded-full w-fit">
                <Clock className="mr-1.5 sm:mr-2 h-3 w-3" />
                {cert.issue_date}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 relative z-10 px-4 sm:px-6">
          <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <div className="prose-md">
              <ReactMarkdown>
                {isMobile && cert.description.length > 100
                  ? `${cert.description.substring(0, 100)}...`
                : cert.description.length > 120 
                ? `${cert.description.substring(0, 120)}...` 
                : cert.description}
              </ReactMarkdown>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {cert.skills.slice(0, isMobile ? 3 : 4).map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-secondary/5 hover:bg-secondary/10 border-secondary/20 text-foreground transition-colors"
              >
                {skill}
              </Badge>
            ))}
            {cert.skills.length > (isMobile ? 3 : 4) && (
              <Badge variant="outline" className="text-xs px-2 py-0.5 sm:px-3 sm:py-1 bg-primary/5 border-primary/20 text-foreground">
                +{cert.skills.length - (isMobile ? 3 : 4)} more
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/30">
            <Link href={`/certifications/${cert.inline?.id || cert.inline.id}`} className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="group/btn hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 w-full sm:w-auto touch-manipulation"
              >
                <span className="text-foreground text-xs sm:text-sm">View Details</span>
                <ArrowRight className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>

            {cert.certificate_url && (
              <a
                href={cert.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center sm:justify-start text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors px-3 py-2 rounded-lg hover:bg-primary/10 touch-manipulation w-full sm:w-auto"
              >
                <Award className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                Certificate
              </a>
            )}
          </div>
        </CardContent>

        {/* Hover border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />
      </Card>
    </div>
  )
);

CertificationFocusCard.displayName = "CertificationFocusCard";

export function CertificationFocusCards({ 
  certifications, 
  startIndex, 
  isMobile 
}: { 
  certifications: Certification[];
  startIndex: number;
  isMobile: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="mx-auto mt-8 sm:mt-16 lg:mt-20 grid max-w-2xl grid-cols-1 gap-4 sm:gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {certifications.map((cert, index) => (
        <CertificationFocusCard
          key={cert.inline?.id || cert.inline.id}
          cert={cert}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          startIndex={startIndex}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}
