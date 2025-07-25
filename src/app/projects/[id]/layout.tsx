import { projectsAPI } from '../../../util/apiResponse.util'

export async function generateMetadata({ params }: { params: any }) {
  const { id } = await params
  const response = await projectsAPI.getProjectById(id)

  const project = response.data
  if (!project) return {}
  return {
    title: `${project.project_name} | Project | Mishra Shardendu Portfolio`,
    description: project.small_description,
    openGraph: {
      title: `${project.project_name} | Project | Mishra Shardendu Portfolio`,
      description: project.small_description,
      url: `https://mishrashardendu22.is-a.dev/projects/${id}`,
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
  }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
