'use client'

import {
  Github,
  Linkedin,
  Mail,
  ArrowUp,
  Heart,
  Code,
  Coffee,
  Star,
  Zap,
  Settings,
  GraduationCap,
  Briefcase,
  Award,
  Phone
} from 'lucide-react'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'

import {
  XProfile,
  GitHubProject,
  GitHubLearning,
  GitHubOrganistaion,
  LeetCodeProfile,
  YouTubeChannel,
  CodeChefProfile,
  LinkedInProfile,
  CodeforcesProfile
} from '@/data/static_link'

export default function FooterSection() {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()
  const isMobile = windowWidth < 768
  const isTablet = windowWidth >= 768 && windowWidth < 1024

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 border-t border-border/50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/3 rounded-full blur-3xl" />
      
      {/* Floating accent elements */}
      <div className="absolute top-20 right-20 w-8 h-8 bg-primary/20 rounded-full animate-pulse hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-6 h-6 bg-secondary/20 rounded-full animate-pulse delay-1000 hidden lg:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          
          {/* Brand Section */}
          <div className="text-center lg:text-left mb-12 lg:mb-16">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg border border-primary/20">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Shardendu Mishra
              </h3>
            </div>
            
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-6">
              Software Engineer passionate about creating innovative solutions and building amazing user experiences.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start space-x-3 text-sm text-muted-foreground mb-6">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-amber-600" />
              <span>by Shardendu</span>
            </div>

            {/* Tech Stack Indicators */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {['Next.js', 'React', 'TypeScript', 'Tailwind'].map((tech) => (
                <div key={tech} className="px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary border border-primary/20">
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Links Grid - Mobile gets 2 columns, Desktop gets 4 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 mb-12">
            
            {/* Quick Links */}
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-base lg:text-lg font-semibold text-foreground flex items-center space-x-2 justify-center lg:justify-start">
                <Zap className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
                <span>Quick Links</span>
              </h4>
              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                {[
                  { 
                    href: '/admin/login', 
                    label: 'Admin Dashboard',
                    shortLabel: 'Admin',
                    icon: <Settings className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  { 
                    href: '#education', 
                    label: 'Education',
                    shortLabel: 'Education',
                    icon: <GraduationCap className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  { 
                    href: '#projects', 
                    label: 'Projects',
                    shortLabel: 'Projects',
                    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  { 
                    href: '#experience', 
                    label: 'Experience',
                    shortLabel: 'Exp',
                    icon: <Briefcase className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  { 
                    href: '#certifications', 
                    label: 'Certifications',
                    shortLabel: 'Certs',
                    icon: <Award className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  { 
                    href: '#contact', 
                    label: 'Contact Me',
                    shortLabel: 'Contact',
                    icon: <Phone className="h-3 lg:h-4 w-3 lg:w-4" />
                  }
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center space-x-2 lg:space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 py-1.5 lg:py-2 px-2 lg:px-3 rounded-lg hover:bg-primary/5"
                  >
                    <div className="w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {link.icon}
                    </div>
                    <span className="text-xs lg:text-sm font-medium">
                      {isMobile ? link.shortLabel : link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-base lg:text-lg font-semibold text-foreground flex items-center space-x-2 justify-center lg:justify-start">
                <Star className="w-4 lg:w-5 h-4 lg:h-5 text-secondary" />
                <span>Social Media</span>
              </h4>
              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                {[
                  {
                    href: XProfile,
                    label: 'Twitter / X',
                    shortLabel: 'X',
                    icon: (
                      <svg className="h-3 lg:h-4 w-3 lg:w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    )
                  },
                  {
                    href: LinkedInProfile,
                    label: 'LinkedIn',
                    shortLabel: 'LinkedIn',
                    icon: <Linkedin className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  {
                    href: YouTubeChannel,
                    label: 'YouTube',
                    shortLabel: 'YouTube',
                    icon: (
                      <svg className="h-3 lg:h-4 w-3 lg:w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )
                  },
                  {
                    href: 'mailto:shardendumishra01@gmail.com',
                    label: 'Email',
                    shortLabel: 'Email',
                    icon: <Mail className="h-3 lg:h-4 w-3 lg:w-4" />
                  }
                ].map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="group flex items-center space-x-2 lg:space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 py-1.5 lg:py-2 px-2 lg:px-3 rounded-lg hover:bg-primary/5"
                  >
                    <div className="w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                    <span className="text-xs lg:text-sm font-medium">
                      {isMobile ? social.shortLabel : social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Coding Profiles */}
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-base lg:text-lg font-semibold text-foreground flex items-center space-x-2 justify-center lg:justify-start">
                <Code className="w-4 lg:w-5 h-4 lg:h-5 text-accent" />
                <span>Coding Profiles</span>
              </h4>
              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                {[
                  {
                    href: GitHubProject,
                    label: 'GitHub Main',
                    shortLabel: 'Main',
                    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  {
                    href: GitHubLearning,
                    label: 'GitHub Learning',
                    shortLabel: 'Learning',
                    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  {
                    href: GitHubOrganistaion,
                    label: 'Team Parashuram',
                    shortLabel: 'Team',
                    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  {
                    href: LeetCodeProfile,
                    label: 'LeetCode',
                    shortLabel: 'LeetCode',
                    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />
                  }
                ].map((profile) => (
                  <a
                    key={profile.href}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 lg:space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 py-1.5 lg:py-2 px-2 lg:px-3 rounded-lg hover:bg-primary/5"
                  >
                    <div className="w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {profile.icon}
                    </div>
                    <span className="text-xs lg:text-sm font-medium">
                      {isMobile ? profile.shortLabel : profile.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Additional Profiles */}
            <div className="space-y-4 lg:space-y-6">
              <h4 className="text-base lg:text-lg font-semibold text-foreground flex items-center space-x-2 justify-center lg:justify-start">
                <Star className="w-4 lg:w-5 h-4 lg:h-5 text-accent" />
                <span>More Profiles</span>
              </h4>
              <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                {[
                  {
                    href: CodeChefProfile,
                    label: 'CodeChef',
                    shortLabel: 'CodeChef',
                    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />
                  },
                  {
                    href: CodeforcesProfile,
                    label: 'Codeforces',
                    shortLabel: 'Codeforces',
                    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />
                  }
                ].map((profile) => (
                  <a
                    key={profile.href}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 lg:space-x-3 text-muted-foreground hover:text-primary transition-all duration-300 py-1.5 lg:py-2 px-2 lg:px-3 rounded-lg hover:bg-primary/5"
                  >
                    <div className="w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {profile.icon}
                    </div>
                    <span className="text-xs lg:text-sm font-medium">
                      {isMobile ? profile.shortLabel : profile.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Quick Connect - Only for very small screens */}
          {isMobile && windowWidth < 480 && (
            <div className="border-t border-border/20 py-8 mb-8">
              <h4 className="text-lg font-semibold text-foreground text-center mb-6">Quick Connect</h4>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { href: GitHubProject, label: 'GitHub', icon: <Github className="h-4 w-4" /> },
                  { href: LinkedInProfile, label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
                  { href: XProfile, label: 'Twitter', icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ) },
                  { href: 'mailto:shardendumishra01@gmail.com', label: 'Email', icon: <Mail className="h-4 w-4" /> }
                ].map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="flex flex-col items-center justify-center space-y-2 bg-card/50 hover:bg-primary/5 border border-border/30 hover:border-primary/30 rounded-xl py-3 px-2 transition-all duration-300 group h-16"
                  >
                    <div className="text-primary group-hover:scale-110 transition-transform">
                      {social.icon}
                    </div>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left space-y-2">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Shardendu Mishra. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">
                Built with Next.js, TypeScript & Tailwind CSS
              </p>
            </div>

            <Button
              onClick={scrollToTop}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="group bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 h-12 px-6"
            >
              <ArrowUp className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-1" />
              <span>Back to Top</span>
            </Button>
          </div>
        </div>

        {/* Professional accent line */}
        <div className="flex justify-center pb-8">
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
      </div>
    </footer>
  )
}
