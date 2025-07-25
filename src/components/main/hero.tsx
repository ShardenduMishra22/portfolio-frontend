import { Briefcase, Mail, ArrowRight, Code, Coffee, LinkedinIcon, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { GitHubProject, LinkedInProfile } from '@/data/static_link'
import { useState, useEffect, useCallback, useMemo, memo } from 'react'

// Memoized responsive text component
const ResponsiveText = memo(function ResponsiveText({ 
  isMobile, 
  primaryText, 
  secondaryText 
}: { 
  isMobile: boolean
  primaryText: string
  secondaryText: string 
}) {
  return (
    <span className="text-sm sm:text-base truncate">
      {isMobile ? primaryText : secondaryText}
    </span>
  )
})

// Memoized button component
const CTAButton = memo(function CTAButton({ 
  href, 
  variant = 'default', 
  icon: Icon, 
  children, 
  isMobile 
}: {
  href: string
  variant?: 'default' | 'outline'
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  isMobile: boolean
}) {
  const buttonClasses = useMemo(() => {
    const baseClasses = "group transition-all duration-300 w-full sm:w-auto touch-manipulation"
    const variantClasses = variant === 'outline' 
      ? "border-2 border-primary/30 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 text-foreground hover:text-primary shadow-lg"
      : "bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25"
    
    return `${baseClasses} ${variantClasses}`
  }, [variant])

  return (
    <Link href={href} className="w-full sm:w-auto">
      <Button 
        size={isMobile ? "default" : "lg"} 
        variant={variant}
        className={buttonClasses}
      >
        <Icon className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110 flex-shrink-0" />
        {children}
        {variant === 'default' && (
          <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1 flex-shrink-0" />
        )}
      </Button>
    </Link>
  )
})

// Custom hook for optimized window size handling
function useResponsiveLayout() {
  const [windowWidth, setWindowWidth] = useState(0)

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Set initial value
    handleResize()

    // Throttle resize events for better performance
    let timeoutId: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleResize, 150)
    }

    window.addEventListener('resize', throttledResize, { passive: true })
    return () => {
      window.removeEventListener('resize', throttledResize)
      clearTimeout(timeoutId)
    }
  }, [handleResize])

  return useMemo(() => ({
    windowWidth,
    isMobile: windowWidth < 640,
    isTablet: windowWidth >= 640 && windowWidth < 1024,
    isDesktop: windowWidth >= 1024
  }), [windowWidth])
}

// Professional image component with optimizations
const ProfessionalImage = memo(function ProfessionalImage() {
  return (
    <div className="relative flex justify-center lg:justify-start order-1 lg:order-1">
      <div className="relative group">
        {/* Responsive glow effect */}
        <div className="absolute -inset-1.5 sm:-inset-2 bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 sm:from-primary/20 sm:via-secondary/20 sm:to-accent/20 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
        
        {/* Responsive image container */}
        <div className="relative bg-gradient-to-br from-card to-card/80 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-border/50 group-hover:border-primary/30 transition-all duration-500">
          <Image
            src="/Professional.webp"
            alt="Shardendu Mishra - Software Engineer"
            width={500}
            height={500}
            priority
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMEBf/EACUQAAIBAwMEAwEBAAAAAAAAAAECAwAEEQUSITFBURMiYXGBkf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAHhEAAgICAgMAAAAAAAAAAAAAAQIAEQMhEjEEQVH/2gAMAwEAAhEDEQA/APGLmKa2uJ7eVQrxkjcpGQR24rW0rxKK01SO21W1nms5MKJIwStqx6HTIPGf2BXUMhZCMHkVLOhMbqfFCmRdLGD2Gf8ASqjcryTJKYWI7gg5pUEgJJIBHBAI4qa5to7mJmUdOpHnA7f4Kk//2Q=="
            className="rounded-lg sm:rounded-xl object-cover w-full h-auto max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 400px, 500px"
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
  )
})

export default memo(function HeroSection() {
  const { isMobile, isTablet, isDesktop } = useResponsiveLayout()

  // Memoize content to prevent unnecessary re-renders
  const content = useMemo(() => ({
    title: {
      firstName: "Shardendu",
      lastName: "Mishra"
    },
    descriptions: [
      {
        text: "Software Engineer passionate about building impactful applications with modern technologies.",
        highlights: [{ text: "impactful applications", className: "text-primary font-medium" }]
      },
      {
        text: "Specializing in Go, NextJS, and cloud-native solutions.",
        highlights: [
          { text: "Go, NextJS,", className: "text-secondary font-medium" },
          { text: "cloud-native solutions", className: "text-accent font-medium" }
        ]
      }
    ],
    email: "mishrashardendu22@gmail.com",
    cta: {
      primary: {
        href: GitHubProject,
        icon: Github,
        mobileText: "View GitHub Projects",
        desktopText: "GitHub - Check Out My Projects"
      },
      secondary: {
        href: LinkedInProfile,
        icon: LinkedinIcon,
        mobileText: "Connect on LinkedIn", 
        desktopText: "Super Active on LinkedIn - Let's Connect"
      }
    }
  }), [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-8 sm:py-12 lg:py-16">
      {/* Optimized background gradients - memoized to prevent recalculation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,theme(colors.primary/6),transparent_50%)] sm:bg-[radial-gradient(circle_at_30%_40%,theme(colors.primary/8),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,theme(colors.secondary/4),transparent_50%)] sm:bg-[radial-gradient(circle_at_70%_60%,theme(colors.secondary/6),transparent_50%)]" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Image Section */}
          <ProfessionalImage />

          {/* Content Section - Mobile optimized */}
          <div className="text-center lg:text-left order-2 lg:order-2">
            <div className="space-y-6 sm:space-y-8">
              {/* Title section - Responsive typography */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent block">
                    {content.title.firstName}
                  </span>
                  <span className="text-foreground block">
                    {content.title.lastName}
                  </span>
                </h1>
                
                {/* Professional accent line */}
                <div className="w-12 sm:w-16 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0" />
              </div>
              
              {/* Description - Mobile optimized with memoized content */}
              <div className="space-y-3 sm:space-y-4 px-4 sm:px-0">
                {content.descriptions.map((desc, index) => (
                  <p key={index} className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground max-w-sm sm:max-w-lg mx-auto lg:mx-0">
                    {desc.text.split(/(\w+,?\s*\w+)/g).map((part, i) => {
                      const highlight = desc.highlights.find(h => part.includes(h.text))
                      return highlight ? (
                        <span key={i} className={highlight.className}>
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    })}
                  </p>
                ))}
              </div>

              {/* Email Contact - Mobile responsive */}
              <div className="flex items-center justify-center lg:justify-start px-4 sm:px-0">
                <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2 border border-border/50 hover:border-primary/30 transition-all duration-300 group max-w-full overflow-hidden">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" />
                  <a 
                    href={`mailto:${content.email}`}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium text-xs sm:text-sm lg:text-base truncate"
                  >
                    {content.email}
                  </a>
                </div>
              </div>
              
              {/* CTA Buttons - Memoized and mobile-first responsive design */}
              <div className="flex flex-col gap-3 sm:gap-4 pt-4 px-4 sm:px-0">
                <CTAButton
                  href={content.cta.primary.href}
                  icon={content.cta.primary.icon}
                  isMobile={isMobile}
                >
                  <ResponsiveText
                    isMobile={isMobile}
                    primaryText={content.cta.primary.mobileText}
                    secondaryText={content.cta.primary.desktopText}
                  />
                </CTAButton>
                
                <CTAButton
                  href={content.cta.secondary.href}
                  variant="outline"
                  icon={content.cta.secondary.icon}
                  isMobile={isMobile}
                >
                  <ResponsiveText
                    isMobile={isMobile}
                    primaryText={content.cta.secondary.mobileText}
                    secondaryText={content.cta.secondary.desktopText}
                  />
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle bottom accent - responsive */}
        <div className="mt-12 sm:mt-20 flex justify-center space-x-4 sm:space-x-6 opacity-30">
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full animate-pulse" />
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-secondary rounded-full animate-pulse delay-150" />
          <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-accent rounded-full animate-pulse delay-300" />
        </div>

        {/* Mobile scroll indicator - only render on mobile */}
        {isMobile && (
          <div className="flex justify-center mt-8">
            <div className="animate-bounce">
              <ArrowRight className="h-4 w-4 text-primary/60 rotate-90" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
})
