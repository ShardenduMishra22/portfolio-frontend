import { ReactNode } from "react";

export const metadata = {
  title: "Admin | Profile | Mishra Shardendu Portfolio",
  description: "Admin profile management for the Mishra Shardendu portfolio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin | Profile | Mishra Shardendu Portfolio",
    description: "Admin profile management for the Mishra Shardendu portfolio.",
    url: "https://mishrashardendu22.is-a.dev/admin/profile",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Admin | Profile | Mishra Shardendu Portfolio",
    description: "Admin profile management for the Mishra Shardendu portfolio.",
  },
};

export default function AdminProfileLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 