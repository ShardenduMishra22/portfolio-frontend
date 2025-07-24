import { useState } from "react";
import { cn } from "@/lib/utils";
import ProjectCards from "./project-card";
import { AnimatePresence, motion } from "motion/react";

interface ProjectGridProps {
  items: {
    title: string;
    description: string;
    link: string;
    skills?: string[];
    repository?: string;
    liveLink?: string;
    video?: string;
  }[];
  className?: string;
}

export default function ProjectGrid({ items, className }: ProjectGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid auto-rows-fr py-6", className)}>
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
          <ProjectCards
            title={item.title}
            description={item.description}
            link={item.link}
            skills={item.skills}
            repository={item.repository}
            liveLink={item.liveLink}
            video={item.video} 
            isHovered={false}          
           />
        </div>
      ))}
    </div>
  );
}
