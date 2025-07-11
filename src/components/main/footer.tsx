import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUp, Heart, Code, Coffee, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

// Import your social links
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
} from "@/data/static_link"

export default function FooterSection() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-card via-card/95 to-secondary/10 border-t border-border/50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.primary/2),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.secondary/2),transparent_70%)]"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Shardendu Mishra
              </h3>
            </div>
            <p className="text-foreground/70 text-lg leading-relaxed max-w-md">
              Full-stack developer passionate about creating innovative solutions and building amazing user experiences.
            </p>
            <div className="flex items-center space-x-2 text-sm text-foreground/60">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-amber-600" />
              <span>by Shardendu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              {[
                { href: "/admin/dashboard", label: "Admin" },
                { href: "#about", label: "About" },
                { href: "#projects", label: "Projects" },
                { href: "#experience", label: "Experience" },
                { href: "#contact", label: "Contact" }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 transform inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Social Media</h4>
            <div className="flex flex-col space-y-4">
              {[
                {
                  href: XProfile,
                  label: "X (Twitter)",
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )
                },
                {
                  href: LinkedInProfile,
                  label: "LinkedIn",
                  icon: <Linkedin className="h-4 w-4" />
                },
                {
                  href: YouTubeChannel,
                  label: "YouTube",
                  icon: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )
                },
                {
                  href: "mailto:shardendumishra01@gmail.com",
                  label: "Email",
                  icon: <Mail className="h-4 w-4" />
                }
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : "_blank"}
                  rel={social.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                  className="flex items-center space-x-3 text-foreground/70 hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    {social.icon}
                  </div>
                  <span className="leading-none">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Coding Profiles */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Coding Profiles</h4>
            <div className="flex flex-col space-y-4">
              {[
                {
                  href: GitHubProject,
                  label: "GitHub Main Account",
                  icon: <Github className="h-4 w-4" />
                },
                {
                  href: GitHubLearning,
                  label: "GitHub Learning Account",
                  icon: <Github className="h-4 w-4" />
                },
                {
                  href: GitHubOrganistaion,
                  label: "Team Parashuram",
                  icon: <Github className="h-4 w-4" />
                },
                {
                  href: LeetCodeProfile,
                  label: "LeetCode",
                  icon: <Code className="h-4 w-4" />
                }
              ].map((profile) => (
                <a
                  key={profile.href}
                  href={profile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-foreground/70 hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    {profile.icon}
                  </div>
                  <span className="leading-none">{profile.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-sm text-foreground/60">
                © {currentYear} Shardendu Mishra. All rights reserved.
              </p>
            </div>
            
            <Button
              onClick={scrollToTop}
              variant="outline"
              size="sm"
              className="group bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center"
            >
              <ArrowUp className="h-4 w-4 mr-2 transition-transform group-hover:-translate-y-1" />
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}