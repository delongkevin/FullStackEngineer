import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProjectsClient from '../../components/ProjectsClient';
import type { Metadata } from 'next';

const siteUrl = 'https://delongkevin.github.io/FullStackEngineer';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore full-stack, mobile, web, and automotive projects by Kevin Delong.',
  alternates: {
    canonical: '/projects/',
  },
  openGraph: {
    title: 'Projects | Kevin Delong',
    description: 'Explore full-stack, mobile, web, and automotive projects by Kevin Delong.',
    url: `${siteUrl}/projects/`,
    type: 'website',
    images: ['/images/og-cover.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Kevin Delong',
    description: 'Explore full-stack, mobile, web, and automotive projects by Kevin Delong.',
    images: ['/images/og-cover.jpg'],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <ProjectsClient />
      </main>

      <Footer />
    </>
  );
}
