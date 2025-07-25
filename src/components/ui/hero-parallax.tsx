'use client'
import React, { useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion'
import { Badge } from './badge'
import { Button } from './button'
import { Card, CardDescription, CardTitle } from './card'
import { ExternalLink, Github, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export interface HeroProject {
  inline: { id: string }
  project_name: string
  small_description: string
  skills: string[]
  project_live_link?: string
  project_repository?: string
}

export const HeroParallax = ({ projects }: { projects: HeroProject[] }) => {
  // 🚀 PERFORMANCE OPTIMIZATION: Better card distribution
  const optimizedProjects = useMemo(() => {
    return projects.slice(0, 12) // Increased to 12 for better balance
  }, [projects])

  // 🚀 LAYOUT FIX: Redistributed cards for balanced rows
  const firstRow = useMemo(() => optimizedProjects.slice(0, 4), [optimizedProjects]) // Increased to 4
  const secondRow = useMemo(() => optimizedProjects.slice(4, 8), [optimizedProjects]) // 4 cards
  const thirdRow = useMemo(() => optimizedProjects.slice(8, 12), [optimizedProjects]) // 4 cards

  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = useMemo(
    () => ({
      stiffness: 100,
      damping: 40,
      bounce: 25,
    }),
    []
  )

  // Create individual spring animations at the top level
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 600]), // Reduced for better performance
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -600]),
    springConfig
  )
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-500, 300]), springConfig)

  const transforms = useMemo(
    () => ({
      translateX,
      translateXReverse,
      rotateX,
      opacity,
      rotateZ,
      translateY,
    }),
    [translateX, translateXReverse, rotateX, opacity, rotateZ, translateY]
  )

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <Header />
      <motion.div
        style={{
          rotateX: transforms.rotateX,
          rotateZ: transforms.rotateZ,
          translateY: transforms.translateY,
          opacity: transforms.opacity,
          willChange: 'transform, opacity',
        }}
        className=""
      >
        {/* 🚀 LAYOUT FIX: Balanced first row */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 mb-20 justify-center">
          {firstRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateX}
              key={project.inline.id}
              index={index + 1}
            />
          ))}
        </motion.div>

        {/* 🚀 LAYOUT FIX: Balanced second row */}
        <motion.div className="flex flex-row mb-20 space-x-6 justify-center">
          {secondRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateXReverse}
              key={project.inline.id}
              index={index + 5}
            />
          ))}
        </motion.div>

        {/* 🚀 LAYOUT FIX: Balanced third row */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-6 justify-center">
          {thirdRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateX}
              key={project.inline.id}
              index={index + 9}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Alternative approach with responsive card sizing
export const HeroParallaxResponsive = ({ projects }: { projects: HeroProject[] }) => {
  const optimizedProjects = useMemo(() => {
    return projects.slice(0, 9) // Keep 9 but distribute better
  }, [projects])

  // 🚀 LAYOUT FIX: Even distribution with 3-3-3 pattern
  const firstRow = useMemo(() => optimizedProjects.slice(0, 3), [optimizedProjects])
  const secondRow = useMemo(() => optimizedProjects.slice(3, 6), [optimizedProjects])
  const thirdRow = useMemo(() => optimizedProjects.slice(6, 9), [optimizedProjects])

  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = useMemo(
    () => ({
      stiffness: 100,
      damping: 40,
      bounce: 25,
    }),
    []
  )

  // Create individual spring animations at the top level
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 400]), // Even more reduced
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -400]),
    springConfig
  )
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig)
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig)
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig)
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-400, 200]), // Further reduced
    springConfig
  )

  const transforms = useMemo(
    () => ({
      translateX,
      translateXReverse,
      rotateX,
      opacity,
      rotateZ,
      translateY,
    }),
    [translateX, translateXReverse, rotateX, opacity, rotateZ, translateY]
  )

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <Header />
      <motion.div
        style={{
          rotateX: transforms.rotateX,
          rotateZ: transforms.rotateZ,
          translateY: transforms.translateY,
          opacity: transforms.opacity,
          willChange: 'transform, opacity',
        }}
        className=""
      >
        {/* 🚀 LAYOUT FIX: Perfectly balanced rows with wider cards */}
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 mb-20 justify-center">
          {firstRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateX}
              key={project.inline.id}
              index={index + 1}
              className="w-[450px]" // Slightly wider cards
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row mb-20 space-x-8 justify-center">
          {secondRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateXReverse}
              key={project.inline.id}
              index={index + 4}
              className="w-[450px]"
            />
          ))}
        </motion.div>

        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8 justify-center">
          {thirdRow.map((project, index) => (
            <ProjectCard
              project={project}
              translate={transforms.translateX}
              key={project.inline.id}
              index={index + 7}
              className="w-[450px]"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Updated ProjectCard with optional className prop
export const ProjectCard = React.memo(
  ({
    project,
    translate,
    index,
    className = 'w-[400px]',
  }: {
    project: HeroProject
    translate: MotionValue<number>
    index: number
    className?: string
  }) => {
    const displaySkills = useMemo(() => project.skills.slice(0, 3), [project.skills])
    const remainingSkillsCount = useMemo(
      () => (project.skills.length > 3 ? project.skills.length - 3 : 0),
      [project.skills.length]
    )

    return (
      <motion.div
        style={{
          x: translate,
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        whileHover={{
          y: -15,
          transition: { duration: 0.2, ease: 'easeOut' },
        }}
        key={project.inline.id}
        className={`group/product h-[500px] ${className} relative shrink-0`}
      >
        {/* Rest of the ProjectCard implementation stays the same */}
        <Card className="h-full w-full relative overflow-hidden border border-border/30 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-card/95 backdrop-blur-sm hover:bg-card/100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.01] to-secondary/[0.01] opacity-0 group-hover/product:opacity-100 transition-opacity duration-300"></div>

          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary via-primary/90 to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-xl border-2 border-primary/20 z-10">
            {String(index).padStart(2, '0')}
          </div>

          <div className="relative z-10 p-6 h-full flex flex-col">
            <div className="flex-1 space-y-4">
              <div className="pr-12">
                <CardTitle className="text-xl font-bold group-hover/product:text-primary transition-colors duration-200 leading-tight mb-3">
                  {project.project_name}
                </CardTitle>
                <CardDescription className="font-medium text-sm text-foreground/80 mb-4 line-clamp-3">
                  {project.small_description}
                </CardDescription>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {displaySkills.map((skill, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs px-2 py-1 bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors duration-200 font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
                {remainingSkillsCount > 0 && (
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors duration-200 font-medium"
                  >
                    +{remainingSkillsCount} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <div className="flex gap-2">
                {project.project_live_link && (
                  <a
                    href={project.project_live_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground border-0 shadow-lg hover:shadow-primary/25 transition-all duration-200 font-medium"
                    >
                      <ExternalLink className="mr-1.5 h-3 w-3" />
                      <span className="text-xs">Live Demo</span>
                    </Button>
                  </a>
                )}

                {project.project_repository && (
                  <a
                    href={project.project_repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border border-primary/20 hover:border-primary/40 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-200 font-medium"
                    >
                      <Github className="mr-1.5 h-3 w-3" />
                      <span className="text-xs">Code</span>
                    </Button>
                  </a>
                )}
              </div>

              <Link href={`/projects/${project.inline.id}`} className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full group/btn relative overflow-hidden hover:bg-secondary/10 transition-all duration-200 font-medium"
                >
                  <span className="relative flex items-center justify-center text-foreground group-hover/btn:text-secondary text-xs">
                    View Details
                    <ArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover/btn:translate-x-1 duration-200" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }
)

ProjectCard.displayName = 'ProjectCard'

export const Header = React.memo(() => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        Featured <br /> Projects Showcase
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        Explore my portfolio of innovative projects built with cutting-edge technologies. Each
        project demonstrates expertise in modern development practices and creative problem-solving.
      </p>
    </div>
  )
})

Header.displayName = 'Header'
