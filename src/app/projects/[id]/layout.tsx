import { projectsAPI } from '../../../util/apiResponse.util';

export async function generateMetadata({ params }: { params : any}) {
  const response = await projectsAPI.getProjectById(params.id);
  const project = response.data;
  if (!project) return {};
  return {
    title: `${project.project_name} | Project | Mishra Shardendu Portfolio`,
    description: project.small_description,
    openGraph: {
      title: `${project.project_name} | Project | Mishra Shardendu Portfolio`,
      description: project.small_description,
      url: `https://mishrashardendu22.is-a.dev/projects/${params.id}`,
      type: 'article',
      siteName: 'Shardendu Mishra Portfolio',
      images: project.images ? project.images.map((img) => ({ url: img })) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.project_name} | Project | Mishra Shardendu Portfolio`,
      description: project.small_description,
      images: project.images || [],
    },
  };
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
} 