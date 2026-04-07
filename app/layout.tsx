import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Kevin Delong | Full-Stack Engineer',
  description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
  keywords: ['Kevin Delong', 'Full Stack Engineer', 'React', 'Next.js', 'Mobile Development', 'Automotive Software'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kevin Delong | Full-Stack Engineer',
    description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
    url: siteUrl,
    type: 'website',
    images: ['/images/og-cover.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kevin Delong | Full-Stack Engineer',
    description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
    images: ['/images/og-cover.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kevin Douglas Delong',
    jobTitle: 'Full-Stack Engineer',
    email: 'mailto:delong.kevin@gmail.com',
    url: siteUrl,
    sameAs: [
      'https://github.com/delongkevin',
      'https://www.linkedin.com/in/kevin-delong-50726135b/',
      'https://x.com/delongkevin1446',
    ],
  };

  return (
    <html lang="en">
      <body className="font-sans">
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
}