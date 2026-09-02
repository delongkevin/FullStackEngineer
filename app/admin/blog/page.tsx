'use client';

import { FormEvent, useEffect, useState } from 'react';

interface EditablePost {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  sections: { heading: string; paragraphs: string[] }[];
  takeaways: string[];
  isPublished: boolean;
}

const blankPost: EditablePost = {
  slug: '', title: '', excerpt: '', category: 'Engineering Notes', publishedAt: new Date().toISOString().slice(0, 10), readingTime: '3 min read', sections: [{ heading: '', paragraphs: [''] }], takeaways: [], isPublished: false,
};

const sectionsToText = (sections: EditablePost['sections']) => sections
  .map((section) => `${section.heading}\n${section.paragraphs.join('\n')}`)
  .join('\n\n');

const postToForm = (post: EditablePost): EditablePost => ({
  ...post,
  sections: post.sections?.length ? post.sections : blankPost.sections,
});

export default function BlogAdminPage() {
  const [token, setToken] = useState('');
  const [posts, setPosts] = useState<EditablePost[]>([]);
  const [post, setPost] = useState<EditablePost>(blankPost);
  const [sectionsText, setSectionsText] = useState(sectionsToText(blankPost.sections));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem('blog-admin-token');
    if (savedToken) { setToken(savedToken); loadPosts(savedToken); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPosts(authToken = token) {
    setLoading(true); setError('');
    try {
      const response = await fetch('/.netlify/functions/blog-posts', { headers: { Authorization: `Bearer ${authToken}` } });
      if (!response.ok) throw new Error(response.status === 401 ? 'Invalid admin token.' : 'Could not load posts.');
      setPosts(await response.json());
      setAuthorized(true);
      window.sessionStorage.setItem('blog-admin-token', authToken);
    } catch (err) { setAuthorized(false); setError(err instanceof Error ? err.message : 'Could not load posts.'); }
    finally { setLoading(false); }
  }

  async function authenticate(event: FormEvent<HTMLFormElement>) { event.preventDefault(); await loadPosts(); }

  async function savePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      const sections = sectionsText.split(/\n\s*\n/).map((block) => {
        const lines = block.split('\n');
        return { heading: lines.shift()?.trim() ?? '', paragraphs: lines.map((line) => line.trim()).filter(Boolean) };
      }).filter((section) => section.heading || section.paragraphs.length > 0);
      const response = await fetch(`/.netlify/functions/blog-posts${post.id ? `?id=${post.id}` : ''}`, {
        method: post.id ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ ...post, sections }),
      });
      if (!response.ok) throw new Error((await response.json()).error || 'Could not save post.');
      setMessage(post.id ? 'Post updated.' : 'Post created.'); await loadPosts(); setPost(blankPost); setSectionsText(sectionsToText(blankPost.sections));
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save post.'); }
    finally { setLoading(false); }
  }

  async function deletePost(id: number) {
    if (!window.confirm('Delete this post?')) return;
    const response = await fetch(`/.netlify/functions/blog-posts?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) { setMessage('Post deleted.'); await loadPosts(); if (post.id === id) { setPost(blankPost); setSectionsText(sectionsToText(blankPost.sections)); } }
    else setError('Could not delete post.');
  }

  return (
    <main id="main-content" className="min-h-screen px-4 py-12 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap justify-between gap-4 items-start mb-8">
        <div><h1 className="text-3xl font-bold theme-text-primary">Blog editor</h1><p className="theme-text-secondary mt-2">Create and publish Notes &amp; Updates without changing Git.</p></div>
        <a href="/blog" className="btn-secondary">View blog</a>
      </div>
      {!authorized ? (
        <form onSubmit={authenticate} className="surface-card rounded-xl p-6 max-w-xl mb-8">
          <label htmlFor="blog-token" className="block font-semibold theme-text-primary mb-2">Admin token</label>
          <input id="blog-token" type="password" value={token} onChange={(event) => setToken(event.target.value)} className="w-full px-4 py-3 theme-input rounded-lg mb-4" required />
          <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Connecting...' : 'Open editor'}</button>
        </form>
      ) : null}
      {error ? <p role="alert" className="text-red-600 mb-5">{error}</p> : null}
      {message ? <p role="status" className="theme-accent-text mb-5">{message}</p> : null}
      {authorized ? (
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <aside><button type="button" onClick={() => { setPost(blankPost); setSectionsText(sectionsToText(blankPost.sections)); }} className="btn-primary w-full mb-4">New post</button><div className="space-y-2">{posts.map((item) => <div key={item.id} className="surface-card rounded-lg p-3"><button type="button" className="text-left theme-text-primary font-semibold w-full" onClick={() => { const nextPost = postToForm(item); setPost(nextPost); setSectionsText(sectionsToText(nextPost.sections)); }}>{item.title}</button><p className="theme-text-secondary text-sm mt-1">{item.isPublished ? 'Published' : 'Draft'}</p><button type="button" className="text-red-600 text-sm mt-2" onClick={() => item.id && deletePost(item.id)}>Delete</button></div>)}</div></aside>
          <form onSubmit={savePost} className="surface-card rounded-xl p-6 space-y-5">
            {(['title', 'slug', 'excerpt', 'category', 'publishedAt', 'readingTime'] as const).map((field) => <label key={field} className="block theme-text-primary font-semibold capitalize">{field === 'publishedAt' ? 'Published date' : field}<input type={field === 'publishedAt' ? 'date' : 'text'} value={post[field]} onChange={(event) => setPost({ ...post, [field]: event.target.value })} className="mt-2 w-full px-4 py-3 theme-input rounded-lg font-normal" required /></label>)}
            <label className="block theme-text-primary font-semibold">Sections<textarea value={sectionsText} onChange={(event) => setSectionsText(event.target.value)} className="mt-2 w-full min-h-48 px-4 py-3 theme-input rounded-lg font-normal" required /></label>
            <label className="block theme-text-primary font-semibold">Takeaways<input value={post.takeaways.join(', ')} onChange={(event) => setPost({ ...post, takeaways: event.target.value.split(',').map((item) => item.trim()).filter(Boolean) })} className="mt-2 w-full px-4 py-3 theme-input rounded-lg font-normal" /></label>
            <label className="inline-flex items-center gap-3 theme-text-primary font-semibold"><input type="checkbox" checked={post.isPublished} onChange={(event) => setPost({ ...post, isPublished: event.target.checked })} /> Publish this post</label>
            <div><button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Saving...' : post.id ? 'Update post' : 'Create post'}</button></div>
          </form>
        </div>
      ) : null}
    </main>
  );
}