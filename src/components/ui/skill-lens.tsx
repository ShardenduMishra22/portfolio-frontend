"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { Lens } from "@/components/ui/lens";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Code2 } from "lucide-react";

interface SkillsLensProps {
  skills: string[];
}

export function SkillsLens({ skills }: SkillsLensProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="relative group">
      <Lens 
        hovering={hovering} 
        setHovering={setHovering}
        zoomFactor={1.6}
        lensSize={240}
      >
        <div className="relative overflow-hidden">
          {/* Main Container */}
          <div className="relative p-8 bg-gradient-to-br from-background via-card/90 to-muted/30 rounded-2xl border border-border/40 shadow-sm">
            
            {/* Animated Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 rounded-2xl" />
            
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.primary)_1px,_transparent_1px)] bg-[length:24px_24px] rounded-2xl" />
            
            {/* Floating Particles */}
            <div className="absolute top-4 right-4 opacity-20">
              <motion.div
                animate={{ 
                  rotate: hovering ? 180 : 0,
                  scale: hovering ? 1.2 : 1 
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Sparkles className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            {/* Header Section */}
            <div className="relative z-10 mb-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 mb-2"
              >
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Tech Stack
                </span>
              </motion.div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />
            </div>
            
            {/* Skills Grid */}
            <div className="relative z-10 flex flex-wrap gap-3 min-h-[180px] items-center justify-center">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.6, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  className="group/badge"
                >
                  <Badge 
                    variant="secondary" 
                  >
                    {/* Badge glow effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge content */}
                    <span className="relative z-10">{skill}</span>
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-700" />
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            {/* Bottom Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: hovering ? 0 : 1 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/30 shadow-sm">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">{skills.length} Technologies</span>
              </div>
            </motion.div>

            {/* Hover instruction with better styling */}
            <motion.div
              animate={{
                opacity: hovering ? 0 : 1,
                y: hovering ? 10 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground/80 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/20 shadow-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-1 bg-primary rounded-full"
              />
              <span className="font-medium">Hover to explore</span>
            </motion.div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />
          </div>

          {/* Outer Glow Effect */}
          <motion.div
            animate={{
              opacity: hovering ? 0.6 : 0,
              scale: hovering ? 1.05 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl -z-10"
          />
        </div>
      </Lens>
    </div>
  );
}
