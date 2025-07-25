import {
  Github,
  Linkedin,
  Mail,
  Code,
  Settings,
  GraduationCap,
  Briefcase,
  Award,
  Phone,
} from 'lucide-react'

import {
  XProfile,
  GitHubProject,
  GitHubLearning,
  GitHubOrganistaion,
  LeetCodeProfile,
  YouTubeChannel,
  CodeChefProfile,
  LinkedInProfile,
  CodeforcesProfile,
} from '@/data/static_link'

import { LinkItem } from './types'

export const quickLinks: LinkItem[] = [
  {
    href: '/admin/login',
    label: 'Admin Dashboard',
    shortLabel: 'Admin',
    icon: <Settings className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: '#projects',
    label: 'Projects',
    shortLabel: 'Projects',
    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: '#experience',
    label: 'Experience',
    shortLabel: 'Exp',
    icon: <Briefcase className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: '#certifications',
    label: 'Certifications',
    shortLabel: 'Certs',
    icon: <Award className="h-3 lg:h-4 w-3 lg:w-4" />,
  }
]

export const socialLinks: LinkItem[] = [
  {
    href: XProfile,
    label: 'Twitter / X',
    shortLabel: 'X',
    icon: (
      <svg
        className="h-3 lg:h-4 w-3 lg:w-4"
        fill="currentColor"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: LinkedInProfile,
    label: 'LinkedIn',
    shortLabel: 'LinkedIn',
    icon: <Linkedin className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: YouTubeChannel,
    label: 'YouTube',
    shortLabel: 'YouTube',
    icon: (
      <svg
        className="h-3 lg:h-4 w-3 lg:w-4"
        fill="currentColor"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    href: 'mailto:shardendumishra01@gmail.com',
    label: 'Email',
    shortLabel: 'Email',
    icon: <Mail className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
]

export const codingProfiles: LinkItem[] = [
  {
    href: GitHubProject,
    label: 'GitHub Main',
    shortLabel: 'Main',
    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: GitHubLearning,
    label: 'GitHub Learning',
    shortLabel: 'Learning',
    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: GitHubOrganistaion,
    label: 'Team Parashuram',
    shortLabel: 'Team',
    icon: <Github className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: LeetCodeProfile,
    label: 'LeetCode',
    shortLabel: 'LeetCode',
    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
]

export const additionalProfiles: LinkItem[] = [
  {
    href: CodeChefProfile,
    label: 'CodeChef',
    shortLabel: 'CodeChef',
    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: CodeforcesProfile,
    label: 'Codeforces',
    shortLabel: 'Codeforces',
    icon: <Code className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: '#education',
    label: 'Education',
    shortLabel: 'Education',
    icon: <GraduationCap className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
  {
    href: '#contact',
    label: 'Contact Me',
    shortLabel: 'Contact',
    icon: <Phone className="h-3 lg:h-4 w-3 lg:w-4" />,
  },
]

export const techStack = ['Go', 'Next.js', 'React', 'TypeScript', 'Tailwind']

export const quickConnectLinks = [
  { href: GitHubProject, label: 'GitHub', icon: <Github className="h-4 w-4" /> },
  {
    href: LinkedInProfile,
    label: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />,
  },
  {
    href: XProfile,
    label: 'Twitter',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.80l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: 'mailto:shardendumishra01@gmail.com',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
  },
]
