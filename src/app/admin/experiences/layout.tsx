import { ReactNode } from "react";

export const metadata = {
  title: "Admin | Experiences | Mishra Shardendu Portfolio",
  description: "Admin panel for managing experiences in the Mishra Shardendu portfolio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin | Experiences | Mishra Shardendu Portfolio",
    description: "Admin panel for managing experiences in the Mishra Shardendu portfolio.",
    url: "https://mishrashardendu22.is-a.dev/admin/experiences",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Admin | Experiences | Mishra Shardendu Portfolio",
    description: "Admin panel for managing experiences in the Mishra Shardendu portfolio.",
  },
};

export default function AdminExperiencesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 