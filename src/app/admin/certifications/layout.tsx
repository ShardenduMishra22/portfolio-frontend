import { ReactNode } from 'react'

export const metadata = {
  title: 'Admin | Certifications | Mishra Shardendu Portfolio',
  description: 'Admin panel for managing certifications in the Mishra Shardendu portfolio.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: 'Admin | Certifications | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing certifications in the Mishra Shardendu portfolio.',
    url: 'https://mishrashardendu22.is-a.dev/admin/certifications',
    type: 'website',
    siteName: 'Shardendu Mishra Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Admin | Certifications | Mishra Shardendu Portfolio',
    description: 'Admin panel for managing certifications in the Mishra Shardendu portfolio.',
  },
}

export default function AdminCertificationsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
