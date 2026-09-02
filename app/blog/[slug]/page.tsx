import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Check, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BlogAudioControls from '../../../components/BlogAudioControls';
import { blogPosts, getBlogPost } from '../../../data/blog';

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);

  return post ? {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.publishedAt },
  } : {};
}

const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
}).format(new Date(`${date}T00:00:00`));

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const postJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { '@type': 'Person', name: 'Kevin Douglas Delong' },
  };

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd) }} />
      <main id="main-content" className="pt-24 pb-16 min-h-screen">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 theme-accent-text hover:opacity-80 mb-8" aria-label="Back to blog">
            <ArrowLeft size={18} aria-hidden="true" /> Back to blog
          </Link>
          <header className="mb-10 sm:mb-14">
            <p className="theme-accent-text text-sm font-semibold uppercase tracking-wider mb-4">{post.category}</p>
            <h1 className="text-4xl sm:text-5xl font-bold theme-text-primary leading-tight mb-5">{post.title}</h1>
            <p className="text-xl theme-text-secondary leading-relaxed max-w-3xl mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 theme-text-secondary text-sm">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" />{formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={16} aria-hidden="true" />{post.readingTime}</span>
            </div>
            <div className="mt-7 max-w-xl">
              <BlogAudioControls title={post.title} excerpt={post.excerpt} sections={post.sections} />
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_240px] gap-10 lg:gap-16 items-start">
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading} aria-labelledby={`section-${section.heading}`}>
                  <h2 id={`section-${section.heading}`} className="text-2xl font-bold theme-text-primary mb-4">{section.heading}</h2>
                  <div className="space-y-4 theme-text-secondary text-lg leading-relaxed">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>
            <aside className="surface-subtle rounded-xl p-6" aria-labelledby="takeaways-heading">
              <h2 id="takeaways-heading" className="text-lg font-bold theme-text-primary mb-4">Key takeaways</h2>
              <ul className="space-y-4 theme-text-secondary text-sm">
                {post.takeaways.map((takeaway) => <li key={takeaway} className="flex gap-3"><Check className="theme-accent-text shrink-0" size={17} aria-hidden="true" />{takeaway}</li>)}
              </ul>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}