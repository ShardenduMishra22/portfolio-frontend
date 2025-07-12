import { ReactNode } from "react";

export const metadata = {
  title: "Admin | Dashboard | Mishra Shardendu Portfolio",
  description: "Admin dashboard for managing portfolio content and statistics.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin | Dashboard | Mishra Shardendu Portfolio",
    description: "Admin dashboard for managing portfolio content and statistics.",
    url: "https://mishrashardendu22.is-a.dev/admin/dashboard",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Admin | Dashboard | Mishra Shardendu Portfolio",
    description: "Admin dashboard for managing portfolio content and statistics.",
  },
};

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 