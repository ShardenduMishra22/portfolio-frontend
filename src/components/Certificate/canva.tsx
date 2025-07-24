import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { CanvasRevealEffect } from "../ui/canvas-reveal-effect";

export const CanvasCard = ({
  title,
  icon,
  children,
  animationSpeed = 3,
  containerClassName = "bg-blue-900",
  colors = [[59, 130, 246], [147, 197, 253]],
  dotSize = 1.5,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  animationSpeed?: number;
  containerClassName?: string;
  colors?: number[][];
  dotSize?: number;
}) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-border/50 group/canvas-card w-full relative h-auto min-h-[200px] rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="absolute h-4 w-4 -top-2 -left-2 text-primary opacity-30">
        <Sparkles className="h-full w-full" />
      </div>
      <div className="absolute h-4 w-4 -bottom-2 -right-2 text-primary opacity-30">
        <Sparkles className="h-full w-full" />
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={animationSpeed}
              containerClassName={containerClassName}
              colors={colors}
              dotSize={dotSize}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 p-6 flex flex-col justify-between h-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-primary group-hover/canvas-card:text-white transition-colors duration-200">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground group-hover/canvas-card:text-white transition-colors duration-200">
              {title}
            </h3>
          </div>
        </div>
        <div className="group-hover/canvas-card:text-white transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};