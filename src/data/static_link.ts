// Social Media Links
export const XProfile = 'https://x.com/Shardendu_M'
export const GitHubProject = 'https://github.com/MishraShardendu22'
export const GitHubLearning = 'https://github.com/ShardenduMishra22'
export const GitHubOrganistaion = 'https://github.com/Team-Parashuram'
export const LeetCodeProfile = 'https://leetcode.com/u/ShardenduMishra22/'
export const YouTubeChannel = 'https://www.youtube.com/@Shardendu_Mishra'
export const CodeChefProfile = 'https://www.codechef.com/users/clutchgod22'
export const LinkedInProfile = 'https://www.linkedin.com/in/shardendumishra22/'
export const CodeforcesProfile = 'https://codeforces.com/profile/ShardenduMishra_22'
export const resumeLink =
  'https://drive.google.com/file/d/1AiCHH7NoA5BqaigPzavo2zBaq6KphSvT/preview'

import { Home, GraduationCap, Code, Briefcase, Award, Mail, User, Glasses } from 'lucide-react'

export const navItems = [
  { href: '#hero', label: 'Home', icon: Home },
  { href: '#education', label: 'Education', icon: GraduationCap },
  { href: '#skills', label: 'Skills', icon: Code },
  { href: '#projects', label: 'Projects', icon: Briefcase },
  { href: '#experience', label: 'Experience', icon: User },
  { href: '#certifications', label: 'Certifications', icon: Award },
  { href: '#contact', label: 'Contact', icon: Mail },
  { href: '/blog', label: 'Blog', icon: Glasses },
]

export interface ProjectHeaderProps {
  totalProjects: number
  totalPages: number
  currentPage: number
}

export interface ProjectFiltersProps {
  selectedSkill: string
  setSelectedSkill: (skill: string) => void
  searchTerm: string
  onSearchChange: (value: string) => void
  allSkills: string[]
}

export interface ProjectCardProps {
  title: string
  description: string
  link: string
  skills?: string[]
  repository?: string
  liveLink?: string
  video?: string
  isHovered: boolean
}

export interface ProjectGridProps {
  items: {
    title: string
    description: string
    link: string
    skills?: string[]
    repository?: string
    liveLink?: string
    video?: string
  }[]
  className?: string
}

export interface ProjectPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
}
