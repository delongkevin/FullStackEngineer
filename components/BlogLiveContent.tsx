'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, PenLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BlogPost } from '../data/blog';

interface BlogLiveContentProps {
  initialPosts: BlogPost[];
}

type StoredPost = BlogPost & { id?: number; isPublished?: boolean };

const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
}).format(new Date(`${date}T00:00:00`));

export default function BlogLiveContent({ initialPosts }: BlogLiveContentProps) {
  const [posts, setPosts] = useState<StoredPost[]>(initialPosts);

  useEffect(() => {
    fetch('/.netlify/functions/blog-posts')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Blog unavailable')))
      .then((livePosts: StoredPost[]) => { if (livePosts.length > 0) setPosts(livePosts); })
      .catch(() => undefined);
  }, []);

  const featuredPost = posts.find((post) => post.featured) ?? posts[0];
  const otherPosts = posts.filter((post) => post.slug !== featuredPost.slug);
  const postHref = (post: StoredPost) => post.id ? `/blog/read/?slug=${encodeURIComponent(post.slug)}` : `/blog/${post.slug}`;

  return (
    <>
      <section className="mb-12 sm:mb-16 max-w-3xl" aria-labelledby="blog-heading">
        <div className="inline-flex items-center gap-2 theme-accent-text text-sm font-semibold uppercase tracking-wider mb-4"><PenLine size={16} aria-hidden="true" />Notes from the workbench</div>
        <h1 id="blog-heading" className="text-4xl sm:text-5xl font-bold theme-text-primary mb-5">Notes &amp; Updates</h1>
        <p className="text-lg sm:text-xl theme-text-secondary leading-relaxed">Thoughts on building useful software, learning across platforms, and the decisions behind the projects.</p>
      </section>
      {featuredPost && <article className="surface-card rounded-2xl shadow-lg overflow-hidden mb-12" aria-labelledby="featured-post-title">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 sm:p-10 lg:p-12"><p className="theme-accent-text text-sm font-semibold uppercase tracking-wider mb-5">Featured note</p><h2 id="featured-post-title" className="text-3xl sm:text-4xl font-bold theme-text-primary mb-5">{featuredPost.title}</h2><p className="theme-text-secondary text-lg leading-relaxed mb-7">{featuredPost.excerpt}</p><div className="flex flex-wrap items-center gap-x-5 gap-y-2 theme-text-secondary text-sm mb-8"><span className="inline-flex items-center gap-2"><CalendarDays size={16} aria-hidden="true" />{formatDate(featuredPost.publishedAt)}</span><span className="inline-flex items-center gap-2"><Clock3 size={16} aria-hidden="true" />{featuredPost.readingTime}</span></div><Link href={postHref(featuredPost)} className="btn-primary inline-flex items-center gap-2">Read the note <ArrowRight size={18} aria-hidden="true" /></Link></div>
          <div className="surface-subtle p-6 sm:p-10 flex flex-col justify-end min-h-56"><span className="theme-text-secondary text-sm mb-3">In this entry</span><ul className="space-y-3 theme-text-primary font-medium">{featuredPost.takeaways.map((takeaway) => <li key={takeaway} className="flex gap-3"><span className="theme-accent-text" aria-hidden="true">/</span>{takeaway}</li>)}</ul></div>
        </div>
      </article>}
      <section aria-labelledby="recent-posts-heading"><div className="flex items-end justify-between gap-4 mb-6"><div><p className="theme-accent-text text-sm font-semibold uppercase tracking-wider mb-2">More to explore</p><h2 id="recent-posts-heading" className="text-2xl sm:text-3xl font-bold theme-text-primary">Recent entries</h2></div><span className="theme-text-secondary text-sm">{posts.length} notes</span></div><div className="grid md:grid-cols-2 gap-6">{otherPosts.map((post) => <article key={post.slug} className="surface-card rounded-xl p-6 sm:p-8 border theme-border flex flex-col"><p className="theme-accent-text text-sm font-semibold mb-4">{post.category}</p><h3 className="text-2xl font-bold theme-text-primary mb-3">{post.title}</h3><p className="theme-text-secondary leading-relaxed mb-6 flex-1">{post.excerpt}</p><div className="flex items-center justify-between gap-4 text-sm theme-text-secondary"><span>{formatDate(post.publishedAt)} · {post.readingTime}</span><Link href={postHref(post)} className="theme-accent-text font-semibold inline-flex items-center gap-1" aria-label={`Read ${post.title}`}>Read <ArrowRight size={16} aria-hidden="true" /></Link></div></article>)}</div></section>
    </>
  );
}