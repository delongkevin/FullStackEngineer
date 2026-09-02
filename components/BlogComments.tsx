'use client';

import { FormEvent, useEffect, useState } from 'react';

interface BlogComment {
  id: number;
  authorName: string;
  commentBody: string;
  createdAt: string;
  status?: 'pending' | 'approved' | 'rejected' | 'spam';
  postSlug?: string;
  authorEmail?: string;
}

export default function BlogComments({ postSlug }: { postSlug: string }) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [form, setForm] = useState({ authorName: '', authorEmail: '', commentBody: '', website: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/.netlify/functions/blog-comments?slug=${encodeURIComponent(postSlug)}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error()))
      .then(setComments)
      .catch(() => undefined);
  }, [postSlug]);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(''); setError('');
    const response = await fetch('/.netlify/functions/blog-comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, postSlug }) });
    if (!response.ok) { setError((await response.json()).error || 'Could not submit comment.'); return; }
    setForm({ authorName: '', authorEmail: '', commentBody: '', website: '' });
    setMessage('Thanks. Your comment is awaiting review.');
  }

  return (
    <section className="mt-14 pt-10 border-t theme-border" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-2xl font-bold theme-text-primary mb-2">Comments</h2>
      <p className="theme-text-secondary mb-6">Share your thoughts. Comments appear after review.</p>
      <div className="space-y-5 mb-10">
        {comments.length === 0 ? <p className="theme-text-secondary text-sm">No approved comments yet.</p> : comments.map((comment) => <article key={comment.id} className="surface-subtle rounded-lg p-5"><div className="flex flex-wrap justify-between gap-2 mb-2"><h3 className="font-semibold theme-text-primary">{comment.authorName}</h3><time className="text-sm theme-text-secondary" dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</time></div><p className="theme-text-secondary whitespace-pre-wrap">{comment.commentBody}</p></article>)}
      </div>
      <form onSubmit={submitComment} className="surface-card rounded-xl p-6 space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold theme-text-primary">Leave a comment</h3>
        <div className="grid sm:grid-cols-2 gap-4"><label className="block theme-text-primary font-medium">Name<input required minLength={2} maxLength={80} value={form.authorName} onChange={(event) => setForm({ ...form, authorName: event.target.value })} className="mt-2 w-full px-3 py-2 theme-input rounded-lg font-normal" /></label><label className="block theme-text-primary font-medium">Email <span className="theme-text-secondary font-normal">(not displayed)</span><input required type="email" value={form.authorEmail} onChange={(event) => setForm({ ...form, authorEmail: event.target.value })} className="mt-2 w-full px-3 py-2 theme-input rounded-lg font-normal" /></label></div>
        <label className="block theme-text-primary font-medium">Comment<textarea required minLength={3} maxLength={2000} value={form.commentBody} onChange={(event) => setForm({ ...form, commentBody: event.target.value })} className="mt-2 w-full min-h-32 px-3 py-2 theme-input rounded-lg font-normal" /></label>
        <label className="visually-hidden">Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label>
        {error ? <p role="alert" className="text-red-600">{error}</p> : null}{message ? <p role="status" className="theme-accent-text">{message}</p> : null}
        <button type="submit" className="btn-primary">Submit for review</button>
      </form>
    </section>
  );
}