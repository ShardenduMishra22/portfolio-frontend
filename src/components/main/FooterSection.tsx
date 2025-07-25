'use client'

import { LinksGrid } from '../footer/LinksGrid' 
import { ProfileInfo } from '../footer/ProfileInfo'
import { ContactForm } from '../footer/ContactForm'
import { QuickConnect } from '../footer/QuickConnect'
import { StarsBackground } from '../ui/stars-background'
import { BackToTopButton } from '../footer/BackToTopButton'
import { useWindowWidth } from '../footer/hooks/useWindowWidth'

export default function FooterSection() {
  const windowWidth = useWindowWidth()
  const currentYear = new Date().getFullYear()
  const isMobile = windowWidth < 768

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90 border-t border-border/50">
      <StarsBackground />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">

          <section className="grid gap-10 lg:grid-cols-[1.5fr_1.5fr] items-stretch">
            <ProfileInfo currentYear={currentYear} />
            <ContactForm />
          </section>

          <BackToTopButton isMobile={isMobile} />

          {/* Subtle divider gradient */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent mb-12" />

          {/* Links Grid */}
          <LinksGrid isMobile={isMobile} />

          {/* Quick Connect for Mobile */}
          <QuickConnect windowWidth={windowWidth} />
        </div>

        {/* Bottom Gradient Line */}
        <div className="flex justify-center pb-8">
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary rounded-full" />
        </div>
      </div>
    </footer>
  )
}
