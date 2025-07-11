export const metadata = {
  title: "Admin Login | Mishra Shardendu Portfolio",
  description: "Login to the admin panel of the Mishra Shardendu portfolio.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Admin Login | Mishra Shardendu Portfolio",
    description: "Login to the admin panel of the Mishra Shardendu portfolio.",
    url: "https://mishrashardendu.com/admin/login",
    type: "website",
    siteName: "Shardendu Mishra Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Admin Login | Mishra Shardendu Portfolio",
    description: "Login to the admin panel of the Mishra Shardendu portfolio.",
  },
};

import { ReactNode } from "react";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 