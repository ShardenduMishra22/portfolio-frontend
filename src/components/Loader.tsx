'use client'

import { useState, useEffect, JSX } from 'react'
import { Code, Coffee, Zap, Star, Sparkles, Rocket, Heart } from 'lucide-react'

const Loader = () => {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [dots, setDots] = useState('')
  const [particles, setParticles] = useState<JSX.Element[]>([])

  const messages = [
    'Brewing some amazing code...',
    'Summoning digital magic...',
    'Crafting pixel-perfect experiences...',
    'Loading awesome content...',
    'Initializing creativity engine...',
    'Preparing something special...',
    'Assembling digital masterpiece...',
  ]

  const icons = [Code, Coffee, Zap, Star, Sparkles, Rocket, Heart]

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 2000)

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(dotsInterval)
    }
  }, [messages.length])

  useEffect(() => {
    const temp: JSX.Element[] = []
    for (let i = 0; i < 6; i++) {
      temp.push(
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      )
    }
    setParticles(temp)
  }, [])

  const CurrentIcon = icons[currentMessage]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      {particles.length > 0 && <div className="absolute inset-0 overflow-hidden">{particles}</div>}

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-secondary/30 rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-6 h-6 bg-primary/20 rotate-45 animate-bounce"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-accent/40 rounded-full animate-bounce"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Main Loader */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 animate-spin mx-auto relative">
            <div
              className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin"
              style={{ animationDuration: '1s' }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-secondary/30 animate-spin"
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            />

            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <CurrentIcon className="w-5 h-5 text-primary animate-bounce" />
              </div>
            </div>
          </div>

          {/* Orbiting Dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-2 h-2 bg-primary rounded-full absolute -top-1 left-1/2 transform -translate-x-1/2" />
            <div className="w-2 h-2 bg-secondary rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2" />
            <div className="w-2 h-2 bg-accent rounded-full absolute top-1/2 -left-1 transform -translate-y-1/2" />
            <div className="w-2 h-2 bg-primary rounded-full absolute top-1/2 -right-1 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden mx-auto">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse"
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>

        {/* Dynamic Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground animate-pulse">
            {messages[currentMessage]}
            {dots}
          </p>
          <p className="text-sm text-foreground">Hold tight, greatness is loading! ✨</p>
        </div>

        {/* Fun Stats */}
        <div className="flex justify-center space-x-8 text-xs text-foreground">
          <div className="text-center">
            <div className="font-mono text-primary">99.9%</div>
            <div>Awesomeness</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-secondary">∞</div>
            <div>Creativity</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-accent">♥</div>
            <div>Passion</div>
          </div>
        </div>
      </div>

      {/* CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export default Loader
