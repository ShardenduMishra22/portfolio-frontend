import { ReactNode } from 'react';
import { certificationsAPI } from '../../../util/apiResponse.util';

export async function generateMetadata({ params }: { params: any }) {
  const response = await certificationsAPI.getCertificationById(params.id);
  const cert = response.data;
  if (!cert) return {};
  return {
    title: `${cert.title} | Certification | Mishra Shardendu Portfolio`,
    description: cert.description,
    openGraph: {
      title: `${cert.title} | Certification | Mishra Shardendu Portfolio`,
      description: cert.description,
      url: `https://mishrashardendu22.is-a.dev/certifications/${params.id}`,
      type: 'article',
      siteName: 'Shardendu Mishra Portfolio',
      images: cert.images ? cert.images.map((img) => ({ url: img })) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cert.title} | Certification | Mishra Shardendu Portfolio`,
      description: cert.description,
      images: cert.images || [],
    },
  };
}

export default function CertificationDetailLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
} 