import type { Metadata } from 'next';
import Script from 'next/script';
import { Fraunces, IBM_Plex_Sans, Manrope, Merriweather, Sora, Space_Grotesk } from 'next/font/google';
import './globals.css';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-ibm-plex-sans' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kevin Delong | Full-Stack Engineer',
    template: '%s | Kevin Delong',
  },
  description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
  keywords: ['Kevin Delong', 'Full Stack Engineer', 'React', 'Next.js', 'Mobile Development', 'Automotive Software'],
  authors: [{ name: 'Kevin Douglas Delong', url: siteUrl }],
  creator: 'Kevin Douglas Delong',
  publisher: 'Kevin Douglas Delong',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
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
      'https://x.com/delongkevin1446',
    ],
  };

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sora.variable} ${ibmPlexSans.variable} ${spaceGrotesk.variable} ${merriweather.variable} ${fraunces.variable}`}
    >
      <body>
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
        <div className="min-h-screen app-shell-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
