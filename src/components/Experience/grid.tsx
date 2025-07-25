import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import ExperienceCards from './card'

interface ExperienceGridProps {
  items: {
    title: string
    company: string
    description: string
    link: string
    technologies?: string[]
    certificateUrl?: string
    startDate: string
    endDate: string
  }[]
  className?: string
}

export default function ExperienceGrid({ items, className }: ExperienceGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid auto-rows-fr py-6', className)}>
      {items.map((item, idx) => (
        <div
          key={item?.link}
          className="relative group block p-3 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60 block rounded-3xl border border-primary/20 shadow-xl shadow-primary/10"
                layoutId="hoverBackground"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.2 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  transition: { duration: 0.2, delay: 0.1 },
                }}
              />
            )}
          </AnimatePresence>
          <ExperienceCards
            title={item.title}
            company={item.company}
            description={item.description}
            link={item.link}
            technologies={item.technologies}
            certificateUrl={item.certificateUrl}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        </div>
      ))}
    </div>
  )
}
