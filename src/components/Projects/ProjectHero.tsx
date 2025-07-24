import { Project } from '../../data/types.data';

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <div className="mb-12">
      <div className="text-center space-y-6 mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          {project.project_name}
        </h1>
        <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
          {project.small_description}
        </p>
      </div>
    </div>
  );
}
