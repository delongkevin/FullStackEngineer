'use client';

import { useEffect, useState } from 'react';

interface CommentRow { id: number; postSlug: string; authorName: string; authorEmail: string; commentBody: string; status: string; createdAt: string; }

export default function CommentsAdminPage() {
  const [token, setToken] = useState('');
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { const saved = window.sessionStorage.getItem('blog-admin-token'); if (saved) { setToken(saved); loadComments(saved); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadComments(authToken = token) {
    const response = await fetch('/.netlify/functions/blog-comments', { headers: { Authorization: `Bearer ${authToken}` } });
    if (!response.ok) { setAuthorized(false); setError('Invalid admin token or unavailable comments.'); return; }
    setComments(await response.json()); setAuthorized(true); setError(''); window.sessionStorage.setItem('blog-admin-token', authToken);
  }

  async function moderate(id: number, status: string) {
    const response = await fetch(`/.netlify/functions/blog-comments?id=${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (response.ok) setComments(comments.map((comment) => comment.id === id ? { ...comment, status } : comment)); else setError('Could not update comment.');
  }

  return <main id="main-content" className="min-h-screen px-4 py-12 sm:px-6 max-w-6xl mx-auto"><div className="flex justify-between gap-4 mb-8"><div><h1 className="text-3xl font-bold theme-text-primary">Comment moderation</h1><p className="theme-text-secondary mt-2">Review feedback before it appears on the site.</p></div><a href="/blog" className="btn-secondary">View blog</a></div>{!authorized ? <form onSubmit={(event) => { event.preventDefault(); loadComments(); }} className="surface-card rounded-xl p-6 max-w-xl"><label className="block font-semibold theme-text-primary">Admin token<input type="password" value={token} onChange={(event) => setToken(event.target.value)} className="mt-2 w-full px-4 py-3 theme-input rounded-lg" required /></label><button className="btn-primary mt-4">Open moderation</button></form> : <div className="space-y-5">{comments.length === 0 ? <p className="theme-text-secondary">No comments yet.</p> : comments.map((comment) => <article key={comment.id} className="surface-card rounded-xl p-6"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold theme-text-primary">{comment.authorName} <span className="font-normal theme-text-secondary">({comment.authorEmail})</span></h2><p className="text-sm theme-text-secondary">{comment.postSlug} · {new Date(comment.createdAt).toLocaleString()}</p></div><span className="theme-chip rounded-full px-3 py-1 text-sm">{comment.status}</span></div><p className="theme-text-secondary whitespace-pre-wrap my-5">{comment.commentBody}</p><div className="flex flex-wrap gap-3"><button type="button" className="btn-primary py-2 px-4" onClick={() => moderate(comment.id, 'approved')}>Approve</button><button type="button" className="btn-secondary py-2 px-4" onClick={() => moderate(comment.id, 'rejected')}>Reject</button><button type="button" className="btn-secondary py-2 px-4" onClick={() => moderate(comment.id, 'spam')}>Spam</button></div></article>)}</div>}{error ? <p role="alert" className="text-red-600 mt-6">{error}</p> : null}</main>;
}