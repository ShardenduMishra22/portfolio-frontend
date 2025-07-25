import { cn } from '@/lib/utils'
import Link from 'next/link'

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  isExpanded,
  isMobile = false,
  onClick,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  isExpanded?: boolean
  isMobile?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-xl group relative overflow-hidden',
        'hover:bg-gradient-to-r hover:from-accent/20 hover:to-secondary/10 hover:text-accent hover:shadow-lg hover:shadow-accent/20',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
        'active:scale-95 transform-gpu',
        isActive &&
          'bg-gradient-to-r from-primary/20 to-secondary/15 text-primary shadow-lg shadow-primary/30 border border-primary/30',
        isMobile && 'w-full justify-start'
      )}
    >
      {/* Animated background for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <Icon
        className={cn(
          'h-5 w-5 flex-shrink-0 transition-all duration-300',
          isActive ? 'text-primary' : 'text-foreground group-hover:text-accent',
          'group-hover:scale-110'
        )}
      />

      <span
        className={cn(
          'transition-all duration-300 whitespace-nowrap font-medium',
          isMobile || isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
          isActive ? 'text-primary' : 'text-foreground group-hover:text-accent'
        )}
      >
        {label}
      </span>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}

      {/* Tooltip for collapsed state - only for desktop */}
      {!isExpanded && !isMobile && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-popover/95 backdrop-blur-sm text-popover-foreground text-xs rounded-lg shadow-xl border border-border opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 transform translate-x-2 group-hover:translate-x-0">
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover border-l border-t border-border rotate-45" />
        </div>
      )}
    </Link>
  )
}

export { NavLink }
