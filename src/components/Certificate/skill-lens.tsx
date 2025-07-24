'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Code2 } from 'lucide-react';

interface SkillsLensProps {
  skills: string[];
}

export const SkillsLens: React.FC<SkillsLensProps> = ({ skills }) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div className="relative group">
      <div 
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background via-card/90 to-muted/30 p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 rounded-2xl" />
        
        <div className="relative z-10 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Skills Gained
            </span>
          </div>
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />
        </div>
        
        <div className="relative z-10 flex flex-wrap gap-2 min-h-[120px] items-center justify-center">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.1, y: -2, transition: { duration: 0.2 } }}
            >
              <Badge 
                variant="secondary" 
                className="relative px-3 py-1.5 text-sm font-medium bg-background/80 hover:bg-background border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              >
                <span className="relative z-10">{skill}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Badge>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ opacity: hovering ? 0 : 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs text-muted-foreground/80 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-1 bg-primary rounded-full"
          />
          <span>Hover to explore</span>
        </motion.div>
      </div>
    </div>
  );
};
