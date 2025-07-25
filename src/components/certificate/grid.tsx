import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import CertificationCards from './card'

interface CertificationGridProps {
  items: {
    title: string
    issuer: string
    description: string
    link: string
    skills?: string[]
    certificateUrl?: string
    issueDate: string
  }[]
  className?: string
}

export default function CertificationGrid({ items, className }: CertificationGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid auto-rows-fr py-6', className)}>
      {items.map((item, idx) => (
        <div
          key={`${item?.link}-${idx}`}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-slate-800/60 dark:via-slate-700/60 dark:to-slate-800/60 block rounded-3xl border border-primary/20"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <CertificationCards
            title={item.title}
            issuer={item.issuer}
            description={item.description}
            link={item.link}
            skills={item.skills}
            certificateUrl={item.certificateUrl}
            issueDate={item.issueDate}
          />
        </div>
      ))}
    </div>
  )
}
