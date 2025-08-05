'use client'
import { cn } from '@/lib/utils'
import React, { useState, useEffect, useRef, RefObject, useCallback } from 'react'

interface StarProps {
  x: number
  y: number
  radius: number
  opacity: number
  twinkleSpeed: number | null
}

interface StarBackgroundProps {
  starDensity?: number
  allStarsTwinkle?: boolean
  twinkleProbability?: number
  minTwinkleSpeed?: number
  maxTwinkleSpeed?: number
  className?: string
  enabled?: boolean // New prop to enable/disable
  maxStars?: number // New prop to limit stars
}

export const StarsBackground: React.FC<StarBackgroundProps> = ({
  starDensity = 0.00008, // Reduced density for better performance
  allStarsTwinkle = false, // Disabled by default for performance
  twinkleProbability = 0.3, // Reduced probability
  minTwinkleSpeed = 1,
  maxTwinkleSpeed = 2,
  className,
  enabled = true,
  maxStars = 50, // Limit maximum stars
}) => {
  const [stars, setStars] = useState<StarProps[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      if (!enabled) return []
      
      const area = width * height
      const numStars = Math.min(
        Math.floor(area * starDensity),
        maxStars
      )
      
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 0.03 + 0.3, // Smaller stars
          opacity: Math.random() * 0.3 + 0.3, // Lower opacity
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed + Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
        }
      })
    },
    [starDensity, allStarsTwinkle, twinkleProbability, minTwinkleSpeed, maxTwinkleSpeed, enabled, maxStars]
  )

  useEffect(() => {
    const updateStars = () => {
      if (canvasRef.current && enabled) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const { width, height } = canvas.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setStars(generateStars(width, height))
      }
    }

    updateStars()

    const canvasEl = canvasRef.current
    const resizeObserver = new ResizeObserver(updateStars)
    if (canvasEl) {
      resizeObserver.observe(canvasEl)
    }

    return () => {
      if (canvasEl) {
        resizeObserver.unobserve(canvasEl)
      }
    }
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
    enabled,
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Only update twinkling stars occasionally for performance
        if (star.twinkleSpeed !== null && Math.random() < 0.1) {
          star.opacity = 0.3 + Math.abs(Math.sin((Date.now() * 0.0005) / star.twinkleSpeed) * 0.3)
        }
      })

      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [stars, enabled])

  // Don't render if disabled
  if (!enabled) return null

  return (
    <canvas 
      ref={canvasRef} 
      className={cn('h-full w-full absolute inset-0 pointer-events-none', className)} 
    />
  )
}
