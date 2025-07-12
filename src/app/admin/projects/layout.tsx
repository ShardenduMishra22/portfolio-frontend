import { ReactNode } from "react";

export const metadata = {
  title: "Admin | Projects | Mishra Shardendu Portfolio",
  description: "Admin panel for managing projects in the Mishra Shardendu portfolio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin | Projects | Mishra Shardendu Portfolio",
    description: "Admin panel for managing projects in the Mishra Shardendu portfolio.",
    url: "https://mishrashardendu22.is-a.dev/admin/projects",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Admin | Projects | Mishra Shardendu Portfolio",
    description: "Admin panel for managing projects in the Mishra Shardendu portfolio.",
  },
};

export default function AdminProjectsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 