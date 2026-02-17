import React from 'react';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kevin Delong | Full-Stack Engineer',
  description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
  openGraph: {
    title: 'Kevin Delong | Full-Stack Engineer',
    description: 'Portfolio showcasing full-stack projects, automotive integrations, and mobile apps.',
    url: 'https://delongkevin.github.io/FullStackEngineer',
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
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          {children}
        </div>
      </body>
    </html>
  );
}