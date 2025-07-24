import { Project } from '../../data/types.data';

interface ProjectJsonLdProps {
  project: Project;
}

export function ProjectJsonLd({ project }: ProjectJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.project_name,
    description: project.small_description,
    url: `https://mishrashardendu22.is-a.dev/projects/${project.id}`,
    creator: {
      '@type': 'Person',
      name: 'Shardendu Mishra',
    },
    dateCreated: project.created_at,
    keywords: project.skills,
    image: project.images || [],
  };

  return (
    <script 
      type="application/ld+json" 
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} 
    />
  );
}
