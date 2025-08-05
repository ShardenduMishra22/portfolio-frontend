'use client'
import { cn } from '@/lib/utils'
import React, { useEffect, useState, useRef, useCallback } from 'react'

interface ShootingStar {
  id: number
  x: number
  y: number
  angle: number
  scale: number
  speed: number
  distance: number
}

interface ShootingStarsProps {
  minSpeed?: number
  maxSpeed?: number
  minDelay?: number
  maxDelay?: number
  starColor?: string
  trailColor?: string
  starWidth?: number
  starHeight?: number
  className?: string
  maxStars?: number // New prop to limit stars
  enabled?: boolean // New prop to enable/disable
}

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4)
  const offset = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)

  switch (side) {
    case 0:
      return { x: offset, y: 0, angle: 45 }
    case 1:
      return { x: (typeof window !== 'undefined' ? window.innerWidth : 1200), y: offset, angle: 135 }
    case 2:
      return { x: offset, y: (typeof window !== 'undefined' ? window.innerHeight : 800), angle: 225 }
    case 3:
      return { x: 0, y: offset, angle: 315 }
    default:
      return { x: 0, y: 0, angle: 45 }
  }
}

export const ShootingStars: React.FC<ShootingStarsProps> = ({
  minSpeed = 8,
  maxSpeed = 20,
  minDelay = 2000,
  maxDelay = 4000,
  starColor = '#9E00FF',
  trailColor = '#2EB9DF',
  starWidth = 20,
  starHeight = 1,
  className,
  maxStars = 3, // Limit to 3 stars max for performance
  enabled = true, // Default to enabled
}) => {
  const [stars, setStars] = useState<ShootingStar[]>([])
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Throttled star creation
  const createStar = useCallback(() => {
    if (!enabled || stars.length >= maxStars) return

    const { x, y, angle } = getRandomStartPoint()
    const newStar: ShootingStar = {
      id: Date.now() + Math.random(),
      x,
      y,
      angle,
      scale: 1,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      distance: 0,
    }

    setStars((prevStars) => [...prevStars, newStar])

    // Schedule next star creation
    const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay
    timeoutRef.current = setTimeout(createStar, randomDelay)
  }, [enabled, stars.length, maxStars, minSpeed, maxSpeed, minDelay, maxDelay])

  // Optimized star movement with throttling
  const moveStars = useCallback(() => {
    if (!enabled) return

    setStars((prevStars) =>
      prevStars
        .map((star) => {
          const newX = star.x + star.speed * Math.cos((star.angle * Math.PI) / 180)
          const newY = star.y + star.speed * Math.sin((star.angle * Math.PI) / 180)
          const newDistance = star.distance + star.speed
          const newScale = 1 + newDistance / 100

          return {
            ...star,
            x: newX,
            y: newY,
            distance: newDistance,
            scale: newScale,
          }
        })
        .filter(
          (star) =>
            star.x >= -20 &&
            star.x <= (typeof window !== 'undefined' ? window.innerWidth : 1200) + 20 &&
            star.y >= -20 &&
            star.y <= (typeof window !== 'undefined' ? window.innerHeight : 800) + 20
        )
    )

    animationRef.current = requestAnimationFrame(moveStars)
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      createStar()
      animationRef.current = requestAnimationFrame(moveStars)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [enabled, createStar, moveStars])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Don't render if disabled
  if (!enabled) return null

  return (
    <svg ref={svgRef} className={cn('w-full h-full absolute inset-0 pointer-events-none', className)}>
      {stars.map((star) => (
        <rect
          key={star.id}
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill="url(#gradient)"
          transform={`rotate(${star.angle}, ${
            star.x + (starWidth * star.scale) / 2
          }, ${star.y + starHeight / 2})`}
        />
      ))}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
