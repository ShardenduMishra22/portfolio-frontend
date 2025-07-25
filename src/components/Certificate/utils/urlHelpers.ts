export const getYouTubeEmbedUrl = (url: string): string | null => {
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(youtubeRegex)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  return null
}

export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

export const isLinkedInUrl = (url: string): boolean => {
  return url.includes('www.linkedin.com')
}

export const isGitHubUrl = (url: string): boolean => {
  return url.includes('github.com') && !url.includes('github.io')
}

export const getGitHubRepoInfo = (url: string): { owner: string; repo: string } | null => {
  const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/
  const match = url.match(githubRegex)
  if (match && match[1] && match[2]) {
    return { owner: match[1], repo: match[2] }
  }
  return null
}

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
