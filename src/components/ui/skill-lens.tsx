"use client";
import { useState } from "react";
import { Code2 } from "lucide-react";
import { Lens } from "@/components/ui/lens";
import { Badge } from "@/components/ui/badge";

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
          <div className="relative p-8 bg-gradient-to-br from-background via-card/90 to-muted/30 rounded-2xl border border-border/40 shadow-sm">
            <div className="relative z-10 mb-6 text-center">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Tech Stack
                </span>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto" />
            </div>

            <div className="relative z-10 flex flex-wrap gap-3 min-h-[180px] items-center justify-center">
              {skills.map((skill, index) => (
                <Badge 
                  className="px-4 py-2 text-sm font-medium transition-colors duration-200"
                  key={skill + index}
                  variant="secondary" 
                >
                  <span className="relative z-10">{skill}</span>
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Lens>
    </div>
  );
}
