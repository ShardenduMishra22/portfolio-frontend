import { Briefcase, Mail, ArrowRight, Code, Coffee, LinkedinIcon, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { GitHubProject, LinkedInProfile } from '@/data/static_link'
import { useState, useEffect, useCallback, useMemo } from 'react'

export default function HeroSection() {
  const [windowWidth, setWindowWidth] = useState(0)

  // Memoized device detection
  const deviceInfo = useMemo(() => {
    const isMobile = windowWidth < 640
    const isTablet = windowWidth >= 640 && windowWidth < 1024
    return { isMobile, isTablet }
  }, [windowWidth])

  // Optimized resize handler
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      handleResize()
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  // Memoized button text
  const buttonText = useMemo(() => ({
    github: deviceInfo.isMobile ? 'View GitHub Projects' : 'GitHub - Check Out My Projects',
    linkedin: deviceInfo.isMobile ? 'Connect on LinkedIn' : "Super Active on LinkedIn - Let's Connect"
  }), [deviceInfo.isMobile])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-8 sm:py-12 lg:py-16">
      {/* Optimized background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,theme(colors.primary/6),transparent_50%)] sm:bg-[radial-gradient(circle_at_30%_40%,theme(colors.primary/8),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,theme(colors.secondary/4),transparent_50%)] sm:bg-[radial-gradient(circle_at_70%_60%,theme(colors.secondary/6),transparent_50%)]"></div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image Section - Mobile optimized */}
          <div className="relative flex justify-center lg:justify-start order-1 lg:order-1">
            <div className="relative group">
              {/* Responsive glow effect */}
              <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 sm:from-primary/20 sm:via-secondary/20 sm:to-accent/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

              {/* Responsive image container */}
              <div className="relative bg-gradient-to-br from-card to-card/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                <Image
                  src="/Professional.webp"
                  alt="Shardendu Mishra - Software Engineer"
                  width={500}
                  height={500}
                  priority
                  className="rounded-lg sm:rounded-xl object-cover w-full h-auto max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </div>

              {/* Responsive accent icons */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-primary/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2.5 border border-primary/30 shadow-lg">
                <Code className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-secondary/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2.5 border border-secondary/30 shadow-lg">
                <Coffee className="h-3 w-3 sm:h-4 sm:w-4 text-secondary-foreground" />
              </div>
            </div>
          </div>

          {/* Content Section - Mobile optimized */}
          <div className="text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              {/* Title section - Responsive typography */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent block">
                    Shardendu
                  </span>
                  <span className="text-foreground block">Mishra</span>
                </h1>

                {/* Professional accent line */}
                <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
              </div>

              {/* Description - Mobile optimized */}
              <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground max-w-sm sm:max-w-lg mx-auto lg:mx-0">
                  Software Engineer passionate about building
                  <span className="text-primary font-medium"> impactful applications </span>
                  with modern technologies.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-foreground/90 max-w-sm sm:max-w-lg mx-auto lg:mx-0">
                  Specializing in
                  <span className="text-secondary font-medium"> Go, NextJS, </span>
                  and
                  <span className="text-accent font-medium"> cloud-native solutions</span>.
                </p>
              </div>

              {/* Email Contact - Mobile responsive */}
              <div className="flex items-center justify-center lg:justify-start px-4 sm:px-0">
                <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-border/50 hover:border-primary/30 transition-all duration-300 group max-w-full overflow-hidden">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <a
                    href="mailto:mishrashardendu22@gmail.com"
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-xs sm:text-sm lg:text-base truncate"
                  >
                    {'mishrashardendu22@gmail.com'}
                  </a>
                </div>
              </div>

              {/* CTA Buttons - Mobile-first responsive design */}
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 px-4 sm:px-0">
                {/* Primary CTA */}
                <Link href={GitHubProject} className="w-full sm:w-auto">
                  <Button
                    size={deviceInfo.isMobile ? 'default' : 'lg'}
                    className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300 w-full sm:w-auto touch-manipulation"
                  >
                    <Github className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">
                      {buttonText.github}
                    </span>
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                  </Button>
                </Link>

                {/* Secondary CTA */}
                <Link href={LinkedInProfile} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size={deviceInfo.isMobile ? 'default' : 'lg'}
                    className="group border-2 border-primary/30 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 text-foreground hover:text-primary transition-all duration-300 shadow-lg w-full sm:w-auto touch-manipulation"
                  >
                    <LinkedinIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110 flex-shrink-0" />
                    <span className="text-sm sm:text-base truncate">
                      {buttonText.linkedin}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle bottom accent - responsive */}
        <div className="mt-12 sm:mt-20 flex justify-center space-x-4 sm:space-x-6 opacity-30">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full animate-pulse"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-secondary rounded-full animate-pulse delay-150"></div>
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Mobile scroll indicator */}
        {deviceInfo.isMobile && (
          <div className="flex justify-center mt-8">
            <div className="animate-bounce">
              <ArrowRight className="h-4 w-4 text-primary/60 rotate-90" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
