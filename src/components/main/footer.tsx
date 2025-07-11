import Link from 'next/link'
import { Github, Linkedin, Mail, ArrowUp, Heart, Code, Coffee } from 'lucide-react'
import { Button } from '../ui/button'

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
        <div className="py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
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

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col space-y-3">
              <Link href="/admin/dashboard" className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Admin
              </Link>
              <Link href="#about" className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                About
              </Link>
              <Link href="#projects" className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Projects
              </Link>
              <Link href="#experience" className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Experience
              </Link>
              <Link href="#contact" className="text-foreground/70 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform">
                Contact
              </Link>
            </nav>
          </div>

          {/* Connect Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground">Connect</h4>
            <div className="flex flex-col space-y-4">
              <a
                href="https://github.com/shardendu-mishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-foreground/70 hover:text-primary transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Github className="h-4 w-4" />
                </div>
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/shardendu-mishra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-foreground/70 hover:text-primary transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </div>
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:shardendu@example.com"
                className="flex items-center space-x-3 text-foreground/70 hover:text-primary transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span>Email</span>
              </a>
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
              className="group bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
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