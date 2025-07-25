import { cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navItems } from './static_link'
import { NavLink } from './nav'

export function DesktopSidebar({ activeSection }: { activeSection: string }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (!isExpanded) setHasAnimated(false)
  }, [isExpanded])

  return (
    <div className="hidden md:block fixed left-0 top-0 h-full z-50">
      <div
        className={cn(
          'h-full bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border/50 shadow-2xl transition-all duration-500 ease-out',
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-sidebar-primary/5 before:to-transparent before:pointer-events-none',
          isExpanded ? 'w-72' : 'w-20'
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar-primary/10 via-transparent to-sidebar-accent/10 opacity-50 pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-sidebar-border/50">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-xl flex items-center justify-center shadow-lg shadow-sidebar-primary/25 transition-all duration-300 hover:scale-105">
                <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-sidebar animate-pulse" />
            </div>

            {/* Profile info when expanded */}
            {isExpanded && (
              <div
                className="flex-1 animate-in slide-in-from-left duration-300"
                onAnimationEnd={() => setHasAnimated(true)}
              >
                {hasAnimated && (
                  <div className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-yellow-400 to-green-500 bg-[length:200%_100%] bg-clip-text text-transparent animate-blast">
                    I Love Golang and Fedora
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, index) => (
            <div
              key={item.href}
              className="animate-in slide-in-from-left duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NavLink
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={activeSection === item.href.substring(1)}
                isExpanded={isExpanded}
              />
            </div>
          ))}
        </nav>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-sidebar/50 to-transparent pointer-events-none" />

        {/* Expand indicator */}
        <div className="absolute bottom-6 left-4 right-4">
          <div
            className={cn(
              'text-xs text-sidebar-foreground/70 text-center transition-all duration-300 flex items-center justify-center gap-2',
              isExpanded ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
            <span>Hover to expand</span>
            <div className="w-1 h-1 bg-sidebar-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
