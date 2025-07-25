'use client'

import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Sparkles } from 'lucide-react'
import CanvasRevealEffect from './CanvasRevealEffect'

interface CanvasCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  animationSpeed?: number
  containerClassName?: string
  colors?: number[][]
  dotSize?: number
}

export const CanvasCard: React.FC<CanvasCardProps> = ({
  title,
  icon,
  children,
  containerClassName = 'bg-blue-900',
  colors = [
    [59, 130, 246],
    [147, 197, 253],
  ],
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-border/50 group/canvas-card w-full relative h-auto min-h-[200px] rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-500"
    >
      <div className="absolute h-4 w-4 -top-2 -left-2 text-primary opacity-30 transition-opacity duration-300 group-hover/canvas-card:opacity-60">
        <Sparkles className="h-full w-full" />
      </div>
      <div className="absolute h-4 w-4 -bottom-2 -right-2 text-primary opacity-30 transition-opacity duration-300 group-hover/canvas-card:opacity-60">
        <Sparkles className="h-full w-full" />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: 'easeOut',
              delay: 0.2,
            }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName={containerClassName}
              colors={colors}
              dotSize={2}
              opacities={[0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0]}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 p-6 flex flex-col justify-between h-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              className="text-primary group-hover/canvas-card:text-white transition-colors duration-500"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground group-hover/canvas-card:text-white transition-colors duration-500">
              {title}
            </h3>
          </div>
        </div>
        <div className="group-hover/canvas-card:text-white transition-colors duration-500">
          {children}
        </div>
      </div>
    </div>
  )
}
