import { Briefcase, Mail, ArrowRight, Code, Coffee, LinkedinIcon, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { GitHubProject, LinkedInProfile } from '@/data/static_link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-12 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,theme(colors.primary/8),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,theme(colors.secondary/6),transparent_50%)]"></div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left side - Image */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative group">
              {/* Subtle glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-card to-card/80 p-3 rounded-2xl shadow-xl border border-border/50 group-hover:border-primary/30 transition-all duration-500">
<Image
  src="/Professional.webp"
  alt="Professional"
  width={500}
  height={500}
  priority
  className="rounded-xl object-cover w-full h-auto max-w-[500px] transition-transform duration-500 group-hover:scale-[1.02]"
/>


              </div>
              
              {/* Professional accent icons */}
              <div className="absolute -top-3 -right-3 bg-primary/90 backdrop-blur-sm rounded-full p-2.5 border border-primary/30 shadow-lg">
                <Code className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-3 -left-3 bg-secondary/90 backdrop-blur-sm rounded-full p-2.5 border border-secondary/30 shadow-lg">
                <Coffee className="h-4 w-4 text-secondary-foreground" />
              </div>
            </div>
          </div>

          {/* Right side - Text content */}
          <div className="text-center lg:text-left order-1 lg:order-2">
            <div className="space-y-8">
              {/* Title section */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                  <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                    Shardendu
                  </span>
                  <br />
                  <span className="text-foreground">
                    Mishra
                  </span>
                </h1>
                
                {/* Professional accent line */}
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto lg:mx-0"></div>
              </div>
              
              {/* Description */}
              <div className="space-y-4">
                <p className="text-xl leading-relaxed text-foreground max-w-lg mx-auto lg:mx-0">
                  Software Engineer passionate about building 
                  <span className="text-primary font-medium"> impactful applications </span>
                  with modern technologies.
                </p>
                <p className="text-lg text-foreground max-w-lg mx-auto lg:mx-0">
                  Specializing in 
                  <span className="text-secondary font-medium"> Go, NextJS, </span>
                  and 
                  <span className="text-accent font-medium"> cloud-native solutions</span>.
                </p>
              </div>

              {/* Email Contact */}
              <div className="flex items-center justify-center lg:justify-start space-x-3 py-2">
                <div className="flex items-center space-x-2 bg-card/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                  <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                  <a 
                    href="mailto:mishrashardendu22@gmail.com"
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                  >
                    mishrashardendu22@gmail.com
                  </a>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href={GitHubProject}>
                  <Button size="lg" className="group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                    <Github className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    GitHub - Check Out My Projects
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                
                <Link href={LinkedInProfile}>
                  <Button variant="outline" size="lg" className="group border-2 border-primary/30 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 text-foreground hover:text-primary transition-all duration-300 shadow-lg">
                    <LinkedinIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                    Super Active on LinkedIn Lets Connect
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Subtle bottom accent */}
        <div className="mt-20 flex justify-center space-x-6 opacity-30">
          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
          <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
