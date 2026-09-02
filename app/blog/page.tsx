import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BlogLiveContent from '../../components/BlogLiveContent';
import { blogPosts } from '../../data/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Engineering notes, project updates, and lessons from Kevin Delong.',
  alternates: { canonical: '/blog/' },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogLiveContent initialPosts={blogPosts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
