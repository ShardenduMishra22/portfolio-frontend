import { LinkItem } from "./types"
import { motionSafe } from "./utils"


interface LinkGroupProps {
  items: LinkItem[]
  isMobile: boolean
}

export const LinkGroup = ({ items, isMobile }: LinkGroupProps) => (
  <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
    {items.map((item) => (
      <a
        key={item.href}
        href={item.href}
        target={item.href.startsWith('mailto:') || item.href.startsWith('#') ? undefined : '_blank'}
        rel={item.href.startsWith('mailto:') || item.href.startsWith('#') ? undefined : 'noopener noreferrer'}
        aria-label={item.label}
        className="group flex items-center space-x-2 lg:space-x-3 text-muted-foreground hover:text-primary/90 hover:bg-primary/5 transition-all duration-300 py-1.5 lg:py-2 px-2 lg:px-3 rounded-lg"
      >
        <div className={`w-5 lg:w-6 h-5 lg:h-6 flex items-center justify-center group-hover:scale-110 ${motionSafe}`}>
          {item.icon}
        </div>
        <span className="text-xs lg:text-sm font-medium">
          {isMobile ? item.shortLabel : item.label}
        </span>
      </a>
    ))}
  </div>
)
