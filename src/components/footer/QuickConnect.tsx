import { quickConnectLinks } from './data'
import { motionSafe } from './utils'

interface QuickConnectProps {
  windowWidth: number
}

export const QuickConnect = ({ windowWidth }: QuickConnectProps) => {
  if (!(windowWidth < 768 && windowWidth < 480)) return null

  return (
    <div className="border-t border-border/20 py-8 mb-8">
      <h4 className="text-lg font-semibold text-foreground text-center mb-6">
        Quick Connect
      </h4>
      <div className="grid grid-cols-4 gap-3">
        {quickConnectLinks.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target={social.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            aria-label={social.label}
            className="flex flex-col items-center justify-center space-y-2 bg-card/50 hover:bg-primary/5 border border-border/30 hover:border-primary/30 rounded-xl py-3 px-2 transition-all duration-300 group h-16"
          >
            <div className={`text-primary group-hover:scale-110 ${motionSafe}`}>
              {social.icon}
            </div>
            <span className="text-xs font-medium text-foreground group-hover:text-primary/90">
              {social.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
